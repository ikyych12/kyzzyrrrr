import React, { useState } from 'react';
import { Menu, X, Home, User as UserIcon, BookOpen, Lightbulb, Ban, ShieldCheck, ChevronRight, LogOut, Code, Smartphone, Play, History, ThumbsUp, Globe, Settings as SettingsIcon, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/helpers';

import { BirdEmoji } from './BirdEmoji';
import { AnimatedLogo3D } from './AnimatedLogo3D';

export const Navbar: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  return (
    <nav className="fixed top-4 left-4 right-4 z-40 bg-white/[0.03] backdrop-blur-2xl border border-white/5 h-16 flex items-center justify-between px-6 rounded-[1.5rem] shadow-2xl transition-all hover:bg-white/[0.05]">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} className="p-2.5 hover:bg-white/5 rounded-xl lg:hidden text-brand-purple active:scale-95 transition-all">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/home" className="flex items-center gap-3 active:scale-95 transition-transform">
          <AnimatedLogo3D className="text-3xl" interactive={false} />
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center"
          >
            <BirdEmoji className="w-9 h-9" />
          </motion.div>
        </Link>
      </div>
    </nav>
  );
};

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Nonton Anime', path: '/anime', icon: Play },
    { name: 'Cek Umur WA', path: '/account-age', icon: History },
    { name: 'Profil', path: '/profile', icon: UserIcon },
    { name: 'Badak WA', path: '/badak-wa', icon: ShieldCheck },
    { name: 'Web To APK', path: '/web-to-apk', icon: Smartphone },
    { name: 'Tutorial Blast', path: '/tutorial', icon: BookOpen },
    { name: 'Tips Blast', path: '/tips', icon: Lightbulb },
    { name: 'Unband & Tutor Limit', path: '/unband', icon: Ban },
    { name: 'Rekomendasi Blast', path: '/recommendations', icon: ThumbsUp },
    { name: 'Settings & Musik', path: '/settings', icon: SettingsIcon },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: Code });
    menuItems.push({ name: 'WA Gateway', path: '/admin/whatsapp', icon: Smartphone });
    menuItems.push({ name: 'Hubungkan Domain', path: '/admin/domain', icon: Globe });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: (isOpen || window.innerWidth >= 1024) ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={cn(
          "fixed top-4 bottom-4 left-4 z-50 w-72 bg-brand-gray/95 backdrop-blur-3xl border border-white/5 flex flex-col pt-24 pb-8 rounded-[2rem] shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] lg:translate-x-0 transition-all duration-500",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 lg:hidden text-slate-400 hover:text-white transition-colors">
          <X className="w-7 h-7" />
        </button>

        <div className="flex-1 overflow-y-auto px-5 space-y-2 scrollbar-none">
          <p className="px-5 pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 group",
                location.pathname === item.path 
                  ? "bg-gradient-to-r from-brand-purple/20 to-transparent text-brand-purple border border-brand-purple/10" 
                  : "hover:bg-white/[0.03] text-slate-400 hover:text-slate-100"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-brand-purple" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="font-semibold tracking-tight">{item.name}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-brand-purple ml-auto shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </Link>
          ))}
        </div>

        <div className="px-5 pt-8 mt-8 border-t border-white/5 space-y-2">
          <Link
            to="/developer"
            onClick={onClose}
            className="flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-white/[0.03] text-slate-400 group transition-all"
          >
            <UserIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
            <span className="font-semibold tracking-tight">Developer</span>
          </Link>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-red-500/10 text-red-400 transition-all group"
          >
            <LogOut className="w-5 h-5 text-red-400/70 group-hover:text-red-400" />
            <span className="font-semibold tracking-tight">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
