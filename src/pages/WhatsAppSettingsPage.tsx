import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Phone, CheckCircle2, XCircle, RefreshCw, LogOut, Smartphone, MessageSquare, Play, List, Send, Target, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsAppSettingsPage: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Blast State
  const [blastNumbers, setBlastNumbers] = useState('');
  const [blastMessage, setBlastMessage] = useState('Halo! Ini adalah pesan tes dari Kyzzyy WA Gateway.');
  const [progress, setProgress] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/wa/status');
      const data = await res.json();
      setStatus(data.status);

      // Also fetch blast status if running
      const blastRes = await fetch('/api/wa/blast-status');
      const blastData = await blastRes.json();
      if (blastData.status === 'running' || blastData.status === 'completed') {
        setProgress(blastData);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    } finally {
      setChecking(false);
    }
  };

  const startBlast = async () => {
    if (status !== 'connected') {
      toast.error('WhatsApp belum terhubung!');
      return;
    }

    const numbers = blastNumbers.split('\n').map(n => n.trim()).filter(n => n !== '');
    if (numbers.length === 0) {
      toast.error('Masukkan minimal 1 nomor tujuan');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/wa/start-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers, message: blastMessage })
      });
      const data = await res.json();
      if (data.status === 'started') {
        toast.success('Blast dimulai di latar belakang!');
        setProgress({ status: 'running', current: 0, total: numbers.length, successCount: 0, failCount: 0 });
      } else {
        toast.error(data.error || 'Gagal memulai blast');
      }
    } catch (err) {
      toast.error('Kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetPairingCode = async () => {
    if (!phoneNumber) {
      toast.error('Masukkan nomor WhatsApp terlebih dahulu');
      return;
    }

    setLoading(true);
    setPairingCode(null);

    try {
      const res = await fetch('/api/wa/pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();

      if (data.code) {
        setPairingCode(data.code);
        toast.success('Kode pairing berhasil didapatkan!');
      } else {
        toast.error(data.error || 'Gagal mendapatkan kode pairing');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin logout dari WhatsApp?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/wa/logout', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Logout berhasil');
        setStatus('disconnected');
        setPairingCode(null);
      }
    } catch (err) {
      toast.error('Gagal logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-brand-purple uppercase tracking-[0.3em] italic">Infrastructure Settings</p>
          <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic">
            WA <span className="text-white/20">Gate</span>way
          </h1>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
          status === 'connected' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          status === 'connecting' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
          "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === 'connected' ? "bg-emerald-500 animate-pulse" :
            status === 'connecting' ? "bg-amber-500 animate-bounce" :
            "bg-red-500"
          )} />
          {status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Card */}
        <Card className="p-8 border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black italic tracking-tight uppercase">Device Status</h3>
                <p className="text-xs text-slate-500 font-medium font-mono uppercase">WhatsApp Baileys v2.0</p>
              </div>
            </div>

            <div className="p-6 bg-brand-black/40 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connection Health</p>
                  <p className="text-sm font-bold text-white">
                    {status === 'connected' ? 'Sistem Aktif & Terhubung' : 
                     status === 'connecting' ? 'Sedang Menyambungkan...' : 
                     'Offline / Belum Terhubung'}
                  </p>
                </div>
                {status === 'connected' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Integrasi Gateway</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center space-y-1">
                <p className="text-2xl font-black italic text-brand-purple">OTP</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enabled</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center space-y-1">
                <p className="text-2xl font-black italic text-brand-purple">Blast</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Wait-List</p>
              </div>
            </div>
          </div>

          {status === 'connected' && (
            <Button 
              onClick={handleLogout} 
              variant="danger" 
              className="w-full h-14 rounded-[1.5rem] text-xs font-black uppercase tracking-widest gap-2"
              disabled={loading}
            >
              <LogOut className="w-4 h-4" /> Keluar dari Sesi
            </Button>
          )}
        </Card>

        {/* Pairing Card */}
        <AnimatePresence mode="wait">
          {status !== 'connected' ? (
            <motion.div
              key="pairing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 border-brand-purple/20 bg-brand-purple/[0.02] backdrop-blur-3xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic tracking-tight uppercase">Pairing Code</h3>
                      <p className="text-xs text-slate-500 font-medium font-mono uppercase">Connect via OTP code</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      label="Nomor WhatsApp" 
                      placeholder="628xxxxxxxxxx" 
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      icon={<Phone className="w-5 h-5 text-brand-purple" />}
                      disabled={loading || status === 'connecting'}
                    />
                    <Button 
                      onClick={handleGetPairingCode}
                      className="w-full h-14 rounded-2xl uppercase font-black italic tracking-widest gap-2"
                      disabled={loading || status === 'connecting'}
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Dapatkan Kode'}
                    </Button>
                  </div>
                </div>

                {pairingCode && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 bg-brand-black/60 rounded-[2rem] border-2 border-brand-purple/30 text-center space-y-6 relative"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest">KODE PAIRING ANDA</p>
                      <div className="flex items-center justify-center gap-2">
                        {pairingCode.split('').map((char, i) => (
                          <div key={i} className="w-10 h-14 bg-white/5 rounded-xl flex items-center justify-center text-3xl font-black italic border border-white/10 text-white shadow-xl">
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">
                        Buka WhatsApp {'>'} Linked Devices {'>'} Link with Phone Number {'>'} Masukkan Kode Di Atas
                      </p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <Card className="h-full p-8 border-emerald-500/20 bg-emerald-500/[0.01] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                  <CheckCircle2 className="w-16 h-16 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font font-black italic tracking-tighter uppercase">Gateway Aktif</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">
                    WhatsApp Anda sudah terhubung dengan server Kyzzyy. Semua notifikasi dan OTP akan dikirim melalui nomor ini.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blast Tester Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="p-8 border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black italic tracking-tight uppercase">Blast Tester</h3>
                <p className="text-xs text-slate-500 font-medium font-mono uppercase">Warm up & verification tool</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Daftar Nomor (1 per baris)</label>
                <textarea 
                  value={blastNumbers}
                  onChange={(e) => setBlastNumbers(e.target.value)}
                  placeholder="628xxxxxx&#10;628xxxxxx"
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-mono focus:border-brand-purple/50 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Pesan Blast</label>
                <Input 
                  value={blastMessage}
                  onChange={setBlastMessage}
                  placeholder="Masukkan pesan..."
                  icon={<MessageSquare className="w-5 h-5 text-brand-purple" />}
                />
              </div>

              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                <p className="text-[10px] text-orange-200/60 font-medium leading-relaxed">
                  <span className="text-orange-500 font-bold">WARNING:</span> Gunakan dengan bijak. Jeda otomatis 3-7 detik telah diterapkan untuk mengurangi risiko deteksi spam. Disarankan tidak melebihi 20 nomor per sesi.
                </p>
              </div>

              <Button 
                onClick={startBlast}
                disabled={loading || status !== 'connected' || progress?.status === 'running'}
                className="w-full h-14 rounded-2xl uppercase font-black tracking-widest gap-2 bg-orange-500 hover:bg-orange-600 border-none"
              >
                <Play className="w-4 h-4 fill-current" /> {progress?.status === 'running' ? 'BLASTING...' : 'START BLAST NOW'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress Card */}
        <Card className="p-8 border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center justify-center text-center space-y-6">
          {!progress ? (
            <div className="space-y-4 opacity-30">
               <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto">
                 <Target className="w-10 h-10" />
               </div>
               <p className="text-sm font-black uppercase italic text-slate-500 tracking-tighter">No Active Blast Progress</p>
            </div>
          ) : (
            <div className="w-full space-y-8">
              <div className="relative">
                <svg className="w-48 h-48 mx-auto -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={502.4}
                    strokeDashoffset={502.4 - (502.4 * (progress.current / progress.total))}
                    className="text-brand-purple transition-all duration-500 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-black italic">{Math.round((progress.current / progress.total) * 100)}%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{progress.current} / {progress.total}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <p className="text-2xl font-black text-emerald-500">{progress.successCount}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Berhasil</p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-2xl font-black text-red-500">{progress.failCount}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gagal</p>
                </div>
              </div>

              {progress.lastNumber && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Activity</p>
                  <p className="text-xs font-mono text-brand-purple truncate">Sending to: {progress.lastNumber}</p>
                </div>
              )}

              {progress.status === 'completed' && (
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-black uppercase text-xs italic tracking-widest animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Blast Completed
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
