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
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const errorMessage = (lastDisconnect?.error as Error)?.message || '';
        
        let shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        // If it's a 408 timeout or QR failure, we don't want to loop.
        // We also want to clear the session so the user starts fresh.
        if (errorMessage.includes('QR refs attempts ended') || statusCode === 408 || errorMessage.includes('Timed out')) {
          console.warn(`[WA] Disconnect detected: ${errorMessage} (Status: ${statusCode}). Stopping loop.`);
          shouldReconnect = false;
          
          if (this.socket) {
            try {
              this.socket.ev.removeAllListeners('connection.update');
              this.socket.ev.removeAllListeners('creds.update');
              this.socket.end(undefined);
            } catch (e) {}
            this.socket = null;
          }

          const sessionDir = path.join(process.cwd(), 'sessions/wa-session');
          if (fs.existsSync(sessionDir)) {
            try {
              fs.removeSync(sessionDir);
              console.log('[WA] Stale session cleared.');
            } catch (e) {
              console.error('[WA] Failed to clear session dir:', e);
            }
          }
        }

        console.log(`WA Connection closed. Status: ${statusCode}, Error: ${errorMessage}, Reconnecting: ${shouldReconnect}`);
        
        if (shouldReconnect) {
          // Add a small delay to prevent rapid-fire reconnection on persistent errors
          setTimeout(() => {
            this.init();
          }, 5000);
        }
      } else if (connection === 'open') {
        this.status = 'connected';
        console.log('WhatsApp connection opened');
      }
    });

    return this.socket;
  }

  async getPairingCode(phoneNumber: string) {
    // If socket exists but is not connected, it might be in a legacy state. 
    // If it's a 408 error previously, this.socket would be null.
    // However, let's be extra safe:
    if (this.socket && this.status !== 'connected') {
      try {
        this.socket.end(undefined);
      } catch (e) {}
      this.socket = null;
    }

    if (!this.socket) {
      await this.init();
    }
    
    if (this.status === 'connected') {
      throw new Error('WhatsApp sudah terhubung.');
    }

    // Wait a bit for the socket to actually be ready for commands
    await new Promise(resolve => setTimeout(resolve, 2000));

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

  async blast(numbers: string[], message: string, onProgress: (progress: any) => void) {
    if (this.status !== 'connected') throw new Error('WhatsApp not connected');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i].trim();
      if (!num) continue;

      const jid = num.includes('@s.whatsapp.net') ? num : `${num.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
      
      try {
        await this.socket.sendMessage(jid, { text: message });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${num}:`, err);
        failCount++;
      }

      onProgress({
        current: i + 1,
        total: numbers.length,
        successCount,
        failCount,
        lastNumber: num
      });

      // Randomized delay between 3-7 seconds to be safer
      if (i < numbers.length - 1) {
        const delay = Math.floor(Math.random() * 4000) + 3000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return { successCount, failCount };
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
