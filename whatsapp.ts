import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs-extra';

const logger = pino({ level: 'silent' });

export class WhatsAppService {
  public socket: any = null;
  private state: any = null;
  private saveCreds: any = null;
  private pairingCode: string | null = null;
  private status: 'connected' | 'connecting' | 'disconnected' = 'disconnected';

  constructor() {}

  async init() {
    const sessionDir = path.join(process.cwd(), 'sessions/wa-session');
    await fs.ensureDir(sessionDir);
    
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    this.state = state;
    this.saveCreds = saveCreds;

    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      version,
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      logger,
      browser: ['KYZZYY Panel', 'Chrome', '1.0.0']
    });

    this.socket.ev.on('creds.update', saveCreds);

    this.socket.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (connection === 'connecting') {
        this.status = 'connecting';
      }

      if (connection === 'close') {
        this.status = 'disconnected';
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('WA Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        if (shouldReconnect) {
          this.init();
        }
      } else if (connection === 'open') {
        this.status = 'connected';
        console.log('WhatsApp connection opened');
      }
    });

    return this.socket;
  }

  async getPairingCode(phoneNumber: string) {
    if (!this.socket) await this.init();
    
    if (this.status === 'connected') {
      throw new Error('Already connected');
    }

    // Ensure phone number starts with country code, no +
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    try {
      const code = await this.socket.requestPairingCode(cleanNumber);
      return code;
    } catch (error) {
      console.error('Error requesting pairing code:', error);
      throw error;
    }
  }

  async sendMessage(to: string, message: string) {
    if (this.status !== 'connected') {
      console.warn('Cannot send message, WA not connected');
      return false;
    }
    
    const jid = to.includes('@s.whatsapp.net') ? to : `${to.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    try {
      await this.socket.sendMessage(jid, { text: message });
      return true;
    } catch (error) {
      console.error('Error sending WA message:', error);
      return false;
    }
  }

  getStatus() {
    return this.status;
  }
  
  async logout() {
    if (this.socket) {
      await this.socket.logout();
      const sessionDir = path.join(process.cwd(), 'sessions/wa-session');
      await fs.remove(sessionDir);
      this.status = 'disconnected';
      this.socket = null;
      await this.init();
    }
  }
}

export const waService = new WhatsAppService();
