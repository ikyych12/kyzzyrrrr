import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { BookOpen, Play, CheckCircle, ArrowRight, ShieldCheck, Zap, AlertTriangle, X, ChevronRight, ListChecks, Smartphone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialDetail {
  title: string;
  desc: string;
  icon: any;
  details: string[];
  tips: string[];
  imagePrompt?: string;
}

export const TutorialPage: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialDetail | null>(null);

  const tutorials: TutorialDetail[] = [
    {
      title: 'Pemanasan Akun (Warming Up)',
      desc: 'Jangan langsung blast. Gunakan nomor baru untuk chat manual ke 5-10 nomor teman selama 2-3 hari untuk membangun trust di sistem WhatsApp.',
      icon: Zap,
      details: [
        'Simpan minimal 5-10 nomor teman aktif di buku kontak HP Anda.',
        'Lakukan percakapan dua arah (balas-balasan) secara natural.',
        'Masuk ke 2-3 grup WhatsApp publik berinteraksi secukupnya.',
        'Posting status WA secara berkala (minimal 1-2 kali sehari).',
        'Hindari mengirim link di hari pertama pemakaian nomor.'
      ],
      tips: [
        'Gunakan nomor yang sudah terdaftar minimal 1 minggu.',
        'Jangan mengirim pesan ke nomor yang belum menyimpan nomor Anda di awal pemanasan.'
      ]
    },
    {
      title: 'Setup Proxy / Warp',
      desc: 'Aktifkan Cloudflare Warp atau VPN sebelum membuka menu Badak WA. Ini sangat krusial untuk menyamarkan IP Address Anda.',
      icon: ShieldCheck,
      details: [
        'Download aplikasi Cloudflare 1.1.1.1 (WARP) di Play Store atau App Store.',
        'Aktifkan WARP hingga muncul ikon kunci/VPN di status bar.',
        'Buka browser dan cek IP Anda di "whatismyip.com" untuk memastikan lokasi berubah.',
        'Pastikan koneksi internet stabil sebelum memulai proses login WA Gateway.',
        'Jika menggunakan VPN berbayar, gunakan server SG atau ID.'
      ],
      tips: [
        'Cloudflare WARP lebih direkomendasikan karena ringan dan gratis.',
        'Gunakan mode WARP+, bukan hanya DNS only.'
      ]
    },
    {
      title: 'Proses Blasting',
      desc: 'Masukkan nomor target dengan format internasional (628...). Gunakan jumlah pesan yang wajar (start from 50) dan beri jeda waktu.',
      icon: Play,
      details: [
        'Siapkan daftar nomor dalam format 628xxxxxxxxxx (tanpa tanda +).',
        'Gunakan fitur "Badak WA" dan pilih jumlah pesan yang sesuai limit akun.',
        'Gunakan spintax atau variasi pesan agar tidak terdeteksi spam bot.',
        'Pantau log pengiriman secara real-time di dashboard.',
        'Jangan menutup tab browser saat proses blasting sedang berjalan.'
      ],
      tips: [
        'Mulai dari 50 pesan per hari untuk akun baru.',
        'Gunakan kata-kata sopan agar tidak di-report oleh penerima.'
      ]
    },
    {
      title: 'Monitoring & Feedback',
      desc: 'Jika ada balasan dari target, usahakan dibalas secara manual agar interaksi terdeteksi sebagai chat organik.',
      icon: CheckCircle,
      details: [
        'Cek aplikasi WhatsApp Anda secara berkala setelah melakukan blast.',
        'Segera balas pesan yang masuk dengan ramah.',
        'Jika ada nomor yang memblokir Anda, hentikan pengiriman ke segmen tersebut.',
        'Gunakan "Unband Tutor" jika nomor Anda terkena suspend sementara.',
        'Evaluasi jam-jam aktif target audience Anda.'
      ],
      tips: [
        'Balasan cepat meningkatkan konversi dan trust akun.',
        'Jangan membalas pesan dengan link promosi yang sama berulang kali.'
      ]
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
        {tutorials.map((s, i) => (
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
                 <Button 
                   variant="outline" 
                   className="rounded-xl flex items-center gap-2 group-hover:bg-white/5"
                   onClick={() => setSelectedTutorial(s)}
                 >
                   Pelajari Detail <ArrowRight className="w-4 h-4" />
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

      <AnimatePresence>
        {selectedTutorial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-brand-gray border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedTutorial(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto scrollbar-none">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple">
                    <selectedTutorial.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{selectedTutorial.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Detail Panduan & Langkah</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-brand-purple" /> Langkah Pelaksanaan:
                    </h4>
                    <div className="space-y-3">
                      {selectedTutorial.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                          <span className="w-6 h-6 rounded-lg bg-brand-purple text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-brand-purple/10 border border-brand-purple/20 space-y-3">
                    <h4 className="font-bold text-brand-purple flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Pro Tips:
                    </h4>
                    <ul className="space-y-2">
                      {selectedTutorial.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-slate-400 italic">
                          <span className="text-brand-purple font-black">»</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button 
                  className="w-full h-14" 
                  onClick={() => setSelectedTutorial(null)}
                >
                  Selesai Membaca
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
