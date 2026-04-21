import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button } from '../components/UI';
import { User, Phone, Calendar, Crown, LogOut, ExternalLink, Camera, Check, Upload, X, Scissors, Send, Activity, Gift } from 'lucide-react';
import { formatRemainingTime, storage } from '../utils/helpers';
import { getCroppedImg } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { Area } from 'react-easy-crop';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [tempTelegramId, setTempTelegramId] = useState(user?.telegramId || '');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPremium = user?.premiumType !== null;

  const handleUpdateTelegram = () => {
    if (!user) return;
    if (!tempTelegramId) {
      toast.error('Telegram User ID tidak boleh kosong!');
      return;
    }
    const users = storage.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, telegramId: tempTelegramId };
      }
      return u;
    });
    storage.setUsers(updatedUsers);
    refreshUser();
    toast.success('Telegram ID berhasil diperbarui!');
    setIsEditingTelegram(false);
  };

  const avatars = [
    'Felix', 'Bubba', 'Milo', 'Oliver', 'Leo', 'Charlie'
  ];

  const handleSetAvatar = (seed: string) => {
    if (!user) return;
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    const users = storage.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, avatar: url };
      }
      return u;
    });
    storage.setUsers(updatedUsers);
    refreshUser();
    toast.success('Foto profil berhasil diperbarui!');
    setShowAvatarPicker(false);
    setShowCropper(false);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Gagal: Ukuran file terlalu besar (Maks 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setShowAvatarPicker(false);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const seed = Math.random().toString(36).substring(7);
      // In the original, custom uploads were just set as the avatar URL
      const users = storage.getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === user?.id) {
          return { ...u, avatar: croppedImage };
        }
        return u;
      });
      storage.setUsers(updatedUsers);
      refreshUser();
      toast.success('Foto profil berhasil diperbarui!');
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      toast.error('Gagal memproses gambar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="relative group max-w-sm mx-auto">
        <motion.div 
          layoutId="avatar"
          className="w-40 h-40 bg-brand-purple/10 rounded-[3rem] mx-auto flex items-center justify-center border-4 border-brand-purple shadow-[0_0_40px_rgba(168,85,247,0.4)] overflow-hidden"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-20 h-20 text-brand-purple" />
          )}
        </motion.div>
        <button 
          onClick={() => setShowAvatarPicker(true)}
          className="absolute bottom-2 right-1/4 translate-x-1/2 p-3 bg-brand-purple text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">{user?.username}</h2>
        <div className="flex justify-center gap-2">
          {user?.role === 'admin' && <Badge variant="free" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/20">ADMIN</Badge>}
          {isPremium ? (
            <Badge variant="premium">👑 PREMIUM {user?.premiumType?.toUpperCase()}</Badge>
          ) : (
            <Badge variant="free">FREE USER</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-8 inner-glow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-3 h-3" /> Account ID
              </label>
              <p className="font-bold text-lg font-mono truncate">{user?.id}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <p className="font-bold text-lg">{user?.nomor}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Send className="w-3 h-3" /> Telegram ID
                </label>
                {!isEditingTelegram && (
                  <button 
                    onClick={() => setIsEditingTelegram(true)}
                    className="text-[10px] font-bold text-brand-purple hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingTelegram ? (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={tempTelegramId}
                    onChange={(e) => setTempTelegramId(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm font-mono focus:outline-none focus:border-brand-purple"
                    placeholder="User ID Telegram"
                  />
                  <button onClick={handleUpdateTelegram} className="p-1 bg-brand-purple text-white rounded-lg"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setIsEditingTelegram(false)} className="p-1 bg-white/10 text-white rounded-lg"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <p className="font-bold text-lg font-mono">{user?.telegramId || 'Not Linked'}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Member Since
              </label>
              <p className="font-bold text-lg">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Crown className="w-3 h-3" /> Access Expiry
              </label>
              <p className="font-bold text-lg text-brand-gold">
                {isPremium ? formatRemainingTime(user?.premiumExpired || null) : "EXPIRED"}
              </p>
              {!isPremium && user?.bonusLimit && (
                <p className="text-[9px] text-slate-500 italic">+ {user.bonusLimit} Power level dari teman</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-3 h-3" /> Device IP
              </label>
              <p className="font-bold text-lg font-mono text-brand-purple italic">{user?.ipAddress || 'Not Tracked'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Gift className="w-3 h-3" /> Referral Code
              </label>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xl tracking-widest bg-brand-purple/10 px-3 py-1 rounded-xl text-brand-purple border border-brand-purple/20">{user?.referralCode}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(user?.referralCode || '');
                    toast.success('Kode referral disalin!');
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">Total Invite: {user?.referralCount || 0}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
             <Button 
                variant="danger" 
                className="w-full h-14 rounded-3xl"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin logout?')) logout();
                }}
              >
                <LogOut className="w-5 h-5" /> Logout dari Sistem
              </Button>
          </div>
        </Card>

        <Card className="bg-brand-purple/5 border-brand-purple/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple shadow-lg shadow-brand-purple/20">
              <Crown className="w-6 h-6" />
            </div>
            <div className="space-y-1">
               <h4 className="font-bold text-lg">Premium Membership</h4>
               <p className="text-xs text-slate-400 leading-relaxed italic">
                 Dapatkan akses tanpa batas ke fitur Badak WA, proxy privat, dan build APK premium.
               </p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Hubungi Support</p>
            <a 
              href="https://t.me/kyzzynew" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full h-14 bg-brand-purple text-white rounded-3xl transition-all flex items-center justify-center gap-3 font-black text-sm shadow-[0_10px_20px_-5px_rgba(168,85,247,0.5)] active:scale-95"
            >
              KYZZY NEW <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-md bg-brand-gray border border-white/10 rounded-[2.5rem] p-8 space-y-8"
            >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={onFileChange} 
               />

               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">PILIH AVATAR</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6 text-slate-500" /></button>
               </div>

               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-20 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center gap-4 hover:border-brand-purple/50 transition-all text-slate-400 font-bold group"
               >
                 <div className="w-10 h-10 bg-brand-purple/20 rounded-xl flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                   <Upload className="w-5 h-5" />
                 </div>
                 Upload Foto Sendiri
               </button>
               
               <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-white/5"></div>
                 </div>
                 <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-600">
                   <span className="bg-brand-gray px-4">Atau gunakan avatar</span>
                 </div>
               </div>
               
                <div className="grid grid-cols-3 gap-4">
                   {avatars.map((seed, idx) => {
                     const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                     return (
                       <button 
                         key={idx}
                         onClick={() => handleSetAvatar(seed)}
                         className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${user?.avatar === url ? 'border-brand-purple' : 'border-transparent bg-white/5'}`}
                       >
                         <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                         {user?.avatar === url && (
                           <div className="absolute inset-0 bg-brand-purple/20 flex items-center justify-center">
                             <Check className="w-8 h-8 text-white" />
                           </div>
                         )}
                       </button>
                     );
                   })}
                </div>
               <p className="text-center text-xs text-slate-500 italic">Avatar akan tersimpan otomatis di akun Anda.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCropper && imageSrc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-black"
          >
            <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-brand-black to-transparent">
               <h3 className="text-xl font-bold flex items-center gap-3">
                  <Scissors className="w-5 h-5 text-brand-purple" /> SESUAIKAN FOTO
               </h3>
               <button onClick={() => setShowCropper(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="relative w-full h-full max-h-[60vh] md:max-h-[70vh]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="absolute bottom-0 w-full p-8 space-y-6 bg-gradient-to-t from-brand-black to-transparent">
               <div className="max-w-xs mx-auto space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 text-center tracking-widest">Zoom Level</p>
                  <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-brand-purple" />
               </div>
               <Button className="w-full h-14 rounded-3xl max-w-sm mx-auto shadow-[0_20px_40px_rgba(168,85,247,0.3)] shadow-brand-purple/20" onClick={handleSaveCrop}>
                 Simpan Foto Profil 🚀
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
