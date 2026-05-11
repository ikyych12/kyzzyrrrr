import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { MessageSquare, Send, Heart, AlertCircle, Sparkles, Terminal, Mail, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [type, setType] = useState<'feedback' | 'bug' | 'suggestion'>('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Harap isi semua field!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          username: user?.username,
          type,
          subject,
          message,
          timestamp: new Date().toISOString()
        })
      });

      if (res.ok) {
        toast.success('Pesan Anda telah terkirim! Terima kasih.');
        setSubject('');
        setMessage('');
      } else {
        toast.error('Gagal mengirim pesan.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-brand-purple" /> Support & <span className="text-brand-purple">Feedback</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium italic">Bantu kami meningkatkan Kyzzyy Panel dengan masukan Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="space-y-8 h-fit">
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Kategori Masukan</label>
             <div className="grid grid-cols-3 gap-3">
                {(['feedback', 'bug', 'suggestion'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${
                      type === t 
                        ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-brand-purple/50'
                    }`}
                  >
                    {t === 'feedback' && <Heart className="w-4 h-4" />}
                    {t === 'bug' && <AlertCircle className="w-4 h-4" />}
                    {t === 'suggestion' && <Sparkles className="w-4 h-4" />}
                    {t}
                  </button>
                ))}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Subjek" 
              value={subject} 
              onChange={setSubject} 
              placeholder="Contoh: Bug di halaman Badak WA" 
              icon={<Info className="w-5 h-5" />}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Pesan / Detail</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan masukan atau laporan bug Anda di sini..."
                className="w-full h-40 bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-purple/[0.02] transition-all placeholder:text-slate-600 font-medium resize-none"
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-14" 
              loading={isSubmitting}
            >
              <Send className="w-5 h-5" /> Kirim Sekarang
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900/20 to-brand-purple/10 border-brand-purple/20 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple">
                   <Mail className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold uppercase tracking-tight">Direct Support</h4>
                   <p className="text-xs text-slate-400">Hubungi developer langsung via Telegram.</p>
                </div>
             </div>
             <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => window.open('https://t.me/kyzzynew', '_blank')}>
                   @kyzzynew (Developer)
                </Button>
             </div>
          </Card>

          <Card className="bg-white/5 border-white/10 space-y-4">
             <h4 className="font-black italic uppercase text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-purple" /> Kenapa Masukan Anda Penting?
             </h4>
             <ul className="space-y-3">
                {[
                  'Bantu kami menemukan bug yang terlewat.',
                  'Usulan fitur baru akan kami pertimbangkan untuk update V3.',
                  'Masukan Anda membantu kami membuat UI yang lebih nyaman.',
                  'Setiap laporan bug yang valid akan mendapatkan apresiasi khusus.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-xs text-slate-400 italic">
                     <span className="text-brand-purple font-black">»</span>
                     {item}
                  </li>
                ))}
             </ul>
          </Card>

          <Card className="bg-black/40 border-white/5 flex items-center justify-between p-6">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Time</p>
                <p className="text-lg font-bold italic tracking-tighter">~ 1-3 Jam <span className="text-[10px] text-emerald-500 font-bold ml-1 uppercase">(Fast)</span></p>
             </div>
             <Badge variant="premium">24/7 ACTIVE</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
};
