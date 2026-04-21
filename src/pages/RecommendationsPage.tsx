import React from 'react';
import { Card, Badge } from '../components/UI';
import { ThumbsUp, ThumbsDown, Star, AlertTriangle, ExternalLink, Zap, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export const RecommendationsPage: React.FC = () => {
  const recommended = [
    { 
      name: 'Jagoan WA', 
      rate: '800', 
      url: 'https://www.jagoanwa.my.id/ref/JW-K0J159',
      desc: 'Pilihan utama dengan rate tertinggi dan stabilitas server maksimal.'
    },
    { 
      name: 'Wasarangduit', 
      rate: '700', 
      url: 'https://ws1.wasarangduit.xyz/?ref=wasarangduit-99010477',
      desc: 'Sangat direkomendasikan untuk penggunaan harian skala besar.'
    },
    { 
      name: 'WA CUAN', 
      rate: '650', 
      url: 'https://wacuannq.com/register?ref=1F664B9E',
      desc: 'Rate bersaing dengan proses registrasi yang sangat cepat.'
    },
    { 
      name: 'Kirim Dulu', 
      rate: '600', 
      url: 'https://kirimdulux.com/signup?referral=REF-0C7F273C',
      desc: 'Layanan terpercaya dengan antarmuka yang user-friendly.'
    },
    { 
      name: 'Gabung WA', 
      rate: '400', 
      url: 'https://gabungwa.net/signup?ref=82145',
      desc: 'Cocok untuk pemula yang baru memulai dunia WhatsApp blast.'
    },
    { 
      name: 'Monster WA', 
      rate: '-', 
      url: 'https://monsterwa1.com/register?ref=REFmgdmkDB',
      desc: 'Opsi alternatif dengan fitur-fitur unik yang patut dicoba.'
    }
  ];

  const notRecommended = [
    { 
      name: 'Aganwa / Aganwa2.com', 
      url: '#',
      desc: 'Tidak disarankan karena alasan keamanan atau ketidakstabilan sistem.' 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-brand-purple/20 rounded-3xl flex items-center justify-center mx-auto border border-brand-purple/20 shadow-2xl"
        >
          <Star className="w-10 h-10 text-brand-purple" />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">Link Blast <span className="text-brand-purple">Rekomendasi</span> 🚀</h2>
          <p className="text-slate-400 font-medium">Kumpulan layanan blast WhatsApp terbaik yang terbukti membayar.</p>
          <div className="pt-2">
            <Badge variant="premium" className="animate-pulse">Tekan teks/nama layanan untuk menuju ke website</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <ThumbsUp className="w-6 h-6 text-brand-purple" />
          <h3 className="text-xl font-black italic uppercase">Layanan <span className="text-brand-purple">Rekomendasi</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group block"
            >
              <Card className="h-full hover:neon-border transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2">
                {item.rate !== '-' && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-brand-purple text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl italic tracking-widest">
                      RATE: {item.rate}
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-black italic uppercase group-hover:text-brand-purple transition-colors">{item.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-brand-purple uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pt-2">
                    Kunjungi Website <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-3 px-2">
          <ThumbsDown className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-black italic uppercase">Tidak <span className="text-red-500">Disarankan</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notRecommended.map((item) => (
            <Card key={item.name} className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-display font-black italic uppercase text-red-400">{item.name}</h4>
                  <p className="text-xs text-red-500/70 leading-relaxed italic font-medium">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 border-brand-purple/20 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-4xl">
            💡
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h4 className="text-xl font-black italic uppercase">Tips Memilih Layanan</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gunakan layanan dengan rate tinggi untuk hasil maksimal. Setiap layanan memiliki sistem pembayaran dan penarikan yang berbeda-beda. Pastikan Anda membaca syarat dan ketentuan di masing-masing website.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
