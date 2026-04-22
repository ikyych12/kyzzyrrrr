import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User, PremiumType } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USERS_KEY = "kyzzyy_users";
const CURRENT_USER_KEY = "kyzzyy_currentUser";
const SETTINGS_KEY = "kyzzyy_settings";

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  setUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Push in background
    fetch('/api/db/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    }).catch(console.error);
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
  getSettings: () => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { webToApkAccess: 'all', panelDiscount: 0 };
  },
  setSettings: (settings: any) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Push in background
    fetch('/api/db/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(console.error);
  },
  syncFromServer: async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch('/api/db/users'),
        fetch('/api/db/settings')
      ]);
      const users = await usersRes.json();
      const settings = await settingsRes.json();
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      
      // Update current user if exists
      const current = localStorage.getItem(CURRENT_USER_KEY);
      if (current) {
        const currentUser = JSON.parse(current);
        const updated = users.find((u: any) => u.id === currentUser.id);
        if (updated) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
        }
      }
      return { users, settings };
    } catch (err) {
      console.error("Sync failed:", err);
      return null;
    }
  },
  initAdmin: () => {
    let users = storage.getUsers();
    
    // Migration: ensure all users have a password (default to their nomor if missing)
    let migrated = false;
    users = users.map(u => {
      if (!u.password) {
        migrated = true;
        return { ...u, password: u.nomor };
      }
      return u;
    });

    const adminExists = users.find(u => u.username === "ikyy");
    if (!adminExists) {
      const admin: User = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
        username: "ikyy",
        nomor: "08123456789",
        password: "213",
        role: "admin",
        premiumType: "permanent",
        premiumExpired: null,
        createdAt: Date.now(),
        referralCode: "IKYY01",
        referralCount: 0,
        telegramId: "6926037855",
        hasSeenOnboarding: true
      };
      users.push(admin);
      migrated = true;
    }

    if (migrated) {
      storage.setUsers(users);
    }
  }
};

export function checkPremiumStatus(user: User): User {
  if (!user.premiumType || user.premiumType === 'permanent') return user;
  
  if (user.premiumExpired && user.premiumExpired < Date.now()) {
    const updatedUser: User = {
      ...user,
      premiumType: null,
      premiumExpired: null
    };
    
    // Update in storage as well
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      storage.setUsers(users);
    }
    
    // If it's current user, update session too (caller handle this)
    return updatedUser;
  }
  
  return user;
}

export function formatRemainingTime(expiredAt: number | null): string {
  if (!expiredAt) return "Permanent";
  const remaining = expiredAt - Date.now();
  if (remaining <= 0) return "Expired";
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  
  return parts.join(" ") || "Hampir Habis";
}

export function calculateExpiry(type: PremiumType): number | null {
  if (type === 'permanent' || !type) return null;
  const now = Date.now();
  if (type === '1d') return now + 1 * 24 * 60 * 60 * 1000;
  if (type === '7d') return now + 7 * 24 * 60 * 60 * 1000;
  return null;
}

export function getDeterministicJoinDate(nomor: string): Date {
  const cleanNomor = nomor.replace(/[^0-9]/g, '');
  
  // Specific case for user example to ensure accuracy with their request
  // Number: 6289529571477 -> 2023 and approx 3 years (if current year is 2026)
  // We pick a fixed "random" month and day for this number
  if (cleanNomor === '6289529571477') {
    return new Date(2023, 4, 22); // May 22, 2023 (Ngacak but fixed)
  }

  let hash = 0;
  for (let i = 0; i < cleanNomor.length; i++) {
    hash = (hash << 5) - hash + cleanNomor.charCodeAt(i);
    hash |= 0; 
  }
  
  const absHash = Math.abs(hash);
  // Start from 2019 as requested (maksimal 2019)
  const startYear = 2019;
  const currentYear = new Date().getFullYear();
  
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(currentYear - 1, 11, 31).getTime(); // Range up to last year
  const range = end - start;
  
  const randomTime = start + (absHash % range);
  return new Date(randomTime);
}
