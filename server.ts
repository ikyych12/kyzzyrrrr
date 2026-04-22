import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs-extra";
import { Telegraf } from "telegraf";
import { waService } from "./whatsapp.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(process.cwd(), "db.json");

// Ensure DB exists with default structure if missing
if (!fs.existsSync(DB_PATH)) {
  fs.writeJsonSync(DB_PATH, {
    users: [],
    settings: { 
      webToApkAccess: 'all',
      panelDiscount: 0,
      vpsPrices: {
        r4c2: '12.000',
        r8c4: '15.000',
        reseller: '18.000',
        admin: '25.000',
        owner: '40.000'
      },
      panelPrices: [
        { size: '1GB', basePrice: 3000 },
        { size: '2GB', basePrice: 4000 },
        { size: '3GB', basePrice: 6000 },
        { size: '4GB', basePrice: 8000 },
        { size: '5GB', basePrice: 10000 },
        { size: '6GB', basePrice: 12000 },
        { size: '7GB', basePrice: 14000 },
        { size: '8GB', basePrice: 16000 },
        { size: '9GB', basePrice: 18000 },
        { size: '10GB', basePrice: 20000 },
        { size: 'UNLIMITED', basePrice: 13000, originalPrice: 22000 },
      ]
    }
  }, { spaces: 2 });
}

// Telegram Bot Setup
const botToken = process.env.TELEGRAM_BOT_TOKEN || "8601224645:AAFjPXrlB8t0oiMvaqPhwKlvzd5aUBP3DLU";
const ownerId = 6926037855;
const bot = new Telegraf(botToken);

bot.start((ctx) => {
  if (ctx.from.id !== ownerId) return ctx.reply("❌ Access Denied @kyzzynew only.");
  ctx.reply("👋 *KYZZYY ADMIN BOT ACTIVE*\n\nCommands:\n/users - List users\n/ban <username> - Ban user\n/unban <username> - Unban user\n/addpremium <username> <1d|7d|permanent> - Add premium\n/editprice <item> <price> - Edit price\n/settings - View settings", { parse_mode: "Markdown" });
});

bot.command("users", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const db = await fs.readJson(DB_PATH);
  if (db.users.length === 0) return ctx.reply("No users yet.");
  const list = db.users.map((u: any) => `- ${u.username} (${u.nomor}) [${u.role}]${u.isBanned ? ' [BANNED]' : ''}`).join("\n");
  ctx.reply(`👥 *TOTAL USERS: ${db.users.length}*\n\n${list.substring(0, 4000)}`, { parse_mode: "Markdown" });
});

bot.command("ban", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const username = ctx.payload.trim();
  if (!username) return ctx.reply("Usage: /ban <username>");
  
  const db = await fs.readJson(DB_PATH);
  const user = db.users.find((u: any) => u.username === username);
  if (!user) return ctx.reply("User not found.");
  
  user.isBanned = true;
  await fs.writeJson(DB_PATH, db, { spaces: 2 });
  ctx.reply(`✅ User *${username}* banned.`, { parse_mode: "Markdown" });
});

bot.command("unban", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const username = ctx.payload.trim();
  if (!username) return ctx.reply("Usage: /unban <username>");
  
  const db = await fs.readJson(DB_PATH);
  const user = db.users.find((u: any) => u.username === username);
  if (!user) return ctx.reply("User not found.");
  
  user.isBanned = false;
  await fs.writeJson(DB_PATH, db, { spaces: 2 });
  ctx.reply(`✅ User *${username}* unbanned.`, { parse_mode: "Markdown" });
});

bot.command("addpremium", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const parts = ctx.payload.trim().split(" ");
  const username = parts[0];
  const type = parts[1];
  if (!username || !type) return ctx.reply("Usage: /addpremium <username> <1d|7d|permanent>");
  
  const db = await fs.readJson(DB_PATH);
  const user = db.users.find((u: any) => u.username === username);
  if (!user) return ctx.reply("User not found.");
  
  user.premiumType = type;
  if (type === 'permanent') {
    user.premiumExpired = null;
  } else if (type === '1d') {
    user.premiumExpired = Date.now() + 24 * 60 * 60 * 1000;
  } else if (type === '7d') {
    user.premiumExpired = Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
  
  await fs.writeJson(DB_PATH, db, { spaces: 2 });
  ctx.reply(`👑 Premium *${type}* added to *${username}*.`, { parse_mode: "Markdown" });
});

