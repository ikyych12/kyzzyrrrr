import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, RefreshCw, AlertCircle, Send, CheckCircle2, ExternalLink, Info, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage, cn } from '../utils/helpers';
import { Card, Button, Input } from '../components/UI';
import { AnimatedLogo3D } from '../components/AnimatedLogo3D';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const generateCaptcha = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nomor, setNomor] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'none' | 'wrong_user' | 'wrong_captcha'>('none');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRefreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setUserCaptcha('');
  }, []);

  useEffect(() => {
    handleRefreshCaptcha();
  }, [handleRefreshCaptcha]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus('none');

    if (userCaptcha.toUpperCase() !== captcha) {
      setErrorStatus('wrong_captcha');
      toast.error('Kode captcha salah!');
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = storage.getUsers();
      const existingUser = users.find(u => u.username === username && u.nomor === nomor);

      if (!existingUser) {
        setErrorStatus('wrong_user');
        toast.error('Akun tidak ditemukan!');
        setLoading(false);
        return;
      }

      login(existingUser);
      toast.success(`Selamat datang kembali, ${existingUser.username}!`);
      navigate('/home');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <AnimatedLogo3D className="text-6xl" interactive={true} />
          <div className="space-y-1">
             <h2 className="text-3xl font-bold tracking-tight">Kyzzyy 🕊️</h2>
             <p className="text-slate-400">Masuk untuk mengakses layanan premium Badak WA & Web To APK.</p>
          </div>
        </div>

        <Card className="p-8 border-white/5 bg-brand-black/40">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Username" 
              placeholder="Masukkan username" 
              value={username}
              onChange={setUsername}
              icon={<User className="w-5 h-5 text-slate-500" />}
            />
            <Input 
              label="Nomor WhatsApp" 
              placeholder="628xxxxxxxxxx" 
              value={nomor}
              onChange={setNomor}
              icon={<Phone className="w-5 h-5 text-slate-500" />}
            />
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400 ml-1">Verifikasi Captcha</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-12 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden select-none">
                   <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 10px)' }}></div>
                   <span className="text-xl font-bold tracking-[0.5em] text-white italic">{captcha}</span>
                </div>
                <button 
                  type="button" 
                  onClick={handleRefreshCaptcha}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-brand-purple"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <Input
                value={userCaptcha}
                onChange={setUserCaptcha}
                placeholder="Ketik captcha di atas"
                required
                className="text-center font-bold tracking-widest"
              />
            </div>

            <Button className="w-full h-12 rounded-xl mt-4" disabled={loading}>
              {loading ? 'Sedang Masuk...' : 'Login Sekarang'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-sm text-slate-500">Belum punya akun?</p>
            <Link to="/register" className="text-brand-purple font-bold hover:underline">Buat Akun Gratis</Link>
          </div>
        </Card>

        <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
           <p className="text-xs text-slate-500 leading-relaxed italic">
             "Solusi cerdas automasi WhatsApp dan konversi aplikasi mobile terpercaya di Indonesia."
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nomor, setNomor] = useState('');
  const [referral, setReferral] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRefreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setUserCaptcha('');
  }, []);

  useEffect(() => {
    handleRefreshCaptcha();
  }, [handleRefreshCaptcha]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !nomor) {
      toast.error('Data tidak lengkap!');
      return;
    }

    if (userCaptcha.toUpperCase() !== captcha) {
      toast.error('Captcha salah!');
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = storage.getUsers();
      
      const existingUser = users.find(u => u.username === username || u.nomor === nomor);
      if (existingUser) {
        toast.error('Username atau nomor sudah terdaftar!');
        setLoading(false);
        return;
      }

      const newUser: any = {
        id: Math.random().toString(36).substring(7),
        username,
        nomor,
        role: 'user',
        createdAt: Date.now(),
        premiumType: null,
        premiumExpired: null,
        referralCode: Math.random().toString(36).substring(7).toUpperCase(),
        referralCount: 0,
        bonusLimit: 0,
        telegramId: '',
        ipAddress: '127.0.0.1',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      };

      if (referral) {
        const referrerIndex = users.findIndex(u => u.referralCode === referral);
        if (referrerIndex !== -1) {
          users[referrerIndex].referralCount = (users[referrerIndex].referralCount || 0) + 1;
          users[referrerIndex].bonusLimit = (users[referrerIndex].bonusLimit || 0) + 1;
          toast.success('Kode referral digunakan!');
        }
      }

      users.push(newUser);
      storage.setUsers(users);
      storage.setCurrentUser(newUser);
      login(newUser);
      toast.success('Pendaftaran berhasil!');
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Daftar Akun</h2>
          <p className="text-slate-400">Bergabunglah dengan ribuan pengguna Kyzzyy lainnya.</p>
        </div>

        <Card className="p-8 border-white/5 bg-brand-black/40">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input 
              label="Username" 
              placeholder="Gunakan nama unik" 
              value={username}
              onChange={setUsername}
              icon={<User className="w-5 h-5 text-slate-500" />}
            />
            <Input 
              label="Nomor WhatsApp" 
              placeholder="628xxxxxxxxxx" 
              value={nomor}
              onChange={setNomor}
              icon={<Phone className="w-5 h-5 text-slate-500" />}
            />
            <Input 
              label="Referral Code (Optional)" 
              placeholder="Masukkan kode teman" 
              value={referral}
              onChange={setReferral}
              icon={<Gift className="w-5 h-5 text-slate-500" />}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400 ml-1">Captcha</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-12 rounded-xl flex items-center justify-center border border-white/10 font-bold tracking-[0.5em] text-cyan-400 italic">
                  {captcha}
                </div>
                <button 
                  type="button" 
                  onClick={handleRefreshCaptcha}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-brand-purple"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <Input
                value={userCaptcha}
                onChange={setUserCaptcha}
                placeholder="Captcha"
                required
                className="text-center font-bold"
              />
            </div>

            <div className="p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl">
               <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Bonus Pendaftaran</p>
               <p className="text-xs text-center mt-1">Dapatkan limit harian tambahan dengan mengundang teman menggunakan kode referral Anda!</p>
            </div>
            
            <Button className="w-full h-12 rounded-xl mt-2" disabled={loading}>
              {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-sm text-slate-500">Sudah punya akun?</p>
            <Link to="/login" className="text-brand-purple font-bold hover:underline">Masuk di Sini</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
