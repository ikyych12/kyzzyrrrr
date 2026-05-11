import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Bug, Lightbulb, Send, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../utils/helpers';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Pesan tidak boleh kosong!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          username: user?.username
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setMessage('');
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        toast.error('Gagal mengirim feedback');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg bg-brand-gray border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Feedback Terkirim!</h3>
                  <p className="text-slate-400 text-sm">Terima kasih atas dukungannya. Kami akan segera membacanya.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">Feedback System</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Kirim saran atau laporkan bug</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Kategori</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'bug', label: 'Bug', icon: Bug, color: 'text-red-400' },
                      { id: 'suggestion', label: 'Saran', icon: Lightbulb, color: 'text-brand-purple' },
                      { id: 'other', label: 'Lainnya', icon: MessageSquare, color: 'text-slate-400' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-3xl border transition-all gap-2",
                          type === item.id 
                            ? "bg-white/5 border-brand-purple shadow-lg" 
                            : "bg-transparent border-white/5 opacity-50 hover:opacity-100"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", item.color)} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Pesan</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan di sini detailnya..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-brand-purple transition-all resize-none placeholder:text-slate-600"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl gap-3 text-lg font-bold" 
                  disabled={isSubmitting}
                >
                  <Send className="w-5 h-5" /> {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
