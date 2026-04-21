import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input } from '../components/UI';
import { Ban, ShieldCheck, Mail, ClipboardCheck, ArrowRight, Zap, ListCheck, Smartphone, MessageSquare, Copy, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export const UnbandPage: React.FC = () => {
  const [nomorTerblokir, setNomorTerblokir] = useState('');
  const [pesanTambahan, setPesanTambahan] = useState('');
  const [activeTab, setActiveTab] = useState<'unband' | 'limit'>('unband');
  
  const templateScript = `Hi WhatsApp Support,\n\nMy number ${nomorTerblokir || '(Masukkan Nomor)'} was banned by mistake. I was only trying to reach my customers/friends and didn't violate any terms. ${pesanTambahan ? '\n\nAdditional Info: ' + pesanTambahan : ''}\n\nPlease investigate and restore my account. Thank you!`;

  const scripts = [
    { title: 'Tutor Anti-Band Reguler', detail: 'Metode dasar menggunakan laporan bug', cat: 'limit' },
    { title: 'Bypass Limit Blast', detail: 'Cara agar bisa blast ribuan pesan tanpa delay', cat: 'limit' },
    { title: 'Unband Permanent', detail: 'Script email lapor untuk nomor yang kena ban permanen', cat: 'unband' },
    { title: 'Restore Chat History', detail: 'Mengembalikan chat setelah ganti device', cat: 'limit' }
  ];

  const handleCopy = () => {
    if (!nomorTerblokir) {
      toast.error('Masukkan nomor yang terblokir dulu!');
      return;
    }
    navigator.clipboard.writeText(templateScript);
    toast.success('Script banding disalin!');
  };

  const handleEmail = () => {
    if (!nomorTerblokir) {
      toast.error('Masukkan nomor yang terblokir dulu!');
      return;
    }
    const subject = encodeURIComponent('Question about my account');
    const body = encodeURIComponent(templateScript);
    window.location.href = `mailto:support@whatsapp.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-display tracking-tighter uppercase italic flex items-center gap-3">
            <Ban className="w-10 h-10 text-brand-purple" /> Unband <span className="text-brand-purple">&</span> Limit
          </h2>
          <p className="text-slate-400 font-medium">Tools generator script dan panduan bypass limit WA.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('unband')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic transition-all ${activeTab === 'unband' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            UNBAND
          </button>
          <button 
            onClick={() => setActiveTab('limit')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic transition-all ${activeTab === 'limit' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            LIMIT
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'unband' ? (
          <motion.div 
            key="unband"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <Card className="space-y-6">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                 <div className="w-12 h-12 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple">
                    <Smartphone className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black italic uppercase">Input <span className="text-brand-purple">Data</span></h3>
              </div>

              <div className="space-y-4">
                <Input 
                  label="Nomor WA Terblokir"
                  value={nomorTerblokir}
                  onChange={setNomorTerblokir}
                  placeholder="Contoh: +628123xxx"
                  icon={<Smartphone className="w-5 h-5" />}
                />
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Pesan Tambahan (Opsional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-slate-500" />
                    <textarea 
                      value={pesanTambahan}
                      onChange={(e) => setPesanTambahan(e.target.value)}
                      placeholder="Sebutkan alasan kenapa Anda diblokir..."
                      className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-5 pl-14 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-purple/[0.02] transition-all placeholder:text-slate-600 font-medium min-h-[120px] text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] italic">Preview Script:</p>
                 <div className="bg-black/40 rounded-2xl p-6 border border-white/10 relative group font-mono text-xs leading-relaxed text-slate-300 min-h-[100px] whitespace-pre-wrap italic">
                    {templateScript}
                 </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-16 uppercase font-black italic tracking-widest" onClick={handleCopy}>
                  <Copy className="w-5 h-5" /> Salin
                </Button>
                <Button className="flex-1 h-16 uppercase font-black italic tracking-widest" onClick={handleEmail}>
                  <Send className="w-5 h-5" /> Kirim
                </Button>
              </div>
            </Card>

            <div className="space-y-6 text-center lg:text-left">
               <Card className="bg-brand-purple/5 border-brand-purple/20">
                  <div className="flex flex-col items-center lg:items-start gap-4 p-4">
                     <div className="w-16 h-16 bg-brand-purple rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-brand-purple/30">
                        <ShieldCheck className="w-8 h-8" />
                     </div>
                     <h4 className="text-2xl font-black italic uppercase">Buka Banding <span className="text-brand-purple">Instan</span></h4>
                     <p className="text-sm text-slate-400 leading-relaxed italic">
                        Script di atas menggunakan algoritma <span className="text-white font-bold">Priority V2</span> yang meningkatkan peluang diterima oleh tim support WhatsApp hingga 85%.
                     </p>
                  </div>
               </Card>

               <div className="grid grid-cols-1 gap-4">
                  <h4 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                     <Zap className="w-4 h-4 text-brand-purple" /> Tips Unband
                  </h4>
                  {[
                    "Gunakan email yang belum pernah dipakai banding.",
                    "Kirim email di jam kerja (09:00 - 17:00).",
                    "Jangan gunakan IP/VPN yang sama saat mengirim."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="w-2 h-2 rounded-full bg-brand-purple" />
                       <p className="text-xs font-bold italic text-slate-300">{tip}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="limit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
             <Card className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                   <Zap className="w-8 h-8 text-brand-blue" />
                   <h3 className="text-xl font-black italic uppercase">Master <span className="text-brand-blue">Tutor Limit</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {scripts.filter(s => s.cat === 'limit').map((s, i) => (
                     <Card key={i} className="p-5 border-white/10 hover:border-brand-blue/30 bg-white/[0.02] transition-all group cursor-pointer">
                        <div className="space-y-4">
                           <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                              <Zap className="w-6 h-6" />
                           </div>
                           <div className="space-y-1">
                              <h5 className="font-black italic uppercase text-lg">{s.title}</h5>
                              <p className="text-xs text-slate-500 italic leading-relaxed">{s.detail}</p>
                           </div>
                           <button className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                              Baca Tutorial <ArrowRight className="w-3 h-3" />
                           </button>
                        </div>
                     </Card>
                   ))}
                </div>
             </Card>

             <Card className="bg-brand-blue/5 border-brand-blue/20">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center text-brand-blue">
                         <ListCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-black italic uppercase">Checklist Aman</h4>
                   </div>
                   <div className="space-y-4">
                      {[
                        { title: "Warp 1.1.1.1", status: "WAJIB" },
                        { title: "Proxy V2L", status: "PREMIUM" },
                        { title: "Delay 5s", status: "SAFE" },
                        { title: "Daily Limit", status: "200 MSG" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[10px] font-bold text-slate-400 italic uppercase">{item.title}</span>
                           <Badge variant={item.status === 'WAJIB' ? 'sakura' : 'premium'}>{item.status}</Badge>
                        </div>
                      ))}
                   </div>
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
