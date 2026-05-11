import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs-extra";
import dns from "dns";
import { Telegraf } from "telegraf";
import { waService } from "./whatsapp.js";
import { botInstance } from "./src/bot.js";

dotenv.config();

// Spotify State
let spotifyTokens: { access_token: string, refresh_token: string, expires_at: number } | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(process.cwd(), "db.json");

// Ensure DB exists with default structure if missing
if (!fs.existsSync(DB_PATH)) {
  fs.writeJsonSync(DB_PATH, {
    users: [],
    support: [],
    settings: { 
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
    },
    feedbacks: []
  }, { spaces: 2 });
}

// Telegram Bot Setup moved to src/bot.ts

// Bot launch logic
if (process.env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN.startsWith("YOUR_BOT")) {
  botInstance.launch()
    .then(() => console.log("🤖 Advanced Telegram Bot Started Successfully"))
    .catch(err => {
      console.error("❌ Bot launch failed. Check your token.", err.message);
    });
} else {
  console.log("⚠️ Telegram Bot skipped: No valid TELEGRAM_BOT_TOKEN provided.");
}

// Global Blast State
let isBlasting = false;
let blastProgress = {
  current: 0,
  total: 0,
  successCount: 0,
  failCount: 0,
  lastNumber: '',
  status: 'idle' as 'idle' | 'running' | 'completed' | 'error'
};

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

  // API Route: Submit Feedback
  app.post("/api/feedback", async (req, res) => {
    const { type, message, username } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHANNEL_ID || process.env.TELEGRAM_OWNER_ID;

    if (!message || !type) {
      return res.status(400).json({ error: "Message and type are required" });
    }

    try {
      const db = await fs.readJson(DB_PATH);
      if (!db.feedbacks) db.feedbacks = [];
      
      const feedback = {
        id: Date.now(),
        type,
        message,
        username: username || 'Anonymous',
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      db.feedbacks.push(feedback);
      await fs.writeJson(DB_PATH, db, { spaces: 2 });

      if (botToken && chatId) {
        const emoji = type === 'bug' ? '🐛' : type === 'suggestion' ? '💡' : '💬';
        const telegramMsg = `${emoji} *NEW FEEDBACK RECEIVED*\n\n` +
          `👤 *User:* ${username || 'Anonymous'}\n` +
          `🏷️ *Type:* ${type.toUpperCase()}\n\n` +
          `📝 *Message:* \n${message}\n\n` +
          `_Submitted via Dashboard Feedback System_`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMsg,
            parse_mode: "Markdown"
          })
        });
      }

      res.json({ success: true, message: "Feedback submitted successfully" });
    } catch (err) {
      console.error("Feedback Submission Error:", err);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Spotify API Routes
  app.get('/api/spotify/auth-url', (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: 'SPOTIFY_CLIENT_ID not configured' });

    const host = req.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/spotify/callback`;

    const scopes = [
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-read-private',
      'playlist-modify-public'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes,
      show_dialog: 'true'
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
  });

  app.get(['/api/spotify/callback', '/api/spotify/callback/'], async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const host = req.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/spotify/callback`;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error_description || data.error);

      spotifyTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000
      };

      res.send(`
        <html>
          <body style="background: #0a0a0a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <script>
              window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS' }, '*');
              window.close();
            </script>
            <div style="text-align: center;">
              <h2>✅ Spotify Connected!</h2>
              <p>This window will close automatically.</p>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Spotify Auth Error:', err);
      res.status(500).send(`Auth Error: ${err.message}`);
    }
  });

  const getSpotifyAccessToken = async () => {
    if (!spotifyTokens) return null;
    if (Date.now() < spotifyTokens.expires_at - 60000) return spotifyTokens.access_token;

    // Refresh token
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: spotifyTokens.refresh_token
        })
      });

      const data = await response.json();
      spotifyTokens = {
        ...spotifyTokens,
        access_token: data.access_token,
        expires_at: Date.now() + data.expires_in * 1000
      };
      return data.access_token;
    } catch (err) {
      console.error('Spotify Refresh Error:', err);
      return null;
    }
  };

  app.get('/api/spotify/me', async (req, res) => {
    const token = await getSpotifyAccessToken();
    if (!token) return res.status(401).json({ error: 'Not connected' });

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch Spotify profile' });
    }
  });

  app.get('/api/spotify/current-track', async (req, res) => {
    const token = await getSpotifyAccessToken();
    if (!token) return res.status(401).json({ error: 'Not connected' });

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 204) return res.json({ playing: false });
      const data = await response.json();
      res.json({ playing: true, ...data });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch current track' });
    }
  });

  app.post('/api/spotify/controls/:action', async (req, res) => {
    const { action } = req.params;
    const token = await getSpotifyAccessToken();
    if (!token) return res.status(401).json({ error: 'Not connected' });

    let endpoint = '';
    let method = 'PUT';

    if (action === 'play') endpoint = 'https://api.spotify.com/v1/me/player/play';
    else if (action === 'pause') endpoint = 'https://api.spotify.com/v1/me/player/pause';
    else if (action === 'next') { endpoint = 'https://api.spotify.com/v1/me/player/next'; method = 'POST'; }
    else if (action === 'prev') { endpoint = 'https://api.spotify.com/v1/me/player/previous'; method = 'POST'; }

    try {
      await fetch(endpoint, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to control playback' });
    }
  });

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

  // API Route: Purchase Notification
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

  // API Route: Support Submission
  app.post("/api/support/submit", async (req, res) => {
    const { userId, username, type, subject, message, timestamp } = req.body;
    
    try {
      const db = await fs.readJson(DB_PATH);
      if (!db.support) db.support = [];
      
      const newSupport = {
        id: Date.now(),
        userId,
        username,
        type,
        subject,
        message,
        timestamp,
        status: 'pending'
      };
      
      db.support.push(newSupport);
      await fs.writeJson(DB_PATH, db, { spaces: 2 });

      // Notify Telegram if configured
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHANNEL_ID;
      if (botToken && chatId) {
        const typeEmoji = type === 'bug' ? '🐛' : type === 'suggestion' ? '💡' : '💬';
        const tgMsg = `🎫 *NEW SUPPORT TICKET*\n\n` +
          `👤 *User:* ${username}\n` +
          `🏷️ *Type:* ${typeEmoji} ${type.toUpperCase()}\n` +
          `📌 *Subject:* ${subject}\n\n` +
          `📝 *Message:*\n${message}\n\n` +
          `_Submitted at ${new Date(timestamp).toLocaleString()}_`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: tgMsg, parse_mode: "Markdown" })
        }).catch(err => console.error("Error sending TG support msg:", err));
      }

      res.json({ status: 'success' });
    } catch (err) {
      console.error("Support Submission Error:", err);
      res.status(500).json({ error: "Failed to submit support request" });
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

  // Blast Routes
  app.get("/api/wa/blast-status", (req, res) => {
    res.json(blastProgress);
  });

  app.post("/api/wa/start-blast", async (req, res) => {
    const { numbers, message } = req.body;
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: "Invalid numbers list" });
    }
    if (!message) return res.status(400).json({ error: "Message is required" });

    if (waService.getStatus() !== 'connected') {
      return res.status(400).json({ error: "WhatsApp not connected" });
    }

    if (isBlasting) {
      return res.status(400).json({ error: "Another blast is already running" });
    }

    isBlasting = true;
    blastProgress = {
      current: 0,
      total: numbers.length,
      successCount: 0,
      failCount: 0,
      lastNumber: '',
      status: 'running'
    };

    // Run in background
    waService.blast(numbers, message, (progress) => {
      blastProgress = { ...progress, status: 'running' };
    }).then(() => {
      blastProgress.status = 'completed';
      isBlasting = false;
    }).catch(err => {
      console.error("Blast error:", err);
      blastProgress.status = 'error';
      isBlasting = false;
    });

    res.json({ status: "started" });
  });

  // Domain Check Route
  app.get("/api/domain/check", (req, res) => {
    const domain = req.query.domain as string;
    if (!domain) return res.status(400).json({ error: "Domain required" });

    dns.resolve4(domain, (err, addresses) => {
      if (err) {
        return res.json({ connected: false, error: err.message });
      }
      
      const expectedIPs = ['216.239.32.21', '216.239.34.21', '216.239.36.21', '216.239.38.21'];
      const connected = addresses.some(addr => expectedIPs.includes(addr));
      
      res.json({ 
        connected, 
        ip: addresses[0],
        allIps: addresses
      });
    });
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
