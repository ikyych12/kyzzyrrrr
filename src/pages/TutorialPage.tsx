import React from 'react';
import { Card, Badge, Button } from '../components/UI';
import { BookOpen, Play, CheckCircle, ArrowRight, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export const TutorialPage: React.FC = () => {
  const steps = [
    {
      title: 'Pemanasan Akun (Warming Up)',
      desc: 'Jangan langsung blast. Gunakan nomor baru untuk chat manual ke 5-10 nomor teman selama 2-3 hari untuk membangun trust di sistem WhatsApp.',
      icon: Zap
    },
    {
      title: 'Setup Proxy / Warp',
      desc: 'Aktifkan Cloudflare Warp atau VPN sebelum membuka menu Badak WA. Ini sangat krusial untuk menyamarkan IP Address Anda.',
      icon: ShieldCheck
    },
    {
      title: 'Proses Blasting',
      desc: 'Masukkan nomor target dengan format internasional (628...). Gunakan jumlah pesan yang wajar (start from 50) dan beri jeda waktu.',
      icon: Play
    },
    {
      title: 'Monitoring & Feedback',
      desc: 'Jika ada balasan dari target, usahakan dibalas secara manual agar interaksi terdeteksi sebagai chat organik.',
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-purple" /> Tutorial Blast WA
          </h2>
          <p className="text-slate-400">Panduan langkah demi langkah menggunakan Badak WA dengan aman.</p>
        </div>
        <Badge variant="premium">GUIDE V2.1</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="flex flex-col md:flex-row gap-6 p-8 hover:neon-border transition-all group">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple shrink-0 group-hover:bg-brand-purple group-hover:text-white transition-all">
                <s.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {i + 1}</span>
                  <h4 className="font-bold text-xl">{s.title}</h4>
                </div>
                <p className="text-slate-400 leading-relaxed italic">
                  "{s.desc}"
                </p>
              </div>
              <div className="flex items-center">
                 <Button variant="outline" className="rounded-xl flex items-center gap-2 group-hover:bg-white/5">
                   Next <ArrowRight className="w-4 h-4" />
                 </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-amber-500/5 border-amber-500/20">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
               <h4 className="font-bold text-amber-500 text-lg">Catatan Penting</h4>
               <p className="text-slate-300 leading-relaxed text-sm">
                 Gunakanlah "Badak WA" hanya untuk keperluan marketing positif. Kami tidak bertanggung jawab atas penyalahgunaan tools untuk tindakan yang merugikan pihak lain atau melanggar hukum.
               </p>
            </div>
         </div>
      </Card>
    </div>
  );
};
