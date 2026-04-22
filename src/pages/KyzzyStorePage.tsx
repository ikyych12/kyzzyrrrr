import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { ShoppingCart, Server, Cpu, Database, ChevronRight, CheckCircle2, Star, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const KyzzyStorePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vps' | 'panel'>( 'vps');
  const [discount, setDiscount] = useState(0);
  const [vpsPrices, setVpsPrices] = useState({
    r4c2: '12.000',
    r8c4: '15.000',
    reseller: '18.000',
    admin: '25.000',
    owner: '40.000'
  });

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.panelDiscount) {
      setDiscount(settings.panelDiscount);
    }
    if (settings.vpsPrices) {
      setVpsPrices(settings.vpsPrices);
    }
  }, []);

  const vpsProducts = [
    { name: 'VPS R4C2', price: vpsPrices.r4c2, icon: Server, color: 'text-blue-400', desc: '4GB RAM / 2 CPU - Performa stabil untuk aplikasi ringan.' },
    { name: 'VPS R8C4', price: vpsPrices.r8c4, icon: Cpu, color: 'text-purple-400', desc: '8GB RAM / 4 CPU - Powerhouse untuk kebutuhan berat.' },
    { name: 'RESELLER VPS', price: vpsPrices.reseller, icon: Database, color: 'text-emerald-400', desc: 'Bisa jual kembali VPS. Benefit: Sekali Free CVPS, Pajak 7k/VPS.', isSpecial: true },
    { name: 'ADMIN VPS', price: vpsPrices.admin, icon: ShieldCheck, color: 'text-brand-gold', desc: 'Bisa jual VPS & Reseller. Benefit: Sekali Free CVPS, Pajak 7k/VPS.', isSpecial: true },
    { name: 'OWNER VPS', price: vpsPrices.owner, icon: Zap, color: 'text-red-400', desc: 'Akses penuh. Jual VPS, Reseller, Owner. Benefit: Sekali Free CVPS, Pajak 7k/VPS.', isSpecial: true },
  ];

  const panelProducts = [
    { size: '1GB', basePrice: 3000 },
    { size: '2GB', basePrice: 4000 },
    { size: '3GB', basePrice: 6000 },
    { size: '4GB', basePrice: 8000 },
    { size: '5GB', basePrice: 10000 },
    { size: '6GB', basePrice: 12000 },
    { size: '7GB', basePrice: 14000 },
    { size: '8GB', basePrice: 16000 },
    { size: '9GB', basePrice: 18000 },
    { size: '10GB', basePrice: 20000 },
    { size: 'UNLIMITED', basePrice: 13000, originalPrice: 22000 },
  ];

  const calculatePrice = (base: number) => {
    const priceAfterDiscount = base - (base * (discount / 100));
    return Math.round(priceAfterDiscount).toLocaleString('id-ID');
  };

  const handleOrder = async (itemName: string, price: string, category: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu!');
      return;
    }

    const tId = toast.loading('Memproses pesanan...');
    
    try {
      const response = await fetch('/api/purchase-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName,
          price,
          category,
          username: user.username,
          phoneNumber: user.nomor
        })
      });

      if (response.ok) {
        toast.success('Pesan terdeteksi! Silakan hubungi owner untuk pembayaran.', { id: tId });
        window.open('https://t.me/kyzzynew', '_blank');
      } else {
        throw new Error('Gagal mengirim notifikasi');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses pesanan. Langsung hubungi owner saja.', { id: tId });
      window.open('https://t.me/kyzzynew', '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-brand-purple" /> KYZZYY <span className="text-brand-purple">STORE</span>
          </h2>
          <p className="text-slate-400 text-sm uppercase font-black tracking-widest">Penyedia VPS & Panel Legal Terpercaya</p>
        </div>

        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          <button 
            onClick={() => setActiveTab('vps')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'vps' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            VPS SERVICES
          </button>
          <button 
            onClick={() => setActiveTab('panel')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'panel' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            PANEL HOSTING
          </button>
        </div>
      </div>

      {activeTab === 'vps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vpsProducts.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`h-full flex flex-col p-8 border-white/5 bg-white/[0.02] hover:neon-border transition-all duration-500 group relative ${p.isSpecial ? 'overflow-hidden' : ''}`}>
                {p.isSpecial && (
                  <div className="absolute top-4 right-[-35px] bg-brand-gold text-black font-black text-[10px] py-1 px-10 rotate-45 uppercase shadow-xl">
                    BEST VALUE
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${p.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-8 h-8" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-black italic tracking-tight">{p.name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{p.desc}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Akun Legal 100%
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Uptime 99.9%
                    </div>
                    {p.isSpecial && (
                      <div className="flex items-center gap-2 text-[10px] text-brand-sakura font-bold uppercase">
                        <Star className="w-3 h-3" /> Free Sekali CVPS
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price Start At</p>
                    <p className="text-2xl font-display font-black text-white italic leading-none">Rp {p.price}</p>
                  </div>
                  <Button className="rounded-xl px-4 py-2 text-[10px] h-10" onClick={() => handleOrder(p.name, p.price, 'VPS')}>
                    ORDER <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'panel' && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border-brand-purple/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Database className="w-32 h-32" />
            </div>
            <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Panel Legal Kyzzyy</h3>
              <p className="text-xs text-slate-400 font-medium italic">"Kualitas server berkelas dengan harga kaki lima."</p>
            </div>
            {discount > 0 && (
              <Badge variant="premium" className="relative z-10 text-lg py-2 px-6">
                🔥 GLOBAL DISCOUNT: {discount}% OFF
              </Badge>
            )}
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
             {panelProducts.map((p, idx) => (
               <Card key={idx} className="p-4 flex flex-col items-center text-center space-y-4 hover:neon-border transition-all border-white/5 bg-white/[0.02]">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-purple">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-black italic">{p.size}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ram Hosting</p>
                  </div>
                  <div className="py-2">
                    {p.originalPrice && (
                      <p className="text-[10px] text-slate-600 line-through font-bold mb-1">Rp {p.originalPrice.toLocaleString('id-ID')}</p>
                    )}
                    <p className="text-xl font-display font-black text-emerald-400 italic leading-none">
                      Rp {calculatePrice(p.basePrice)}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full text-[9px] h-8 rounded-lg" onClick={() => handleOrder(`Panel ${p.size}`, calculatePrice(p.basePrice), 'Hosting')}>
                    ORDER
                  </Button>
               </Card>
             ))}
          </div>
        </div>
      )}

      <Card className="p-8 text-center space-y-4 bg-white/5 border-white/10">
         <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-12 h-12 text-brand-gold" />
            <div className="space-y-1">
               <h4 className="font-bold text-xl uppercase tracking-tighter">Garansi Legalitas</h4>
               <p className="text-xs text-slate-400 max-w-lg mx-auto">
                 Semua VPS dan Panel yang kami jual adalah 100% legal. Kami menjamin keamanan data dan uptime server Anda. Untuk Reseller/Admin/Owner VPS, pajak pembuatan VPS senilai Rp 7.000 / VPS.
               </p>
            </div>
            <Button variant="outline" className="mt-4 rounded-full px-8" onClick={() => window.open('https://t.me/kyzzynew', '_blank')}>
              HUBUNGI OWNER
            </Button>
         </div>
      </Card>
    </div>
  );
};
