import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, SkipForward, X, Maximize2, Minimize2, Disc } from 'lucide-react';
import { cn } from '../utils/helpers';

export const FloatingPlayer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [spotifyTrack, setSpotifyTrack] = useState<any>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch('/api/spotify/current-track');
        if (res.ok) {
          const data = await res.json();
          setSpotifyTrack(data.playing ? data : null);
        }
      } catch (err) {}
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={() => setIsVisible(true)}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white shadow-2xl"
    >
      <Music className="w-6 h-6" />
    </motion.button>
  );

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "fixed bottom-6 right-6 z-[60] bg-brand-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500",
          isExpanded ? "w-72" : "w-16 h-16"
        )}
      >
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center relative group"
          >
            {spotifyTrack?.item?.album?.images?.[0]?.url ? (
              <img src={spotifyTrack.item.album.images[0].url} className="w-full h-full object-cover rounded-[2rem] opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
            ) : (
              <Disc className="w-8 h-8 text-brand-purple animate-spin-slow" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-brand-purple" />
                <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Floating Hub</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsExpanded(false)} className="p-1 px-2 hover:bg-white/5 rounded-lg text-slate-500"><Minimize2 className="w-3 h-3" /></button>
                <button onClick={() => setIsVisible(false)} className="p-1 px-2 hover:bg-red-500/20 rounded-lg text-red-500"><X className="w-3 h-3" /></button>
              </div>
            </div>

            {spotifyTrack ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <img src={spotifyTrack.item.album.images[0].url} className="w-12 h-12 rounded-xl shadow-lg" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{spotifyTrack.item.name}</p>
                    <p className="text-[10px] text-brand-purple font-bold truncate tracking-widest uppercase">
                      {spotifyTrack.item.artists.map((a: any) => a.name).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <button onClick={() => fetch('/api/spotify/controls/prev', { method: 'POST' })} className="text-slate-400 hover:text-white transition-colors"><SkipForward className="w-5 h-5 rotate-180" /></button>
                  <button 
                    onClick={() => fetch(`/api/spotify/controls/${spotifyTrack.is_playing ? 'pause' : 'play'}`, { method: 'POST' })}
                    className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    {spotifyTrack.is_playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
                  </button>
                  <button onClick={() => fetch('/api/spotify/controls/next', { method: 'POST' })} className="text-slate-400 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Active Track</p>
                <div className="flex justify-center">
                  <Disc className="w-8 h-8 text-slate-800 animate-spin-slow" />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
