import { Telegraf, Markup, session, Context } from "telegraf";
import fs from 'fs-extra';
import chalk from 'chalk';
import moment from 'moment-timezone';
import path from 'path';

// Define session interface
interface MySession {
  waitingBadak?: boolean;
  badakTarget?: string;
  badakRegion?: string;
  badakMax?: number;
  badakIsPremium?: boolean;
  badakUserId?: string;
  badakTimeout?: NodeJS.Timeout;
}

interface MyContext extends Context {
  session: MySession;
}

// ======================== CONFIG ========================
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8601224645:AAFjPXrlB8t0oiMvaqPhwKlvzd5aUBP3DLU";
const OWNER_ID = process.env.TELEGRAM_OWNER_ID || "6926037855";
const PREMIUM_CONTACT = "@kyzzynew";
const REQUIRED_CHANNELS = [
    { username: "@kyzzynew", link: "https://t.me/kyzzynew" }
];
const REQUIRED_GROUPS: any[] = [];

// ======================== AUTO CREATE FILES ========================
const DATA_DIR = path.join(process.cwd(), 'data');
fs.ensureDirSync(DATA_DIR);

const AGE_DATA_FILE = path.join(DATA_DIR, 'ageData.json');
const PREMIUM_FILE = path.join(DATA_DIR, 'premiumuser.json');
const USER_DATA_FILE = path.join(DATA_DIR, 'userData.json');
const TQTO_FILE = path.join(DATA_DIR, 'tqto.json');
const BLACKLIST_FILE = path.join(DATA_DIR, 'blacklist.json');
const LIMIT_FILE = path.join(DATA_DIR, 'limit.json');
const SPAM_FILE = path.join(DATA_DIR, 'spam.json');

const ensureFileExists = (filePath: string, defaultContent: any = {}) => {
    if (!fs.existsSync(filePath)) {
        fs.writeJsonSync(filePath, defaultContent, { spaces: 2 });
        console.log(chalk.yellow(`📄 Created: ${filePath}`));
    }
};

ensureFileExists(AGE_DATA_FILE, {});
ensureFileExists(PREMIUM_FILE, {});
ensureFileExists(USER_DATA_FILE, {});
ensureFileExists(TQTO_FILE, [
    "✨ Allah SWT ✨",
    "👑 My Support 👑",
    "💖 Orang Tua 💖",
    "🌟 Para Buyer 🌟",
    "🦏 Tim Badak 🦏"
]);
ensureFileExists(BLACKLIST_FILE, []);
ensureFileExists(LIMIT_FILE, {});
ensureFileExists(SPAM_FILE, {});

// ======================== LOAD DATA ========================
let ageData: any = {};
let premiumUsers: any = {};
let userData: any = {};
let tqtoList: string[] = [];
let blacklist: string[] = [];
let limitData: any = {};
let spamData: any = {};

const loadData = () => {
    try { ageData = fs.readJsonSync(AGE_DATA_FILE); } catch (e) { ageData = {}; }
    try { premiumUsers = fs.readJsonSync(PREMIUM_FILE); } catch (e) { premiumUsers = {}; }
    try { userData = fs.readJsonSync(USER_DATA_FILE); } catch (e) { userData = {}; }
    try { tqtoList = fs.readJsonSync(TQTO_FILE); } catch (e) { tqtoList = []; }
    try { blacklist = fs.readJsonSync(BLACKLIST_FILE); } catch (e) { blacklist = []; }
    try { limitData = fs.readJsonSync(LIMIT_FILE); } catch (e) { limitData = {}; }
    try { spamData = fs.readJsonSync(SPAM_FILE); } catch (e) { spamData = {}; }
};

loadData();

const saveAgeData = () => fs.writeJsonSync(AGE_DATA_FILE, ageData, { spaces: 2 });
const savePremiumData = () => {
    const cleanData: any = {};
    for (const [id, exp] of Object.entries(premiumUsers)) {
        if (id && id.length >= 5 && id !== '0' && id !== '1' && id !== '2') cleanData[id] = exp;
    }
    premiumUsers = cleanData;
    fs.writeJsonSync(PREMIUM_FILE, premiumUsers, { spaces: 2 });
};
const saveUserData = () => fs.writeJsonSync(USER_DATA_FILE, userData, { spaces: 2 });
const saveTqtoData = () => fs.writeJsonSync(TQTO_FILE, tqtoList, { spaces: 2 });
const saveBlacklist = () => fs.writeJsonSync(BLACKLIST_FILE, blacklist, { spaces: 2 });
const saveLimitData = () => fs.writeJsonSync(LIMIT_FILE, limitData, { spaces: 2 });
const saveSpamData = () => fs.writeJsonSync(SPAM_FILE, spamData, { spaces: 2 });

