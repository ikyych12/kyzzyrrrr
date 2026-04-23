import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Download, Smartphone, Layout, Apple, Zap, CheckCircle2, Info, Share, PlusSquare } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export const InstallAppPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Gunakan browser Chrome/Edge untuk fitur instalasi otomatis.');
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Terima kasih telah mengunduh!');
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="premium" className="bg-brand-purple/20 text-brand-purple border-brand-purple/30">PWA Technology</Badge>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-tight">
          Install <span className="text-brand-purple">Kyzzyy</span> <br />
          Ke Layar Beranda
        </h1>
        <p className="text-slate-400 text-lg font-medium max-w-2xl">
          Ubah panel web ini menjadi aplikasi tanpa perlu download file APK. Lebih ringan, cepat, dan selalu terupdate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Install Action Card */}
        <Card className="p-8 border-brand-purple/20 bg-brand-purple/5 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-purple rounded-3xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(168,85,247,0.4)]">
              <Download className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">Instalasi Instan</h3>
              <p className="text-slate-400 text-sm mt-1">Hanya mendukung Chrome & Edge terbaru.</p>
            </div>
          </div>

          <Button 
            className="h-16 rounded-2xl text-lg font-black italic tracking-widest gap-3"
            onClick={handleInstallClick}
          >
            {deferredPrompt ? 'INSTALL SEKARANG' : 'DAPATKAN APLIKASI'}
          </Button>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest pt-4 border-t border-white/10">
             <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Ringan (300KB)</div>
             <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Offline Mode</div>
          </div>
        </Card>

        {/* Tutorial Card */}
        <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black italic tracking-tight uppercase">Panduan Manual</h3>
              <div className="flex gap-2">
                 <button onClick={() => setPlatform('android')} className={`p-2 rounded-lg transition-all ${platform === 'android' ? 'bg-brand-purple text-white' : 'bg-white/5 text-slate-500'}`}><Smartphone className="w-5 h-5" /></button>
                 <button onClick={() => setPlatform('ios')} className={`p-2 rounded-lg transition-all ${platform === 'ios' ? 'bg-brand-purple text-white' : 'bg-white/5 text-slate-500'}`}><Apple className="w-5 h-5" /></button>
              </div>
           </div>

           <div className="space-y-6">
              {platform === 'ios' ? (
                <div className="space-y-4">
                   {[
                     { icon: Share, text: "Ketuk ikon 'Share' di bagian bawah browser Safari." },
                     { icon: PlusSquare, text: "Scroll ke bawah dan pilih 'Add to Home Screen'." },
                     { icon: Layout, text: "Klik 'Add' di pojok kanan atas untuk konfirmasi." }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-purple shrink-0 border border-white/5">
                           <step.icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed pt-2">{step.text}</p>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="space-y-4">
                   {[
                     { icon: Zap, text: "Klik titik tiga (⋮) di pojok kanan atas browser." },
                     { icon: Smartphone, text: "Pilih menu 'Install App' atau 'Add to Home Screen'." },
                     { icon: Layout, text: "Tunggu sebentar sampai aplikasi muncul di layar HP Anda." }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-purple shrink-0 border border-white/5">
                           <step.icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed pt-2">{step.text}</p>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </Card>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { title: "No Update", desc: "Aplikasi akan terupdate secara otomatis setiap kali Anda membukanya.", color: "text-blue-400" },
           { title: "Storage Savvy", desc: "Tidak menghabiskan memori RAM maupun penyimpanan internal HP Anda.", color: "text-emerald-400" },
           { title: "Fast Launch", desc: "Membuka panel langsung dari homescreen tanpa perlu mengetik URL lagi.", color: "text-amber-400" }
         ].map((item, i) => (
           <Card key={i} className="p-6 border-white/5 bg-white/[0.01] space-y-2">
              <h4 className={`font-black italic uppercase tracking-tighter ${item.color}`}>{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
           </Card>
         ))}
      </div>

      <div className="flex items-center gap-4 p-6 bg-brand-purple/5 border border-brand-purple/10 rounded-[2rem]">
         <Info className="w-8 h-8 text-brand-purple shrink-0" />
         <p className="text-xs text-slate-400 font-medium leading-relaxed">
           Fitur ini menggunakan teknologi <span className="text-white font-bold">Progressive Web App (PWA)</span> yang didukung oleh Google Chrome, Microsoft Edge, dan Safari. Ini adalah standar terbaru untuk aplikasi web modern yang bisa diinstal.
         </p>
      </div>
    </div>
  );
};
