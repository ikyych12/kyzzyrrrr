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
  Disc
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

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-brand-purple" /> PENGATURAN <span className="text-brand-purple">& MUSIK</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">Kustomisasi pengalaman Anda & nikmati musik santai.</p>
        </div>
        <Badge variant="premium">BETA V1.0</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* General Settings Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-2">Tampilan & Notifikasi</h3>
              
              <div className="flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-slate-200">Mode Gelap (Otomatis)</h4>
                  <p className="text-xs text-slate-500">Tema ini sudah dioptimalkan untuk kesehatan mata.</p>
                </div>
                <div className="w-12 h-6 bg-brand-purple/20 rounded-full p-1 flex justify-end">
                   <div className="w-4 h-4 bg-brand-purple rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                </div>
              </div>

              <div className="flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-slate-200">Suara Animasi</h4>
                  <p className="text-xs text-slate-500">Nyalakan efek suara saat navigasi menu.</p>
                </div>
                <div className="w-12 h-6 bg-slate-800 rounded-full p-1 flex justify-start">
                   <div className="w-4 h-4 bg-slate-600 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-slate-200">Notifikasi WA Blast</h4>
                  <p className="text-xs text-slate-500">Dapatkan alert di browser saat blast selesai.</p>
                </div>
                <div className="w-12 h-6 bg-brand-purple/20 rounded-full p-1 flex justify-end">
                   <div className="w-4 h-4 bg-brand-purple rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-2">Keamanan</h3>
              <Button variant="outline" className="w-full justify-start gap-3 border-white/5 hover:bg-white/5 h-12">
                 <span className="text-red-400">🚨 Reset Seluruh Data Sesi</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Music Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-brand-purple/20 bg-brand-purple/5 shadow-2xl shadow-brand-purple/10">
            <div className="relative aspect-square">
              <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                 <div className="p-2 bg-brand-black/40 backdrop-blur-xl rounded-xl border border-white/10">
                    <Music className="w-5 h-5 text-brand-purple" />
                 </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-2xl font-black italic tracking-tighter uppercase truncate">{currentSong.title}</p>
                 <p className="text-sm text-brand-purple font-bold tracking-widest uppercase">{currentSong.artist}</p>
              </div>

              {isPlaying && (
                <div className="absolute top-4 right-4 animate-spin-slow">
                   <Disc className="w-8 h-8 text-brand-purple/60" />
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <audio 
                ref={audioRef} 
                src={currentSong.url} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={skipForward}
              />

              <div className="space-y-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={handleProgressChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
              </div>

              <div className="flex items-center justify-between">
                 <button onClick={skipBack} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <SkipBack className="w-6 h-6 fill-current" />
                 </button>
                 
                 <button 
                  onClick={togglePlay}
                  className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-purple/40 hover:scale-105 active:scale-95 transition-all"
                 >
                   {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
                 </button>

                 <button onClick={skipForward} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <SkipForward className="w-6 h-6 fill-current" />
                 </button>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                 <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-slate-400" />}
                 </button>
                 <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-white/5 bg-white/[0.02] space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <ListMusic className="w-4 h-4 text-brand-purple" />
                <h4 className="text-xs font-black italic tracking-widest uppercase text-slate-500">PLAYLIST KYZZYY</h4>
             </div>
             
             <div className="space-y-2">
                {PLAYLIST.map((song, idx) => (
                  <button 
                    key={song.id}
                    onClick={() => {
                      setCurrentSongIndex(idx);
                      setIsPlaying(false);
                      setTimeout(() => togglePlay(), 100);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${idx === currentSongIndex ? 'bg-brand-purple/10 border border-brand-purple/20' : 'hover:bg-white/5 text-slate-500 hover:text-slate-200'}`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                       <img src={song.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                       <p className={`text-sm font-bold truncate ${idx === currentSongIndex ? 'text-brand-purple' : ''}`}>{song.title}</p>
                       <p className="text-[10px] uppercase font-bold text-slate-600">{song.artist}</p>
                    </div>
                    {idx === currentSongIndex && isPlaying && (
                      <div className="flex gap-1">
                         <div className="w-1 h-3 bg-brand-purple animate-bounce" style={{ animationDelay: '0s' }}></div>
                         <div className="w-1 h-3 bg-brand-purple animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                         <div className="w-1 h-3 bg-brand-purple animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </button>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