// ======================== HELPER FUNCTIONS ========================
const isPremium = (userId: string | number) => {
    const userIdStr = userId.toString();
    if (userIdStr === OWNER_ID.toString()) return true;
    if (premiumUsers[userIdStr]) {
        const expiry = premiumUsers[userIdStr];
        if (expiry === 'permanent' || expiry === 0 || expiry === '00') return true;
        if (Date.now() < expiry) return true;
        delete premiumUsers[userIdStr];
        savePremiumData();
        return false;
    }
    return false;
};

const getPremiumExpiry = (userId: string | number) => {
    const userIdStr = userId.toString();
    if (userIdStr === OWNER_ID.toString()) return '✨ Forever ✨';
    if (premiumUsers[userIdStr]) {
        const expiry = premiumUsers[userIdStr];
        if (expiry === 'permanent' || expiry === 0 || expiry === '00') return '✨ Forever ✨';
        const remaining = (expiry as number) - Date.now();
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `📅 ${days}d ${hours}h`;
        if (hours > 0) return `⏰ ${hours}h`;
        return '⚠️ Soon ⚠️';
    }
    return '❌ No ❌';
};

const isBlacklisted = (userId: string | number) => blacklist.includes(userId.toString());

const addToBlacklist = (userId: string, reason: string) => {
    if (!blacklist.includes(userId)) {
        blacklist.push(userId);
        saveBlacklist();
        console.log(chalk.red(`🚫 User ${userId} blacklisted: ${reason}`));
    }
};

const checkLimit = (userId: string | number) => {
    const userIdStr = userId.toString();
    const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    if (!limitData[userIdStr] || limitData[userIdStr].date !== today) {
        return { allowed: true, remaining: 2, used: 0 };
    }
    const used = limitData[userIdStr].count || 0;
    return { allowed: used < 2, remaining: Math.max(0, 2 - used), used: used };
};

const incrementLimit = (userId: string | number) => {
    const userIdStr = userId.toString();
    const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    if (!limitData[userIdStr] || limitData[userIdStr].date !== today) {
        limitData[userIdStr] = { date: today, count: 1 };
    } else {
        limitData[userIdStr].count++;
    }
    saveLimitData();
};

const checkPhoneNumber = (number: string) => {
    if (!number) return { valid: false, reason: '❌ Nomor tidak valid!' };
    const clean = number.replace(/[^0-9]/g, '');
    if (clean.length < 7) return { valid: false, reason: '❌ Nomor tidak valid! (terlalu pendek)' };
    if (clean.length > 15) return { valid: false, reason: '❌ Nomor tidak valid! (terlalu panjang)' };
    return { valid: true, clean: clean, reason: null };
};

function getRegion(phone: string) {
    if (!phone) return '🌍 Unknown';
    const countryCodes: any = { '62': '🇮🇩 Indonesia', '1': '🇺🇸 USA', '44': '🇬🇧 UK', '91': '🇮🇳 India', '81': '🇯🇵 Japan', '263': '🇿🇼 ZIMBABWE' };
    for (const [code, country] of Object.entries(countryCodes)) {
        if (phone.startsWith(code)) return country as string;
    }
    return '🌍 International';
}

function getJoinSince(number: string) {
    const clean = number.replace(/[^0-9]/g, '');
    if (ageData[clean]?.joinDate) return ageData[clean].joinDate;
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
        hash = ((hash << 5) - hash) + clean.charCodeAt(i) * (i + 1);
        hash = hash & hash;
    }
    const year = 2018 + (Math.abs(hash) % 8);
    const month = 1 + (Math.abs(hash >> 8) % 12);
    const day = 1 + (Math.abs(hash >> 16) % 28);
    const joinDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (!ageData[clean]) ageData[clean] = {};
    ageData[clean].joinDate = joinDate;
    saveAgeData();
    return joinDate;
}

// ======================== BOT INSTANCE ========================
const bot = new Telegraf<MyContext>(BOT_TOKEN);
bot.use(session());

const checkJoinChannel = async (ctx: MyContext, next: () => Promise<void>) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    if (isBlacklisted(userId)) return ctx.reply("🚫 ANDA DI BLACKLIST!\nHubungi @kyzzynew.");
    if (userId.toString() === OWNER_ID) return next();
    
    if (REQUIRED_CHANNELS.length > 0) {
        try {
            const channelToCheck = REQUIRED_CHANNELS[0].username.replace('@', '');
            const chatMember = await ctx.telegram.getChatMember(`@${channelToCheck}`, userId);
            if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                return ctx.replyWithPhoto("https://files.catbox.moe/ktuerk.jpg", {
                    caption: `🔐 JOIN CHANNEL DULU! 🔐\n\n${REQUIRED_CHANNELS[0].link}`,
                    ...Markup.inlineKeyboard([[Markup.button.url("📢 JOIN", REQUIRED_CHANNELS[0].link)]])
                });
            }
        } catch (error) { }
    }
    await next();
};

