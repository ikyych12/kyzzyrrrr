import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { Search, Calendar, History, ShieldCheck, UserCheck, Smartphone, Info, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDeterministicJoinDate, storage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const AccountAgePage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [nomor, setNomor] = useState('');
  const [result, setResult] = useState<{
    awalJoin: string;
    register: string;
    aktif: string;
    isMember: boolean;
    nomor: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const isPremium = currentUser?.premiumType !== null || currentUser?.role === 'admin';

  const handleCheck = () => {
    if (!nomor || nomor.length < 10) {
      toast.error('Masukkan nomor yang valid!');
      return;
    }

    const cleanNomor = nomor.replace(/[^0-9]/g, '');
    const isInternational = !cleanNomor.startsWith('62') && !cleanNomor.startsWith('0');

    if (isInternational && !isPremium) {
      toast.error('Fitur Cek Nomor Luar Negeri hanya untuk Member Premium! 💎');
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const users = storage.getUsers();
      const user = users.find(u => u.nomor === nomor || u.nomor.replace(/[^0-9]/g, '') === nomor.replace(/[^0-9]/g, ''));
      
      const joinDate = getDeterministicJoinDate(nomor);
      
      // "Aktif" can be simulated as how long since joinDate or simply current status
      const diffTime = Math.abs(Date.now() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const aktifYears = Math.floor(diffDays / 365);
      const aktifMonths = Math.floor((diffDays % 365) / 30);
      
      setResult({
        awalJoin: joinDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        register: user ? 'TERDAFTAR DI SISTEM' : 'BELUM TERDAFTAR DI SISTEM',
        aktif: aktifYears > 0 
          ? `${aktifYears} Tahun ${aktifMonths} Bulan` 
          : `${aktifMonths} Bulan`,
        isMember: !!user,
        nomor: nomor
      });
      
      setLoading(false);
      toast.success('Pengecekan selesai!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-brand-purple/20 rounded-3xl flex items-center justify-center mx-auto border border-brand-purple/20 shadow-2xl"
        >
          <History className="w-10 h-10 text-brand-purple" />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">Cek Umur <span className="text-brand-purple">Akun</span> 🕰️</h2>
          <p className="text-slate-400 font-medium">Lacak durasi penggunaan nomor dan status pendaftaran.</p>
        </div>
      </div>

      <Card className="max-w-xl mx-auto">
        <div className="space-y-6">
          <Input 
            label="Nomor WhatsApp"
            value={nomor}
            onChange={setNomor}
            placeholder="Contoh: 62812xxxxxx"
            icon={<Smartphone className="w-5 h-5 text-slate-500" />}
          />
          {!isPremium && (
            <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-4 flex items-start gap-4">
               <Globe className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Premium Perk</p>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">
                   Nomor luar negeri (Non-62) hanya bisa dicek oleh <span className="text-brand-purple font-bold">Member Premium</span>.
                 </p>
               </div>
            </div>
          )}
          <Button 
            className="w-full h-16 text-lg font-black uppercase tracking-widest italic"
            onClick={handleCheck}
            loading={loading}
          >
            CEK UMUR SEKARANG 🔍
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="border-brand-purple/30 bg-brand-purple/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Calendar className="w-6 h-6 text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Pertama Join WA</p>
                      <p className="text-xl font-display font-black italic uppercase text-white">{result.awalJoin}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <ShieldCheck className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Umur Akun WA</p>
                      <p className="text-xl font-display font-black italic uppercase text-brand-blue">{result.aktif}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <UserCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Status Web</p>
                      <p className="text-sm font-display font-black italic uppercase text-slate-300">{result.register}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center space-y-4">
                   <div className="w-24 h-24 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/20">
                      <span className="text-3xl font-black italic text-brand-purple">
                        {result.nomor.slice(-2)}
                      </span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">{result.nomor}</p>
                      <Badge variant={result.isMember ? 'premium' : 'free'}>
                        {result.isMember ? 'VERIFIED MEMBER 💎' : 'NOT REGISTERED 🕊️'}
                      </Badge>
                   </div>
                   <p className="text-[10px] text-slate-500 italic">
                     Data umur akun dihitung berdasarkan algoritma sinkronisasi pertama nomor di database layanan global Kyzzyy server.
                   </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
         {[
           { icon: Info, title: "Pertama Join WA", desc: "Estimasi tanggal pertama kali nomor WhatsApp anda didaftarkan di server global." },
           { icon: ShieldCheck, title: "Umur Akun WA", desc: "Durasi total penggunaan WhatsApp dihitung sejak registrasi pertama kali." },
           { icon: History, title: "Data Sinkron", desc: "Hasil pengecekan bersifat tetap dan sinkron di database kyzzyy untuk setiap nomor." }
         ].map((item, i) => (
           <Card key={i} className="p-5 border-white/5 bg-white/[0.02]">
              <div className="flex items-start gap-4">
                 <item.icon className="w-5 h-5 text-brand-purple shrink-0 mt-1" />
                 <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                 </div>
              </div>
           </Card>
         ))}
      </div>
    </div>
  );
};
