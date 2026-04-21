import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { animeService } from '../services/animeService';
import { Anime } from '../types';
import { Card, Input, Badge, Button } from '../components/UI';
import { Search, TrendingUp, Calendar, Play, Loader2, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AnimeDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'trending';
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Anime[] = [];
        if (activeTab === 'trending') data = await animeService.getTopAnime(page);
        else if (activeTab === 'seasonal') data = await animeService.getSeasonalAnime(page);
        else if (activeTab === 'search' && query) data = await animeService.searchAnime(query, page);
        setAnimes(prev => page === 1 ? data : [...prev, ...data]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, query, page]);

  // Reset page when tab or query changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ tab: 'search', q: query });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">
            All <span className="text-brand-sakura">Anime</span> 🏯
          </h2>
          <p className="text-slate-400 font-medium">Jelajahi ribuan library anime terlengkap di Kyzzyy.</p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {[
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'seasonal', label: 'Seasonal', icon: Calendar },
            { id: 'search', label: 'Search', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-sakura text-white shadow-lg shadow-brand-sakura/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'search' && (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
          <Input
            value={query}
            onChange={setQuery}
            placeholder="Cari judul anime favoritmu..."
            className="flex-1"
            icon={<Search className="w-5 h-5" />}
          />
          <Button type="submit" variant="sakura" className="h-14">Search</Button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {animes.map((anime, idx) => (
            <motion.div
              key={`${anime.mal_id}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (idx % 20) * 0.05 }}
              className="group"
            >
              <Link to={`/anime/${anime.mal_id}`}>
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 shadow-2xl group-hover:border-brand-sakura/50 transition-all duration-500">
                  <img 
                    src={anime.images.jpg.large_image_url} 
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge variant="sakura" className="backdrop-blur-md bg-brand-sakura/40 text-white font-black italic">
                      ★ {anime.score || 'N/A'}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display font-black text-white text-sm line-clamp-2 uppercase italic leading-none mb-2 drop-shadow-lg">
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                       <Play className="w-4 h-4 text-brand-sakura fill-current" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-sakura">Tonton Sekarang</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
           <Loader2 className="w-8 h-8 animate-spin text-brand-sakura" />
        </div>
      )}

      {animes.length > 0 && !loading && (
        <div className="flex justify-center pt-8">
           <Button 
             variant="outline" 
             onClick={() => setPage(prev => prev + 1)}
             className="h-14 px-12 rounded-3xl font-black italic uppercase tracking-tighter hover:border-brand-sakura/50"
           >
             Muat Lebih Banyak Anime... 🏯
           </Button>
        </div>
      )}

      {!loading && animes.length === 0 && (
         <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700 border border-white/5">
               <Search className="w-10 h-10" />
            </div>
            <p className="font-bold text-slate-500 uppercase tracking-widest italic">Belum ada anime untuk ditampilkan. Cari sesuatu, Nii-chan!</p>
         </div>
      )}
    </div>
  );
};
