import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitleMap: Record<string, string> = {
  '/home': 'Beranda',
  '/profile': 'Profil User',
  '/anime': 'Nonton Anime',
  '/account-age': 'Cek Umur Akun',
  '/badak-wa': 'Badak WA v2',
  '/web-to-apk': 'Web To APK',
  '/tutorial': 'Tutorial Blast',
  '/tips': 'Tips Aman',
  '/unband': 'Unband Script',
  '/admin': 'Admin Panel',
  '/login': 'Masuk Sistem',
  '/register': 'Daftar Akun',
};

export const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location) return;

    const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, "");
    
    const pageTitle = routeTitleMap[path] || routeTitleMap[`/${path.split('/')[1]}`] || 'Maya';
    
    document.title = `Kyzzyy 🌸 | ${pageTitle}`;
  }, [location]);

  return null;
};
