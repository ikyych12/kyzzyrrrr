import React from 'react';
import { Card, Badge } from '../components/UI';
import { Lightbulb, ShieldCheck, AlertTriangle, CheckCircle, Info, Zap, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const TipsPage: React.FC = () => {
  const tips = [
    {
      title: 'Gunakan VPN/Warp',
      icon: ShieldCheck,
      desc: 'Selalu gunakan Cloudflare 1.1.1.1 atau VPN premium agar IP Anda tidak mudah diblokir oleh sistem WhatsApp.',
      color: 'text-blue-500'
    },
    {
      title: 'Delay Antar Pesan',
      icon: Zap,
      desc: 'Berikan jeda waktu (delay) 2-5 detik antar pesan. Jangan membabi buta mengirim ribuan pesan dalam satu detik.',
      color: 'text-amber-500'
    },
    {
      title: 'Ganti Device Berkala',
      icon: Smartphone,
      desc: 'Jika Anda menggunakan banyak nomor, usahakan gunakan device atau emulator yang berbeda untuk setiap kelompok nomor.',
      color: 'text-emerald-500'
    },
    {
      title: 'Script Isi Pesan',
      icon: Info,
      desc: 'Gunakan kata-kata yang variatif (spintax). Hindari mengirim pesan yang 100% identik ke ratusan orang sekaligus.',
      color: 'text-brand-purple'
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-brand-purple" /> Tips Aman Blast
        </h2>
        <p className="text-slate-400">Strategi jitu agar nomor WhatsApp Anda awet dan anti-banned saat melakukan blast.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full space-y-4 hover:neon-border transition-all">
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl bg-white/5 ${tip.color}`}>
                    <tip.icon className="w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-lg">{tip.title}</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tip.desc}
              </p>
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
               { step: '1', title: 'Pemanasan', desc: 'Gunakan nomor untuk chat normal selama 2-3 hari.' },
               { step: '2', title: 'Small Blast', desc: 'Mulai kirim ke 10-20 nomor per hari.' },
               { step: '3', title: 'Scale Up', desc: 'Tingkatkan jumlah perlahan hingga limit yang diinginkan.' }
            ].map(s => (
              <Card key={s.step} className="p-6 text-center space-y-2 border-white/5 hover:bg-white/[0.02] transition-all">
                 <span className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold mx-auto">{s.step}</span>
                 <h5 className="font-bold">{s.title}</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
         </div>
      </section>
    </div>
  );
};