bot.command("editprice", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const [item, price] = ctx.payload.trim().split(" ");
  if (!item || !price) return ctx.reply("Usage: /editprice <item_key> <price_string>\nExample: /editprice r4c2 10.000");
  
  const db = await fs.readJson(DB_PATH);
  if (db.settings.vpsPrices[item]) {
    db.settings.vpsPrices[item] = price;
    await fs.writeJson(DB_PATH, db, { spaces: 2 });
    ctx.reply(`💰 Price for *${item}* updated to *${price}*.`, { parse_mode: "Markdown" });
  } else {
    ctx.reply("Invalid item key. Valid: r4c2, r8c4, reseller, admin, owner");
  }
});

bot.command("settings", async (ctx) => {
  if (ctx.from.id !== ownerId) return;
  const db = await fs.readJson(DB_PATH);
  ctx.reply(`⚙️ *SETTINGS*\n\nVPS Prices:\n${JSON.stringify(db.settings.vpsPrices, null, 2)}\n\nPanel Discount: ${db.settings.panelDiscount}%`, { parse_mode: "Markdown" });
});

if (botToken && botToken !== "YOUR_BOT_TOKEN") {
  bot.launch()
    .then(() => console.log("🤖 Telegram Bot Started Successfully"))
    .catch(err => {
      console.error("❌ Bot launch failed. The token might be invalid or unauthorized.");
      console.error("Token used:", botToken.substring(0, 5) + "...");
      // Gracefully continue without bot
    });
} else {
  console.log("⚠️ No Telegram Bot token provided, skipping bot launch.");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 3000);

  // Initialize WhatsApp on startup
  try {
    await waService.init();
    console.log("🟢 WhatsApp Service Initialized");
  } catch (err) {
    console.error("🔴 Failed to initialize WhatsApp:", err);
  }

  app.use(express.json());

  // API Route: Get Client Information
  app.get("/api/client-info", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
  });

  // DB API Routes
  app.get("/api/db/users", async (req, res) => {
    const db = await fs.readJson(DB_PATH);
    res.json(db.users);
  });

  app.post("/api/db/users", async (req, res) => {
    const db = await fs.readJson(DB_PATH);
    db.users = req.body;
    await fs.writeJson(DB_PATH, db, { spaces: 2 });
    res.json({ status: "success" });
  });

  app.get("/api/db/settings", async (req, res) => {
    const db = await fs.readJson(DB_PATH);
    res.json(db.settings);
  });

  app.post("/api/db/settings", async (req, res) => {
    const db = await fs.readJson(DB_PATH);
    db.settings = req.body;
    await fs.writeJson(DB_PATH, db, { spaces: 2 });
    res.json({ status: "success" });
  });

  // API Route: Check Telegram Membership
  app.post("/api/telegram/check-membership", async (req, res) => {
    const { userId } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
      return res.status(500).json({ error: "Telegram configuration is missing" });
    }

    try {
      // Use getChatMember Telegram API
      // Note: channelId should be provided with @ if it's a public channel, or numerical ID
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelId}&user_id=${userId}`
      );
      const data = await response.json();

      if (data.ok) {
        const status = data.result.status;
        // status can be 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
        const isMember = ['creator', 'administrator', 'member', 'restricted'].includes(status);
        res.json({ isMember });
      } else {
        res.status(400).json({ error: data.description || "Failed to check membership" });
      }
    } catch (error) {
      console.error("Telegram API Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API Route: Send Success Notification
  app.post("/api/telegram/notify-success", async (req, res) => {
    const { userId, target, amount, server, provider } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({ error: "Telegram bot token is missing" });
    }

    const message = `🚀 *BADAK SUCCESS!*
━━━━━━━━━━━━━━
👤 *User:* ${userId}
📱 *Target:* +${target}
📦 *Amount:* ${amount} Pkts
🌐 *Server:* ${server}
🛠️ *Provider:* ${provider}
━━━━━━━━━━━━━━
🌐 _owner@kyzzynew_`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: userId,
          text: message,
          parse_mode: "Markdown"
        })
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Telegram Notify Error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // API Route: Send APK Notification
  app.post("/api/telegram/notify-apk", async (req, res) => {
    const { userId, appName, url } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({ error: "Telegram bot token is missing" });
    }

    // The document to send (our template APK)
    // We try to provide the absolute URL so Telegram can fetch it
    const host = req.get('host');
    const protocol = req.protocol;
    const apkUrl = `${protocol}://${host}/template.apk`;

    try {
      // First Send small caption
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: userId,
          text: `📦 *${appName}* is ready! Sending file...`,
          parse_mode: "Markdown"
        })
      });

      // Then Send the actual "APK"
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: userId,
          document: apkUrl,
          caption: `✅ APK for ${url} successfully built.\n📱 Name: ${appName}`,
          parse_mode: "Markdown"
        })
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Telegram APK Notify Error:", error);
      res.status(500).json({ error: "Failed to send APK file to Telegram" });
    }
  });

  // API Route: Create APK (Advanced V2 for Bots)
  app.post("/api/create-apk", async (req, res) => {
    const { url, config, telegramId } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!url) return res.status(400).json({ error: "URL is required" });

    // Simulate Build Queue
    const buildId = `BK-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Response immediately for external API
    res.json({ 
      status: "queued", 
      buildId, 
      message: "Build request added to Kyzzyy Cloud Queue",
      estimatedTime: "45-60s"
    });

    // Background Build Simulation
    if (telegramId && botToken) {
      setTimeout(async () => {
        try {
          const host = req.get('host');
          const protocol = req.protocol;
          const apkUrl = `${protocol}://${host}/template.apk`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramId,
              document: apkUrl,
              caption: `🚀 *API BUILD SUCCESS*\nBuild ID: \`${buildId}\`\nSource: ${url}\n\n_Generated via Kyzzyy Cloud API V2_`,
              parse_mode: "Markdown"
            })
          });
        } catch (err) {
          console.error("BG Build Error:", err);
        }
      }, 15000); // Send after 15s to simulate work
    }
  });

  app.post("/api/purchase-notification", async (req, res) => {
    const { itemName, price, category, username, phoneNumber } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const ownerUsername = "@kyzzynew";
    // We can use a default admin chat ID or just notify the bot's configured channel if available
    // For now, I'll assume we want to send it to the bot owner or a log group if provided.
    // However, the user specifically mentioned @kyzzynew as owner.
    // If we don't have a chat ID for @kyzzynew, we can't send it unless we have their ID.
    // Usually, admins set a TELEGRAM_CHANNEL_ID or similar.
    const chatId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ status: "error", message: "Telegram not configured on server" });
    }

    try {
      const message = `🛍️ *NEW PURCHASE REQUEST*\n\n` +
        `👤 *User:* ${username}\n` +
        `📱 *WhatsApp:* \`${phoneNumber}\`\n\n` +
        `📦 *Item:* ${itemName}\n` +
        `💰 *Price:* ${price}\n` +
        `🏷️ *Category:* ${category}\n\n` +
        `Cc: ${ownerUsername}\n` +
        `_Generated via Kyzzy Store_`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown"
        })
      });

      res.json({ status: "success", message: "Notification sent to owner" });
    } catch (err) {
      console.error("Telegram Notification Error:", err);
      res.status(500).json({ status: "error", message: "Failed to send notification" });
    }
  });

  // WhatsApp API Routes
  app.get("/api/wa/status", (req, res) => {
    res.json({ status: waService.getStatus() });
  });

  app.post("/api/wa/pairing", async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: "Phone number is required" });
    
    try {
      const code = await waService.getPairingCode(phoneNumber);
      res.json({ code });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get pairing code" });
    }
  });

  app.post("/api/wa/logout", async (req, res) => {
    try {
      await waService.logout();
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  // Serve static files from public directory
  app.use(express.static('public'));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
