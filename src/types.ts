export type Role = 'admin' | 'user';
export type PremiumType = '1d' | '7d' | 'permanent' | null;

export interface User {
  id: string;
  username: string;
  nomor: string;
  password?: string;
  role: Role;
  premiumType: PremiumType;
  premiumExpired: number | null;
  createdAt: number;
  avatar?: string;
  badakCount?: number;
  telegramId?: string;
  hasSeenOnboarding?: boolean;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  ipAddress?: string;
  isBanned?: boolean;
  banReason?: string;
  bonusLimit?: number;
  lastLogin?: number | null;
}

export interface AppSettings {
  webToApkAccess: 'admin' | 'premium' | 'all';
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  settings: AppSettings;
}

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  episodes: number;
  score: number;
  status: string;
  year: number;
  genres: { name: string }[];
  trailer?: {
    embed_url: string;
  };
}
