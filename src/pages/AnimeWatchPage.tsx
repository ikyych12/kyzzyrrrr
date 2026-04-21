import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeService } from '../services/animeService';
import { Anime } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Play, Star, Clock, Calendar, ChevronLeft, Loader2, Info, Share2, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export const AnimeWatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await animeService.getAnimeById(Number(id));
        setAnime(data);
      } catch (e) {
        console.error(e);
        toast.error('Gagal mengambil data anime');
        navigate('/anime');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-brand-sakura" />
        <p className="font-display font-black text-2xl uppercase italic tracking-tighter text-brand-sakura animate-pulse">Syncing with Jikan Database...</p>
      </div>
    );
  }

  if (!anime) return null;

  return (
    <div className="space-y-8 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-sakura font-bold transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Discovery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Poster & Basic Info */}
        <div className="space-y-6">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl"
           >
              <img 
                src={anime.images.jpg.large_image_url} 
                alt={anime.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-50" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                 <Badge variant="sakura" className="bg-brand-sakura/90 text-white border-brand-sakura font-black italic scale-125 px-4">
                   ★ {anime.score}
                 </Badge>
                 <button className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-brand-sakura transition-colors">
                    <Heart className="w-6 h-6 text-white" />
                 </button>
              </div>
           </motion.div>

           <Card className="p-6 space-y-6 bg-brand-sakura/5 border-brand-sakura/10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Status</span>
                    <span className="text-emerald-400">{anime.status}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Episodes</span>
                    <span className="text-white">{anime.episodes || 'Ongoing'} eps</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Released</span>
                    <span className="text-white">{anime.year || 'N/A'}</span>
                 </div>
              </div>
              <div className="flex flex-wrap gap-2">
                 {anime.genres.map(g => (
                   <span key={g.name} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-brand-sakura/20 hover:text-brand-sakura cursor-default">
                     {g.name}
                   </span>
                 ))}
              </div>
           </Card>
        </div>

        {/* Right: Player & Details */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4">
              <h1 className="text-5xl font-display font-black tracking-tighter italic uppercase leading-none text-white drop-shadow-2xl">
                {anime.title}
              </h1>
              <div className="flex items-center gap-4">
                 <Badge variant="free" className="bg-brand-purple/10 text-brand-purple font-black italic tracking-widest">
                   HD STREAMING
                 </Badge>
                 <p className="text-slate-500 font-bold italic text-sm">{anime.score > 8 ? 'Masterpiece Ranking' : 'High Quality'}</p>
              </div>
           </div>

           {/* Watch Section */}
           <div className="relative rounded-[2rem] overflow-hidden bg-brand-gray border border-white/5 shadow-2xl">
              {!isPlaying ? (
                <div className="aspect-video relative group flex items-center justify-center">
                   <img 
                     src={anime.images.jpg.large_image_url} 
                     className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 grayscale"
                     alt="bg"
                   />
                   <div className="relative z-10 text-center space-y-4 p-8">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="w-24 h-24 bg-brand-sakura text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,138,176,0.6)] hover:scale-110 active:scale-95 transition-all group/play"
                      >
                         <Play className="w-10 h-10 fill-current group-hover/play:scale-110 transition-transform" />
                      </button>
                      <div>
                        <h4 className="text-2xl font-display font-black italic uppercase italic tracking-tighter">Mulai Menonton</h4>
                        <p className="text-slate-500 font-medium">Buka server streaming eksternal Kyzzyy</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="aspect-video w-full bg-black">
                   {anime.trailer?.embed_url ? (
                     <iframe 
                       src={`${anime.trailer.embed_url}&autoplay=1`}
                       className="w-full h-full"
                       title="Trailer/Watch"
                       allowFullScreen
                     />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-brand-sakura" />
                        <div className="space-y-1">
                          <p className="font-black italic uppercase text-brand-sakura">Mencoba menghubungkan ke server...</p>
                          <p className="text-xs text-slate-500 max-w-xs">Saat ini server Jikan sedang limit, trailer/video tidak tersedia secara langsung. Cobalah beberapa saat lagi.</p>
                        </div>
                        <Button variant="outline" className="h-10 text-xs" onClick={() => setIsPlaying(false)}>Tutup Player</Button>
                     </div>
                   )}
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase flex items-center gap-3">
                   <Info className="w-6 h-6 text-brand-sakura" /> Synopsis
                 </h3>
                 <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Share2 className="w-5 h-5" /></button>
                 </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg font-medium italic">
                {anime.synopsis || 'Maaf, sinopsis tidak tersedia untuk judul ini dalam database Jikan API.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <Button variant="sakura" className="h-16 text-xl tracking-tighter italic uppercase italic font-black shadow-xl">
                   Tonton Server 1 🚀
                 </Button>
                 <Button variant="outline" className="h-16 text-xl tracking-tighter italic uppercase italic font-black">
                    Download HD <ExternalLink className="w-5 h-5 ml-2" />
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
