import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { Lightbulb, ShieldCheck, AlertTriangle, CheckCircle, Info, Zap, Smartphone, ChevronDown, ExternalLink, Globe, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/helpers';

interface Tip {
  title: string;
  icon: any;
  desc: string;
  details: string;
  color: string;
  links?: { label: string; url: string }[];
}

export const TipsPage: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const tips: Tip[] = [
    {
      title: 'Gunakan VPN/Warp',
      icon: ShieldCheck,
      desc: 'Selalu gunakan Cloudflare 1.1.1.1 atau VPN premium agar IP Anda tidak mudah diblokir oleh sistem WhatsApp.',
      details: 'WhatsApp melacak alamat IP pengirim. Jika ribuan pesan dikirim dari satu IP statis yang sama, sistem anti-spam mereka akan mencatatnya sebagai aktivitas bot. Dengan VPN/WARP, IP Anda akan berubah dan melewati jalur enkripsi yang lebih aman.',
      color: 'text-blue-500',
      links: [
        { label: 'Download Cloudflare WARP', url: 'https://1.1.1.1/' },
        { label: 'Cek IP Address', url: 'https://whatismyip.com' }
      ]
    },
    {
      title: 'Delay Antar Pesan',
      icon: Zap,
      desc: 'Berikan jeda waktu (delay) 2-5 detik antar pesan. Jangan membabi buta mengirim ribuan pesan dalam satu detik.',
      details: 'Pengiriman yang terlalu cepat dalam rentang waktu singkat adalah indikasi kuat penggunaan robot. Badak WA v2.0 memiliki algoritma random delay, namun kombinasi jeda manual antar batch tetap disarankan untuk keamanan ekstra.',
      color: 'text-amber-500'
    },
    {
      title: 'Ganti Device Berkala',
      icon: Smartphone,
      desc: 'Jika Anda menggunakan banyak nomor, usahakan gunakan device atau emulator yang berbeda untuk setiap kelompok nomor.',
      details: 'WhatsApp juga mendeteksi "Device ID". Jika 20 nomor terkena banned pada satu perangkat yang sama, nomor ke-21 yang login di sana kemungkinan besar akan langsung diblokir. Lakukan pembersihan cache secara berkala.',
      color: 'text-emerald-500'
    },
    {
      title: 'Script Isi Pesan (Spintax)',
      icon: Info,
      desc: 'Gunakan kata-kata yang variatif (spintax). Hindari mengirim pesan yang 100% identik ke ratusan orang sekaligus.',
      details: 'Sistem deteksi teks WhatsApp sangat cerdas. Jika konten pesan Anda identik dan dilaporkan oleh 2-3 orang, konten tersebut akan di-blacklist. Gunakan sinonim atau format kalimat yang berbeda-beda.',
      color: 'text-brand-purple',
      links: [
        { label: 'Contoh Spintax Creator', url: 'https://www.google.com/search?q=whatsapp+spintax+generator' }
      ]
    }
  ];

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-brand-purple" /> Tips Aman Blast
        </h2>
        <p className="text-slate-400">Strategi jitu agar nomor WhatsApp Anda awet dan anti-banned saat melakukan blast.</p>
      </div>

      <div className="space-y-4">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card 
              className={cn(
                "p-0 overflow-hidden border-white/5 hover:border-brand-purple/20 transition-all cursor-pointer",
                expandedIndex === idx && "border-brand-purple/30 bg-brand-purple/[0.02]"
              )}
              onClick={() => toggleExpand(idx)}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={cn("p-3 rounded-xl bg-white/5", tip.color)}>
                      <tip.icon className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-bold text-lg">{tip.title}</h4>
                      <p className={cn("text-xs transition-opacity duration-300", expandedIndex === idx ? "opacity-0 h-0 overflow-hidden" : "text-slate-500 italic")}>
                        {tip.desc}
                      </p>
                   </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-500"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 space-y-6 border-t border-white/5 bg-black/20">
                       <div className="space-y-3">
                         <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple/80">Penjelasan Lengkap</h5>
                         <p className="text-sm text-slate-300 leading-relaxed italic">
                           "{tip.details}"
                         </p>
                       </div>

                       {tip.links && (
                         <div className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tautan Terkait</h5>
                            <div className="flex flex-wrap gap-3">
                               {tip.links.map((link, lIdx) => (
                                 <button
                                   key={lIdx}
                                   onClick={(e) => { e.stopPropagation(); window.open(link.url, '_blank'); }}
                                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 hover:text-white hover:border-brand-purple/50 transition-all uppercase tracking-widest"
                                 >
                                   {link.label} <ExternalLink className="w-3 h-3" />
                                 </button>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-red-500/20 bg-red-500/5">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
               <h4 className="font-bold text-red-500">Golden Rule</h4>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Jangan pernah menggunakan nomor pribadi utama untuk melakukan blasting. Risiko banned selalu ada meskipun sudah menggunakan tips di atas. Gunakan nomor khusus (nomor tumbal) untuk kegiatan blast bisnis Anda.
               </p>
            </div>
         </div>
      </Card>

      <section className="space-y-6 pt-4">
         <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> Tahapan Ideal Blast
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
               { step: '1', title: 'Pemanasan', desc: 'Gunakan nomor untuk chat normal selama 2-3 hari.', icon: ShieldAlert },
               { step: '2', title: 'Small Blast', desc: 'Mulai kirim ke 10-20 nomor per hari.', icon: Zap },
               { step: '3', title: 'Scale Up', desc: 'Tingkatkan jumlah perlahan hingga limit yang diinginkan.', icon: Globe }
            ].map(s => (
              <Card key={s.step} className="p-6 text-center space-y-4 border-white/5 hover:bg-white/[0.02] transition-all group">
                 <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto group-hover:bg-brand-purple group-hover:text-white transition-all">
                    <s.icon className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <h5 className="font-bold">{s.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed px-2">{s.desc}</p>
                 </div>
              </Card>
            ))}
         </div>
      </section>
    </div>
  );
};
