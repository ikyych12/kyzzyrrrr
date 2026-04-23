import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { 
  Settings as SettingsIcon, 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  ListMusic,
  Heart,
  Disc,
  Download,
  Smartphone,
  Apple,
  Share,
  PlusSquare,
  Layout as LayoutIcon,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const PLAYLIST: Song[] = [
  {
    id: '1',
    title: 'Lofi Study',
    artist: 'Kyzzyy Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Nigh Drive',
    artist: 'Chill Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Cyberpunk 2077',
    artist: 'Hyper Techno',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=300&auto=format&fit=crop'
  }
];

export const SettingsPage: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Gunakan Chrome/Edge untuk instalasi otomatis atau ikuti panduan manual.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') toast.success('Terima kasih telah mengunduh!');
    setDeferredPrompt(null);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => toast.error("Gagal memutar audio: " + err.message));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const skipForward = () => {
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    setTimeout(() => togglePlay(), 100);
  };

  const skipBack = () => {
    const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(false);
    setTimeout(() => togglePlay(), 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-brand-purple" /> HUB <span className="text-brand-purple">KONTROL</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">Instalasi aplikasi, musik, dan preferensi sistem.</p>
        </motion.div>
        <Badge variant="premium">ALL-IN-ONE HUB</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* PWA Section merged */}
          <Card className="p-8 border-brand-purple/20 bg-brand-purple/5 space-y-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Download className="w-32 h-32 text-brand-purple" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">
                Instalasi <span className="text-brand-purple">Kyzzyy</span> <br />
                Ke Perangkat HP
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Jadikan Kyzzyy sebagai aplikasi asli di homescreen Anda. Lebih cepat, full screen, dan tanpa iklan browser.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                 <Button 
                  className="w-full h-14 rounded-2xl text-sm font-black italic tracking-widest gap-2"
                  onClick={handleInstallClick}
                 >
                   <Download className="w-4 h-4" /> {deferredPrompt ? 'INSTALL SEKARANG' : 'DAPATKAN APP'}
                 </Button>
               </motion.div>
               
               <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex gap-1">
                     <button onClick={() => setPlatform('android')} className={`p-1.5 rounded-lg transition-all ${platform === 'android' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Smartphone className="w-4 h-4" /></button>
                     <button onClick={() => setPlatform('ios')} className={`p-1.5 rounded-lg transition-all ${platform === 'ios' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Apple className="w-4 h-4" /></button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-auto">Panduan Manual</span>
               </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={platform}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3"
              >
                 {platform === 'ios' ? (
                   <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <Share className="w-4 h-4 text-brand-purple" />
                      <span>Klik <span className="text-white font-bold">Share</span> dan pilih <span className="text-white font-bold">'Add to Home Screen'</span> di Safari.</span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <Zap className="w-4 h-4 text-brand-purple" />
                      <span>Klik <span className="text-white font-bold">Titik Tiga (⋮)</span> dan pilih <span className="text-white font-bold">'Install App'</span> di Chrome.</span>
                   </div>
                 )}
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* System Settings */}
          <Card className="p-8 border-white/5 bg-white/[0.02] space-y-6">
            <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-2">Preferensi Sistem</h3>
            
            <div className="space-y-4">
              {[
                { label: "Otomatisasi Gelap", desc: "Tema gelap diaktifkan secara default.", status: true },
                { label: "High Performance Mode", desc: "Optimasi animasi framer motion.", status: true },
                { label: "Notification Alert", desc: "Pemberitahuan real-time WA Blast.", status: false }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }} 
                  className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-brand-purple/20 transition-all"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{item.desc}</p>
                  </div>
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-6 rounded-full p-1 flex ${item.status ? 'bg-brand-purple/20 justify-end' : 'bg-slate-800 justify-start'} cursor-pointer`}
                  >
                    <div className={`w-4 h-4 rounded-full ${item.status ? 'bg-brand-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-600'}`}></div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              className="pt-4"
            >
              <Button variant="outline" className="w-full justify-start gap-4 border-red-500/10 bg-red-500/5 hover:bg-red-500/10 h-14 rounded-2xl group transition-all">
                <div className="p-2 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-red-500 text-lg">⚠️</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black italic text-red-400 uppercase tracking-tighter leading-none">RESET SELURUH SESI</p>
                  <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">Aktivitas WhatsApp & Login akan dihapus</p>
                </div>
              </Button>
            </motion.div>
          </Card>
        </div>

        {/* Music Player Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-brand-purple/20 bg-brand-purple/5 shadow-2xl relative">
            <div className="relative aspect-square">
              <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                 <motion.p 
                  key={currentSong.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black italic tracking-tighter uppercase truncate"
                 >
                   {currentSong.title}
                 </motion.p>
                 <p className="text-sm text-brand-purple font-bold tracking-widest uppercase">{currentSong.artist}</p>
              </div>

              {isPlaying && (
                <div className="absolute top-4 right-4 animate-spin-slow">
                   <Disc className="w-10 h-10 text-brand-purple" />
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <audio ref={audioRef} src={currentSong.url} onTimeUpdate={handleTimeUpdate} onEnded={skipForward} />
              <input type="range" min="0" max="100" value={progress} readOnly className="w-full h-1 bg-white/10 rounded-lg appearance-none pointer-events-none accent-brand-purple" />

              <div className="flex items-center justify-between">
                 <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={skipBack} className="text-slate-400 hover:text-white transition-colors">
                    <SkipBack className="w-7 h-7 fill-current" />
                 </motion.button>
                 
                 <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-20 h-20 bg-brand-purple rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-purple/40"
                 >
                   {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
                 </motion.button>

                 <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={skipForward} className="text-slate-400 hover:text-white transition-colors">
                    <SkipForward className="w-7 h-7 fill-current" />
                 </motion.button>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                 <Volume2 className="w-4 h-4 text-slate-500" />
                 <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="flex-1 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-purple" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-white/5 bg-white/[0.02] space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <ListMusic className="w-4 h-4 text-brand-purple" />
                <h4 className="text-[10px] font-black italic tracking-[0.2em] uppercase text-slate-500">PLAYLIST KYZZYY</h4>
             </div>
             
             <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-none">
                {PLAYLIST.map((song, idx) => (
                  <motion.button 
                    key={song.id}
                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => { setCurrentSongIndex(idx); setIsPlaying(false); setTimeout(() => togglePlay(), 100); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${idx === currentSongIndex ? 'bg-brand-purple/10 ring-1 ring-brand-purple/20' : 'text-slate-500'}`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                       <img src={song.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                       <p className={`text-sm font-bold truncate ${idx === currentSongIndex ? 'text-brand-purple' : 'text-slate-200'}`}>{song.title}</p>
                       <p className="text-[9px] uppercase font-black text-slate-600">{song.artist}</p>
                    </div>
                    {idx === currentSongIndex && isPlaying && (
                       <div className="flex items-end gap-0.5 h-3">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-brand-purple rounded-full" />
                          <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-brand-purple rounded-full" />
                          <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-brand-purple rounded-full" />
                       </div>
                    )}
                  </motion.button>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
