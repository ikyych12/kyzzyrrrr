import React, { useState } from 'react';
import { Card, Badge, Button, Input } from '../components/UI';
import { Shield, Users, Crown, Search, Trash2, ShieldCheck, ShieldX, Info, Phone, Calendar, User, Eye, X, Send, Gift, Activity, Ban, Unlock, Cpu } from 'lucide-react';
import { storage, calculateExpiry, formatRemainingTime, cn } from '../utils/helpers';
import { User as UserType, PremiumType } from '../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const AdminPanelPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>(storage.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [appSettings, setAppSettings] = useState(storage.getSettings());
  const { refreshUser } = useAuth();
  
  const handleUpdateSettings = (newSettings: any) => {
    storage.setSettings(newSettings);
    setAppSettings(newSettings);
    toast.success('Pengaturan Global diperbarui!');
  };

  const activePremium = users.filter(u => u.premiumType !== null).length;
  const totalBanned = users.filter(u => u.isBanned).length;
  const totalReferrals = users.reduce((acc, curr) => acc + (curr.referralCount || 0), 0);

  const handleRemovePremium = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, premiumType: null, premiumExpired: null };
      }
      return u;
    });
    storage.setUsers(updatedUsers);
    setUsers(updatedUsers);
    refreshUser();
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, premiumType: null, premiumExpired: null });
    }
    toast.success('Status premium dihapus');
  };

  const handleSetPremium = (userId: string, type: '1d' | '7d' | 'permanent') => {
    const expiry = calculateExpiry(type as PremiumType);

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          premiumType: type as any, 
          premiumExpired: expiry 
        };
      }
      return u;
    });

    storage.setUsers(updatedUsers);
    
    // Referral Bonus Logic: Reward the referrer if someone becomes premium
    let finalUsers = updatedUsers;
    const affectedUser = updatedUsers.find(u => u.id === userId);
    if (affectedUser?.referredBy) {
      const referrer = updatedUsers.find(u => u.referralCode === affectedUser.referredBy);
      if (referrer && referrer.premiumType !== 'permanent') {
        const bonusDuration = 60 * 60 * 1000; // 1 hour
        const now = Date.now();
        let newExpiry = now + bonusDuration;
        if (referrer.premiumExpired && referrer.premiumExpired > now) {
          newExpiry = referrer.premiumExpired + bonusDuration;
        }
        finalUsers = updatedUsers.map(u => {
          if (u.id === referrer.id) {
            return { ...u, premiumType: '1d' as any, premiumExpired: newExpiry };
          }
          return u;
        });
        storage.setUsers(finalUsers);
      }
    }

    setUsers(finalUsers);
    refreshUser();
    
    const upUser = finalUsers.find(u => u.id === userId);
    if (upUser && selectedUser?.id === userId) {
      setSelectedUser(upUser);
    }
    
    toast.success(`Berhasil set premium ${type}`);
  };

  const handleToggleBan = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, isBanned: !u.isBanned };
      }
      return u;
    });
    storage.setUsers(updatedUsers);
    setUsers(updatedUsers);
    refreshUser();
    
    const upUser = updatedUsers.find(u => u.id === userId);
    if (upUser && selectedUser?.id === userId) {
      setSelectedUser(upUser);
    }
    
    toast.success(upUser?.isBanned ? 'User dibanned!' : 'User diunbanned!');
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nomor.includes(searchTerm)
  ).filter(u => u.username !== 'ikyy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h2 className="text-3xl font-display font-black tracking-tighter flex items-center gap-2">
          <Shield className="w-8 h-8 text-brand-purple" /> Admin Terminal
        </h2>
        <p className="text-slate-400">Pusat kendali akun dan manajemen lisensi premium Kyzzyy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-5 p-6 bg-brand-purple/5 border-brand-purple/10">
          <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center text-brand-purple">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total User</p>
            <p className="text-2xl font-display font-black italic">{users.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-5 p-6 bg-brand-gold/5 border-brand-gold/10">
          <div className="w-12 h-12 bg-brand-gold/20 rounded-xl flex items-center justify-center text-brand-gold">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium</p>
            <p className="text-2xl font-display font-black italic text-brand-gold">{activePremium}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-5 p-6 bg-red-500/5 border-red-500/10">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Banned</p>
            <p className="text-2xl font-display font-black italic text-red-400">{totalBanned}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-5 p-6 bg-emerald-500/5 border-emerald-500/10">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Referrals</p>
            <p className="text-2xl font-display font-black italic text-emerald-400">{totalReferrals}</p>
          </div>
        </Card>
      </div>

      <Card className="p-8 space-y-6 relative overflow-hidden border-brand-purple/20 bg-brand-purple/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
               <Cpu className="w-5 h-5 text-brand-purple" /> Fitur Web to APK
             </h3>
             <p className="text-xs text-slate-400 font-medium">Atur siapa saja yang diizinkan mengakses alat konversi APK.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'admin', label: 'Hanya Admin', color: 'text-red-400' },
              { id: 'premium', label: 'Premium & Admin', color: 'text-brand-gold' },
              { id: 'all', label: 'Semua User', color: 'text-emerald-400' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleUpdateSettings({ ...appSettings, webToApkAccess: opt.id })}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  appSettings.webToApkAccess === opt.id 
                    ? "bg-brand-purple text-white border-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                    : "bg-white/5 text-slate-500 border-white/10 hover:border-white/20"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" /> Manajemen User
          </h3>
          <div className="w-full md:w-80">
            <Input
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari username atau nomor..."
              icon={<Search className="w-5 h-5 text-slate-500" />}
              className="w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <th className="px-6 py-4">User Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Sisa Waktu</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{user.username} {user.isBanned && <span className="ml-1 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded italic">BANNED</span>}</p>
                        <p className="text-[10px] font-mono text-slate-500 italic">{user.ipAddress || 'No IP'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {user.premiumType ? (
                        <Badge variant="premium">{user.premiumType}</Badge>
                      ) : (
                        <Badge variant="free">FREE</Badge>
                      )}
                      <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1"><Gift className="w-2 h-2" /> {user.referralCount || 0} Ref</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                       <p className="text-xs font-bold text-slate-200">{user.badakCount || 0}</p>
                       <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Messages</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-400 italic">
                      {formatRemainingTime(user.premiumExpired)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-500 italic">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button 
                         onClick={() => handleToggleBan(user.id)}
                         className={`p-2.5 rounded-xl transition-all ${user.isBanned ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                         title={user.isBanned ? 'Unlock' : 'Ban'}
                      >
                        {user.isBanned ? <Unlock className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>

                      {user.premiumType ? (
                        <button 
                          onClick={() => handleRemovePremium(user.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                          title="Hapus Premium"
                        >
                          <ShieldX className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex gap-1">
                          {(['1d', '7d', 'permanent'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => handleSetPremium(user.id, type)}
                              className="px-3 py-1.5 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                            >
                              {type === 'permanent' ? 'Perm' : type}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center text-slate-600">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium tracking-tight italic">Tidak ada user ditemukan...</p>
            </div>
          )}
        </div>
      </Card>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-lg bg-brand-gray border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden"
             >
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/10 blur-[80px] rounded-full" />
                
                <div className="flex justify-between items-center relative z-10">
                   <h3 className="text-2xl font-black font-display tracking-tighter">USER DETAILS</h3>
                   <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X className="w-7 h-7" /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                   <div className="space-y-4">
                      <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] border-2 border-white/5 overflow-hidden mx-auto sm:mx-0 shadow-2xl">
                         {selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-700 m-8" />}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                         <h4 className="text-2xl font-black italic uppercase leading-none">{selectedUser.username}</h4>
                         <Badge variant={selectedUser.premiumType ? 'premium' : 'free'}>
                           {selectedUser.premiumType || 'FREE USER'}
                         </Badge>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Nomor WA</p>
                         <p className="font-bold text-slate-200">{selectedUser.nomor}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Tanggal Join</p>
                         <p className="font-bold text-slate-200">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString('id-ID') : 'Tidak Terdata'}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3" /> Last Login</p>
                         <p className="font-bold text-brand-purple italic">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('id-ID') : 'Never'}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Crown className="w-3 h-3" /> Lisensi Exp</p>
                         <p className="font-bold text-brand-gold italic">{formatRemainingTime(selectedUser.premiumExpired)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Send className="w-3 h-3" /> Telegram ID</p>
                         <p className="font-bold text-slate-200">{selectedUser.telegramId || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3" /> IP Address</p>
                         <p className="font-mono text-xs text-brand-purple italic">{selectedUser.ipAddress || 'Not Recorded'}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Gift className="w-3 h-3" /> Referral Code</p>
                         <p className="font-bold text-slate-200">{selectedUser.referralCode} <span className="text-[10px] text-slate-500">({selectedUser.referralCount || 0} Successful)</span></p>
                      </div>
                      {selectedUser.referredBy && (
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">🔗 Referred By</p>
                           <p className="font-bold text-slate-200">{selectedUser.referredBy}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Info className="w-3 h-3" /> Unique Hash</p>
                         <p className="font-mono text-[9px] text-slate-500 break-all">{selectedUser.id}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Send className="w-3 h-3" /> Total Badak Usage</p>
                         <p className="font-bold text-slate-200">{selectedUser.badakCount || 0} Messages Sent</p>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex gap-3 relative z-10">
                   {selectedUser.premiumType ? (
                     <Button variant="danger" className="flex-1 h-12 text-sm" onClick={() => handleRemovePremium(selectedUser.id)}>
                        Reset Member To Free
                     </Button>
                   ) : (
                     <div className="flex-1 flex gap-2">
                        {(['1d', '7d', 'permanent'] as const).map(type => (
                           <Button key={type} className="flex-1 h-12 text-[10px] p-0" variant={type === 'permanent' ? 'primary' : 'outline'} onClick={() => handleSetPremium(selectedUser.id, type as any)}>
                              {type.toUpperCase()}
                           </Button>
                        ))}
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-brand-purple/5 border border-brand-purple/10 rounded-[2rem] flex items-start gap-4">
        <div className="p-3 bg-brand-purple/20 rounded-2xl text-brand-purple">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-slate-200">Tips Administrator</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gunakan fitur pencarian untuk menemukan user dengan cepat. Member Premium permanen tidak akan pernah kadaluarsa kecuali Anda meresetnya secara manual.
          </p>
        </div>
      </div>
    </div>
  );
};
