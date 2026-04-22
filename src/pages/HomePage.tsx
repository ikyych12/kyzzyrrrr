import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge } from '../components/UI';
import { Link } from 'react-router-dom';
import { User as UserIcon, ShieldCheck, BookOpen, Lightbulb, Ban, Crown, Code, Play, Smartphone, History, ThumbsUp, Search, Flame, ShoppingCart, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { formatRemainingTime } from '../utils/helpers';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const isPremium = user?.premiumType !== null;

  const menuItems = [
    { title: 'Nonton Anime', icon: Play, path: '/anime', color: 'text-brand-sakura', desc: 'Library anime 10,000+ judul' },
    { title: 'Cek Umur Akun', icon: History, path: '/account-age', color: 'text-brand-gold', desc: 'Lacak tanggal join & register' },
    { title: 'Profil', icon: UserIcon, path: '/profile', color: 'text-blue-400', desc: 'Lihat informasi akun' },
    { title: 'Badak WA', icon: ShieldCheck, path: '/badak-wa', color: 'text-brand-purple', desc: 'Spam WhatsApp stabil' },
    { title: 'Kyzzy Store', icon: ShoppingCart, path: '/store', color: 'text-emerald-400', desc: 'Sewa VPS & Panel hosting termurah' },
    { title: 'NIK Checker', icon: Search, path: '/nik-checker', color: 'text-cyan-400', desc: 'Cek data KTP via NIK (Indonesia)' },
    { title: 'Rekomendasi Blast', icon: ThumbsUp, path: '/recommendations', color: 'text-emerald-400', desc: 'Layanan blast terbaik & terpercaya' },
    { title: 'Tutorial Blast', icon: BookOpen, path: '/tutorial', color: 'text-emerald-400', desc: 'Cara blast yang benar' },
    { title: 'Tips Blast', icon: Lightbulb, path: '/tips', color: 'text-amber-400', desc: 'Tips aman anti banned' },
    { title: 'Unband & Tutor Limit', icon: Ban, path: '/unband', color: 'text-red-400', desc: 'Buka blokir akun WA dan tutor anti-limit' },
    { title: 'Web To APK', icon: Smartphone, path: '/web-to-apk', color: 'text-brand-blue', desc: 'Convert website ke APK' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ title: 'Admin Panel', icon: Code, path: '/admin', color: 'text-brand-gold', desc: 'Manajemen pengguna' });
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Selamat datang, <span className="text-brand-purple">{user?.username}</span>!</h2>
          <p className="text-slate-400">Semua fitur tersedia untuk membantu bisnis Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isPremium ? (
            <Badge variant="premium">
              <Crown className="w-3.5 h-3.5" />
              PREMIUM {user?.premiumType?.toUpperCase()}
              <span className="text-[10px] ml-1 bg-brand-gold/20 px-1.5 rounded">
                {formatRemainingTime(user?.premiumExpired || null)}
              </span>
            </Badge>
          ) : (
            <Badge variant="free">FREE ACCOUNT</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path}>
            <Card className="h-full hover:neon-border transition-all duration-300 group cursor-pointer group-hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg group-hover:text-brand-purple transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 border-brand-purple/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl"
          >
            📢
          </motion.div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h4 className="font-bold text-lg">Gunakan Proxy V2L atau 1.1.1.1</h4>
            <p className="text-sm text-slate-300">Untuk keamanan maksimal saat melakukan blast dan menghindari deteksi sistem WhatsApp.</p>
          </div>
          <Link to="/tips">
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all">LIHAT TIPS</button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