const getUserKeyboard = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🦏 BADAK', 'badak_menu'), Markup.button.callback('📅 CEK UMUR', 'cekumur_menu')],
        [Markup.button.callback('⭐ PREMIUM', 'premium_menu'), Markup.button.callback('🙏 TQTO', 'tqto_menu')]
    ]);
};

// ======================== COMMANDS ========================
bot.start(checkJoinChannel, async (ctx) => {
    const userId = ctx.from!.id.toString();
    const username = ctx.from!.username || ctx.from!.first_name;
    const isUserPremium = isPremium(userId);
    const time = moment().tz('Asia/Jakarta').format('HH:mm');
    
    const caption = `╔══════════════════════════╗
║     🦏 APOCALYPSE BOT 🦏     ║
╚══════════════════════════╝

✨ Halo ${username}! ✨

Status : ${isUserPremium ? '⭐ PREMIUM ⭐' : '📛 FREE'}
Expiry : ${getPremiumExpiry(userId)}
Waktu : ${time} WIB

/badak - 🦏 Badak WA
/cekumur - 📅 Cek Umur
/premium - ⭐ Info Premium
@kyzzynew`;

    try {
        await ctx.replyWithPhoto("https://files.catbox.moe/ktuerk.jpg", { caption, ...getUserKeyboard() });
    } catch (err) {
        await ctx.reply(caption, getUserKeyboard());
    }
});

bot.command('badak', checkJoinChannel, async (ctx) => {
    const userId = ctx.from!.id.toString();
    const isUserPremium = isPremium(userId);
    const args = ctx.message.text.split(' ');
    
    if (args.length < 2) {
        return ctx.reply(`🦏 BADAK WHATSAPP\n\n📋 /badak <nomor>\nContoh: /badak 628123xxx\n\n⭐ PREMIUM: ALL REGION\n📛 FREE: Indonesia Only`);
    }
    
    const phoneCheck = checkPhoneNumber(args[1]);
    if (!phoneCheck.valid) return ctx.reply(phoneCheck.reason!);
    
    if (!isUserPremium) {
        const limit = checkLimit(userId);
        if (!limit.allowed) return ctx.reply(`❌ LIMIT HABIS! ${limit.used}/2x hari ini.\n⭐ Upgrade ke PREMIUM!`);
    }
    
    const number = args[1].replace(/[^0-9]/g, '');
    const region = getRegion(number);
    
    if (!number.startsWith('62') && !isUserPremium) {
        return ctx.reply(`🚫 AKSES DITOLAK!\n\nNomor ${region} (Luar Negeri) hanya untuk PREMIUM!`);
    }
    
    const maxCount = isUserPremium ? 200 : 100;
    
    ctx.session = ctx.session || {};
    ctx.session.waitingBadak = true;
    ctx.session.badakTarget = number;
    ctx.session.badakRegion = region;
    ctx.session.badakMax = maxCount;
    ctx.session.badakIsPremium = isUserPremium;
    ctx.session.badakUserId = userId;
    
    await ctx.reply(`🦏 BADAK WA\n\n🎯 Target: ${number}\n🌍 Region: ${region}\n📊 Maks: ${maxCount}x\n\n✏️ Kirim ANGKA (1-${maxCount}) untuk memulai!`);
});

bot.on('text', async (ctx) => {
    if (!ctx.session?.waitingBadak) return;
    const count = parseInt(ctx.message.text);
    const userId = ctx.from!.id.toString();
    
    if (isNaN(count) || count < 1 || count > (ctx.session.badakMax || 100)) return ctx.reply("❌ Angka tidak valid!");
    
    ctx.session.waitingBadak = false;
    const target = ctx.session.badakTarget;
    
    const msg = await ctx.reply("🦏 Menyerang target...");
    
    setTimeout(async () => {
        const resultText = `🦏 HASIL BADAK\n\n🎯 Target: ${target}\n✅ Sukses: ${count}x\n\nBerhasil disembur! 🦏🔥`;
        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined, resultText);
    }, 3000);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from!.id.toString() !== OWNER_ID) return;
    const args = ctx.message.text.split(' ');
    if (args.length < 3) return ctx.reply("/addprem <id> <hari|00>");
    const userId = args[1];
    const days = args[2];
    const expiry = days === '00' ? 'permanent' : Date.now() + (parseInt(days) * 24 * 60 * 60 * 1000);
    premiumUsers[userId] = expiry;
    savePremiumData();
    ctx.reply(`✅ Premium ditambahkan ke ${userId}`);
});

bot.action('badak_menu', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("Ketik /badak <nomor> untuk mulai.");
});

bot.action('cekumur_menu', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("Ketik /cekumur <nomor> untuk cek umur.");
});

bot.action('premium_menu', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("Hubungi @kyzzynew untuk beli Premium.");
});

export const botInstance = bot;
