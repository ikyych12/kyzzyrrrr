import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Client Information
  app.get("/api/client-info", (req, res) => {
    // In many cloud environments, the client IP is in x-forwarded-for
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
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

  // Serve static files from public directory
  app.use(express.static('public'));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
