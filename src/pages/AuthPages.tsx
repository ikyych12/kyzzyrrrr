import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, RefreshCw, AlertCircle, Send, CheckCircle2, ExternalLink, Info, Gift, Smartphone } from 'lucide-react';
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
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'none' | 'wrong_user' | 'wrong_password' | 'wrong_captcha'>('none');
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
      toast.error('Kode captcha salah');
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = storage.getUsers();
      const existingUser = users.find(u => u.username === username);

      if (!existingUser) {
        setErrorStatus('wrong_user');
        toast.error('Username atau akun tidak ditemukan');
        setLoading(false);
        return;
      }

      if (existingUser.password !== password) {
        setErrorStatus('wrong_password');
        toast.error('Password salah');
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
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[140px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: errorStatus !== 'none' ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ 
          x: { duration: 0.4, ease: "easeInOut" },
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 }
        }}
        className="w-full max-w-[440px] space-y-8 relative z-10"
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <AnimatedLogo3D className="text-7xl mb-2" interactive={true} />
          </motion.div>
          <div className="space-y-2">
             <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">
               Welcome <span className="text-brand-purple">Back</span> 🕊️
             </h2>
             <p className="text-slate-500 text-sm font-medium tracking-tight">Portal akses layanan premium Kyzzyy.</p>
          </div>
        </div>

        <Card className="p-1 sm:p-2 border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="bg-brand-black/40 rounded-[2rem] p-6 sm:p-8 space-y-8 border border-white/5">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Input 
                  label="Username Identitas" 
                  placeholder="Masukkan nama pengguna" 
                  value={username}
                  onChange={setUsername}
                  icon={<User className="w-5 h-5 text-brand-purple" />}
                  inputClassName={cn(
                    "bg-white/5 border-white/10 focus:border-brand-purple/50 h-14",
                    errorStatus === 'wrong_user' && "border-red-500/50 bg-red-500/5"
                  )}
                />
                <Input 
                  label="Password Akses" 
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={setPassword}
                  icon={<Lock className="w-5 h-5 text-brand-purple" />}
                  inputClassName={cn(
                    "bg-white/5 border-white/10 focus:border-brand-purple/50 h-14",
                    errorStatus === 'wrong_password' && "border-red-500/50 bg-red-500/5"
                  )}
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keamanan Captcha</label>
                  <button 
                    type="button" 
                    onClick={handleRefreshCaptcha}
                    className="text-brand-purple hover:rotate-180 transition-all duration-500"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 h-14 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden select-none group">
                     <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 8px)' }}></div>
                     <span className="text-2xl font-black tracking-[0.4em] text-white italic drop-shadow-lg group-hover:scale-110 transition-transform">
                       {captcha}
                     </span>
                  </div>
                  <Input
                    value={userCaptcha}
                    onChange={setUserCaptcha}
                    placeholder="..."
                    required
                    inputClassName={cn(
                      "text-center font-black tracking-widest bg-white/5 border-white/10 focus:border-brand-purple/50 h-14 uppercase",
                      errorStatus === 'wrong_captcha' && "border-red-500/50 bg-red-500/5"
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-15 rounded-2xl mt-4 text-lg font-black italic tracking-widest shadow-lg shadow-brand-purple/20 group overflow-hidden relative" disabled={loading}>
                <span className="relative z-10">{loading ? 'AUTHENTICATING...' : 'LOGIN NOW'}</span>
                {loading && (
                   <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-white/10" 
                  />
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-white/5 text-center space-y-1">
              <p className="text-xs text-slate-500 font-medium">Belum memiliki lisensi Kyzzyy?</p>
              <Link to="/register" className="text-brand-purple text-sm font-black uppercase tracking-widest hover:text-white transition-colors">
                Registrasi Akun Gratis
              </Link>
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-6">
           <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-slate-500 hover:text-brand-purple">
             <ExternalLink className="w-5 h-5" />
           </a>
           <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-slate-500 hover:text-brand-purple">
             <Info className="w-5 h-5" />
           </a>
        </div>
      </motion.div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nomor, setNomor] = useState('');
  const [password, setPassword] = useState('');
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
    if (!username || !nomor || !password) {
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
        password,
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
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[140px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">
            Join <span className="text-brand-purple">Squad</span> 🚀
          </h2>
          <p className="text-slate-500 text-sm font-medium tracking-tight">Dapatkan akses premium gratis hari ini.</p>
        </div>

        <Card className="p-1 sm:p-2 border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="bg-brand-black/40 rounded-[2rem] p-6 sm:p-8 space-y-8 border border-white/5">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-4">
                <Input 
                  label="Username Unik" 
                  placeholder="Gunakan nama identitas" 
                  value={username}
                  onChange={setUsername}
                  icon={<User className="w-5 h-5 text-brand-purple" />}
                  inputClassName="bg-white/5 border-white/10 focus:border-brand-purple/50 h-14"
                />
                <Input 
                  label="Nomor WhatsApp" 
                  placeholder="628xxxxxxxxxx" 
                  value={nomor}
                  onChange={setNomor}
                  icon={<Phone className="w-5 h-5 text-brand-purple" />}
                  inputClassName="bg-white/5 border-white/10 focus:border-brand-purple/50 h-14"
                />
                <Input 
                  label="Password Akun" 
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={setPassword}
                  icon={<Lock className="w-5 h-5 text-brand-purple" />}
                  inputClassName="bg-white/5 border-white/10 focus:border-brand-purple/50 h-14"
                />
                <Input 
                  label="Referral Code (Optional)" 
                  placeholder="Masukkan kode unik" 
                  value={referral}
                  onChange={setReferral}
                  icon={<Gift className="w-5 h-5 text-brand-purple" />}
                  inputClassName="bg-white/5 border-white/10 focus:border-brand-purple/50 h-14"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keamanan Captcha</label>
                  <button 
                    type="button" 
                    onClick={handleRefreshCaptcha}
                    className="text-brand-purple hover:rotate-180 transition-all duration-500"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 h-14 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden select-none group">
                     <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 8px)' }}></div>
                     <span className="text-2xl font-black tracking-[0.4em] text-white italic drop-shadow-lg group-hover:scale-110 transition-transform">
                       {captcha}
                     </span>
                  </div>
                  <Input
                    value={userCaptcha}
                    onChange={setUserCaptcha}
                    placeholder="..."
                    required
                    inputClassName="text-center font-black tracking-widest bg-white/5 border-white/10 focus:border-brand-purple/50 h-14 uppercase"
                  />
                </div>
              </div>

              <div className="p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-20 h-20 bg-brand-purple/10 blur-2xl rounded-full" />
                <p className="text-[10px] text-brand-purple text-center uppercase font-black tracking-widest italic flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> Bonus Pendaftaran
                </p>
                <p className="text-[10px] text-center mt-1 text-slate-400 font-medium">Undang 1 teman untuk mendapatkan +1 limit harian Badak WA!</p>
              </div>
              
              <Button type="submit" className="w-full h-15 rounded-2xl mt-4 text-lg font-black italic tracking-widest shadow-lg shadow-brand-purple/20 group overflow-hidden relative" disabled={loading}>
                <span className="relative z-10">{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
                {loading && (
                   <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-white/10" 
                  />
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-white/5 text-center space-y-1">
              <p className="text-xs text-slate-500 font-medium">Sudah memiliki akun terdaftar?</p>
              <Link to="/login" className="text-brand-purple text-sm font-black uppercase tracking-widest hover:text-white transition-colors">
                Masuk ke Terminal
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
