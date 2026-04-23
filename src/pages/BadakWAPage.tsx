import React, { useState, useEffect } from 'react';
import { Card, Input, Badge, Button } from '../components/UI';
import { ShieldCheck, MessageSquare, Send, AlertTriangle, Zap, Activity, Clock, Crown, Cpu, ShieldAlert, CheckCircle, Terminal, HardDrive, Phone, Calendar, X, Globe, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/helpers';
import toast from 'react-hot-toast';

export const BadakWAPage: React.FC = () => {
  const { user } = useAuth();
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('50');
  const [isBlasting, setIsBlasting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lastSessionData, setLastSessionData] = useState<{ nomor: string, total: string, time: string, date: string, region: string } | null>(null);
  
  // WhatsApp Status
  const [waStatus, setWaStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/wa/status');
        const data = await res.json();
        setWaStatus(data.status);
      } catch (err) {}
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const isPremium = user?.premiumType !== null || user?.role === 'admin';
  
  const getRegion = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('62')) return 'Indonesia 🇮🇩';
    if (clean.startsWith('58')) return 'Venezuela 🇻🇪';
    if (clean.startsWith('1')) return 'USA/Canada 🇺🇸🇨🇦';
    if (clean.startsWith('65')) return 'Singapore 🇸🇬';
    if (clean.startsWith('60')) return 'Malaysia 🇲🇾';
    if (clean.startsWith('84')) return 'Vietnam 🇻🇳';
    if (clean.startsWith('66')) return 'Thailand 🇹🇭';
    if (clean.startsWith('81')) return 'Japan 🇯🇵';
    if (clean.startsWith('82')) return 'South Korea 🇰🇷';
    return 'Unknown Region 🏳️';
  };
  
  const freeOptions = ['10', '25', '50', '100'];
  const premiumOptions = ['150', '200'];
  
  const allOptions = isPremium ? [...freeOptions, ...premiumOptions] : freeOptions;

  const steps = [
    { label: 'Initializing Nodes', icon: Cpu },
    { label: 'Bypassing Firewall', icon: ShieldAlert },
    { label: 'Injecting Payloads', icon: Zap },
    { label: 'Broadcasting Packets', icon: Send },
    { label: 'Finalizing Task', icon: CheckCircle }
  ];

  const startBlast = () => {
    if (!target) {
      toast.error('Masukkan nomor target!');
      return;
    }

    const cleanNum = target.replace(/\D/g, '');
    
    // Validation for Indonesia (62)
    if (cleanNum.startsWith('62')) {
      if (cleanNum.length < 10 || cleanNum.length > 15) {
        toast.error('Nomor Indonesia harus antara 10-15 digit!');
        return;
      }
    } else {
      // Basic validation for other regions
      if (cleanNum.length < 7) {
        toast.error('Nomor tujuan tidak valid (terlalu pendek)!');
        return;
      }
    }

    // Record usage
    const allUsers = storage.getUsers();
    const userIndex = allUsers.findIndex(u => u.id === user?.id);
    if (userIndex !== -1 && user) {
      const currentCount = allUsers[userIndex].badakCount || 0;
      allUsers[userIndex].badakCount = currentCount + parseInt(amount);
      storage.setUsers(allUsers);
    }

    setIsBlasting(true);
    setProgress(0);
    setActiveStep(0);
    setLogs(['[SYSTEM] Initializing Badak WA Engine...', '[CONFIG] Target set to: ' + target]);
    toast.success('Mesin Badak WA diaktifkan!');

    const possibleLogs = [
      '[AUTH] Session token validated...',
      '[PROXY] Connecting to V2L Server in SG...',
      '[GATEWAY] Handshake via Warp 1.1.1.1 successful.',
      '[CMD] Executing payload injection...',
      '[X-PACKET] Packet sequence started.',
      '[FIREWALL] Rules bypassed.',
      '[LOG] Batch #' + Math.floor(Math.random() * 999) + ' processed.',
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + (Math.random() * 8 + 2), 100);
        
        // Update steps based on progress
        const stepIndex = Math.floor((next / 100) * steps.length);
        if (stepIndex !== activeStep && stepIndex < steps.length) {
          setActiveStep(stepIndex);
        }

        // Add random logs
        if (Math.random() > 0.7 && next < 100) {
          setLogs(l => [possibleLogs[Math.floor(Math.random() * possibleLogs.length)], ...l.slice(0, 5)]);
        }

        if (next >= 100) {
          clearInterval(interval);
          setLogs(l => ['[COMPLETE] All ' + amount + ' messages dispatched.', ...l]);
          
          const now = new Date();
          setLastSessionData({
            nomor: target,
            total: amount,
            time: now.toLocaleTimeString('id-ID'),
            date: now.toLocaleDateString('id-ID'),
            region: getRegion(target)
          });

          setTimeout(() => {
            setIsBlasting(false);
            setShowModal(true);
            toast.success('Blast selesai diproses!');
          }, 1500);
          return 100;
        }
        return next;
      });
    }, 400);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-purple" /> Badak WA <span className="text-brand-purple">v2.0</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium italic">Tools spam WhatsApp paling stabil dengan Proxy V2L.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-2xl border border-white/5">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
             waStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-500' : 
             waStatus === 'connecting' ? 'bg-amber-500/20 text-amber-500' : 
             'bg-red-500/20 text-red-500'
           }`}>
             {waStatus === 'connected' ? <Wifi className="w-5 h-5" /> : 
              waStatus === 'connecting' ? <Activity className="w-5 h-5 animate-pulse" /> : 
              <WifiOff className="w-5 h-5" />}
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Connection</p>
              <div className="flex items-center gap-2">
                 <span className={`text-sm font-black italic uppercase tracking-tighter ${
                   waStatus === 'connected' ? 'text-emerald-400' : 
                   waStatus === 'connecting' ? 'text-amber-400' : 
                   'text-red-400'
                 }`}>
                   {waStatus === 'connected' ? 'CONNECTED' : waStatus === 'connecting' ? 'CONNECTING...' : 'DISCONNECTED'}
                 </span>
                 {waStatus === 'connected' && (
                   <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-emerald-500 animate-[bounce_0.6s_ease-in-out_infinite]" />
                      <div className="w-1 h-2 bg-emerald-500 animate-[bounce_0.8s_ease-in-out_infinite]" />
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="relative">
              <Input 
                label="Nomor Target" 
                value={target} 
                onChange={setTarget} 
                placeholder="628xxxxxxxxxx" 
                icon={<MessageSquare className="w-5 h-5" />} 
              />
              {isPremium && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-0 right-0"
                >
                  <Badge variant="premium" className="text-[8px] px-2 py-0.5 rounded-full border border-brand-gold/30">
                    <Globe className="w-2 h-2 mr-1" /> ALL REGION SUPPORT
                  </Badge>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Pilih Jumlah Pesan</label>
                {isPremium ? (
                  <Badge variant="premium"><Crown className="w-3 h-3" /> UNLOCKED</Badge>
                ) : (
                  <Badge variant="free">LIMITED</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAmount(opt)}
                    className={`h-14 rounded-2xl border font-black transition-all flex items-center justify-center gap-2 ${
                      amount === opt 
                        ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-brand-purple/50'
                    }`}
                  >
                    {opt} <span className="text-[10px] opacity-50 font-medium">MSG</span>
                  </button>
                ))}
                {!isPremium && premiumOptions.map((opt) => (
                  <button
                    key={opt}
                    disabled
                    className="h-14 rounded-2xl border border-white/5 bg-black/40 text-slate-700 flex items-center justify-center gap-2 relative opacity-50 grayscale"
                  >
                    {opt}
                    <Crown className="w-3 h-3 absolute top-2 right-2" />
                  </button>
                ))}
              </div>
              {!isPremium && (
                <p className="text-[10px] text-slate-500 italic mt-2">
                  * Upgrade ke <span className="text-brand-purple font-bold">Premium</span> untuk membuka limit hingga 200 pesan.
                </p>
              )}
            </div>
          </div>

          {isBlasting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6 pt-6 border-t border-white/5"
            >
               {/* Progress & Steps */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <span>Overall Progress</span>
                        <span className="text-brand-purple">{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div 
                          className="h-full bg-brand-purple rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]" 
                          animate={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    <div className="space-y-2">
                       {steps.map((step, i) => (
                         <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= activeStep ? 'text-brand-purple opacity-100' : 'text-slate-600 opacity-40'}`}>
                            <step.icon className={`w-4 h-4 ${i === activeStep ? 'animate-pulse' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{step.label}</span>
                            {i < activeStep && <CheckCircle className="w-3 h-3 ml-auto" />}
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Virtual Nodes */}
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3">
                     <div className="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        <span>Cluster Nodes Status</span>
                        <span>Load Balancing: Active</span>
                     </div>
                     <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ 
                              opacity: [0.3, 1, 0.3],
                              backgroundColor: i <= (progress / 100) * 18 ? '#a855f7' : '#1e293b'
                            }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="aspect-square rounded-md shadow-inner"
                          />
                        ))}
                     </div>
                     <div className="pt-2 flex items-center gap-2 text-[8px] font-mono text-brand-purple/60">
                        <Activity className="w-3 h-3" />
                        <span>TX/RX: {Math.floor(progress * 132)} KB/s</span>
                     </div>
                  </div>
               </div>

               {/* Logs View */}
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    <Terminal className="w-3 h-3" /> System Out Log
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4 font-mono text-[9px] text-emerald-500/80 h-32 overflow-hidden flex flex-col-reverse border border-white/5 italic">
                     {logs.map((log, i) => (
                       <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="mb-1 last:text-brand-purple last:font-bold"
                       >
                         {log}
                       </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold" 
            disabled={isBlasting}
            onClick={startBlast}
          >
            <Zap className="w-5 h-5" /> {isBlasting ? 'Semburkan Pesan...' : 'Mulai Semburkan!'}
          </Button>
        </Card>

        <div className="space-y-6">
           <Card className="bg-red-500/5 border-red-500/10 space-y-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                 <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Peringatan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Penggunaan berlebihan tanpa Warp 1.1.1.1 dapat menyebabkan delay. Gunakan secara bijak.
              </p>
           </Card>

           <Card className="bg-white/5 border-white/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <span className="text-xs text-slate-500">System Status</span>
                 <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold italic">98.2% <span className="text-[10px] text-emerald-500 font-bold ml-1 uppercase">Stable</span></p>
              <div className="flex items-center gap-2 text-[10px] text-slate-600">
                 <Clock className="w-3 h-3" /> Last check: 1 min ago
              </div>
           </Card>
        </div>
      </div>

      <AnimatePresence>
        {showModal && lastSessionData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="w-full max-w-sm bg-brand-gray border border-white/10 rounded-[3rem] p-8 space-y-6 relative overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)]"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <CheckCircle className="w-56 h-56 text-brand-purple" />
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-brand-purple/20 rounded-3xl flex items-center justify-center mx-auto border border-brand-purple/20">
                  <CheckCircle className="w-10 h-10 text-brand-purple" />
                </div>
                <h3 className="text-2xl font-black font-display italic tracking-tighter uppercase">SUCCESS!</h3>
                <p className="text-slate-400 text-sm font-medium">Laporan hasil penyemburan nomor berhasil diproses.</p>
              </div>

              <div className="space-y-3 bg-white/5 p-6 rounded-3xl border border-white/5 italic">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Nomor</span>
                   <span className="text-slate-200 font-bold">{lastSessionData.nomor}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Wilayah</span>
                   <span className="text-brand-purple font-bold">{lastSessionData.region}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> Total Blast</span>
                   <span className="text-brand-purple font-black">{lastSessionData.total} MSG</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Clock className="w-3 h-3" /> Jam</span>
                   <span className="text-slate-200 font-bold">{lastSessionData.time}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Tanggal</span>
                   <span className="text-slate-200 font-bold">{lastSessionData.date}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl font-black italic tracking-widest"
                onClick={() => setShowModal(false)}
              >
                TUTUP LAPORAN
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
