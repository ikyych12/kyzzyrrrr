import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Globe, Shield, Activity, RefreshCw, Copy, CheckCircle2, AlertTriangle, ExternalLink, Server, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export const DomainManagerPage: React.FC = () => {
  const [domain, setDomain] = useState('kyzzy.my.id');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const expectedIPs = ['216.239.32.21', '216.239.34.21', '216.239.36.21', '216.239.38.21'];
  const sharedUrl = 'ais-pre-id2qrlzvoxuletz6m3zvjz-54398651811.asia-southeast1.run.app';

  const checkDNS = async () => {
    if (!domain) {
      toast.error('Masukkan nama domain');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/domain/check?domain=${domain}`);
      const data = await res.json();
      setStatus(data);
      if (data.connected) {
        toast.success('Domain sudah terhubung dengan benar!');
      } else {
        toast.error('Domain belum mengarah ke server.');
      }
    } catch (err) {
      toast.error('Gagal mengecek status domain');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard!');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-brand-purple uppercase tracking-[0.3em] italic">Network Infrastructure</p>
        <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic">
          Domain <span className="text-white/20">Mana</span>ger
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
          Gunakan informasi di bawah ini untuk menghubungkan <span className="text-white font-bold">kyzzy.my.id</span> ke hosting Kyzzyy Store.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Card */}
        <Card className="lg:col-span-2 p-8 border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black italic tracking-tight uppercase">Status Koneksi</h3>
                <p className="text-xs text-slate-500 font-medium font-mono uppercase">DNS Verification Tool</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <Input 
                  label="Nama Domain Anda" 
                  placeholder="kyzzy.my.id" 
                  value={domain}
                  onChange={setDomain}
                  icon={<Globe className="w-5 h-5 text-brand-purple" />}
                />
              </div>
              <Button onClick={checkDNS} disabled={loading} className="h-14 rounded-2xl gap-2 font-black italic tracking-widest">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                CEK PROPAGASI
              </Button>
            </div>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-[2rem] border ${status.connected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hasil Resolusi DNS</p>
                    <p className={`text-xl font-black italic ${status.connected ? 'text-emerald-400' : 'text-red-400'}`}>
                      {status.connected ? 'DOMAIN AKTIF' : 'BELUM TERHUBUNG'}
                    </p>
                    <p className="text-xs font-mono text-slate-400 uppercase mt-1">
                      IP Terdeteksi: <span className="text-white font-bold">{status.ip || 'Tidak ada'}</span>
                    </p>
                  </div>
                  {status.connected ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : <AlertTriangle className="w-12 h-12 text-red-500" />}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
             <div className="flex items-center gap-2">
               <Server className="w-5 h-5 text-brand-purple" />
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail DNS Records (Input ke Cloudflare/Panel Domain)</h4>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { type: 'A', name: '@', value: '216.239.32.21', desc: 'Google Server IP 1' },
                 { type: 'A', name: '@', value: '216.239.34.21', desc: 'Google Server IP 2' },
                 { type: 'CNAME', name: 'www', value: 'ghs.googlehosted.com', desc: 'Default Redirect' },
                 { type: 'CNAME', name: 'panel', value: sharedUrl, desc: 'Optional: Subdomain Direct' }
               ].map((record, i) => (
                 <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3 group hover:border-brand-purple/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-brand-purple text-white text-[8px] font-black rounded italic">{record.type}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{record.desc}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3 bg-brand-black/40 rounded-xl border border-white/5">
                      <code className="text-[10px] font-mono text-brand-purple truncate">{record.value}</code>
                      <button onClick={() => copyToClipboard(record.value)} className="text-slate-500 hover:text-white transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </Card>

        {/* Instructions Card */}
        <div className="space-y-6">
          <Card className="p-8 border-brand-purple/20 bg-brand-purple/5 space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-brand-purple" />
              <h3 className="text-xl font-black italic tracking-tight uppercase">Tutorial Lengkap</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { step: 1, title: 'Buka DNS Management', text: 'Masuk ke provider domain Anda (Niagahoster/Rumahweb/Cloudflare).' },
                { step: 2, title: 'Hapus Record Lama', text: 'Hapus semua record A atau CNAME lama yang ada di domain tersebut.' },
                { step: 3, title: 'Tambah Record Baru', text: 'Tambahkan Record A dengan Name "@" dan Value "216.239.32.21". Ulangi untuk IP kedua.' },
                { step: 4, title: 'Sabar & Tunggu', text: 'Propagasi DNS butuh waktu 15 - 60 menit. Cek secara berkala di dashboard ini.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="w-6 h-6 rounded-lg bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-[10px] font-black text-brand-purple shrink-0">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{item.title}</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl gap-2 text-xs font-black uppercase tracking-widest transition-all"
              onClick={() => window.open('https://dash.cloudflare.com/', '_blank')}
            >
              Buka Cloudflare <ExternalLink className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 border-orange-500/20 bg-orange-500/5 space-y-3">
            <div className="flex items-center gap-2 text-orange-500">
              <Shield className="w-5 h-5" />
              <p className="text-[10px] font-black uppercase tracking-widest">Catatan Penting</p>
            </div>
            <p className="text-[11px] text-orange-200/60 font-medium leading-relaxed">
              Setelah DNS terhubung (HIJAU), HTTPS mungkin butuh waktu beberapa jam untuk aktif. Jangan khawatir jika muncul "Your connection is not private" di awal, Google sedang memproses SSL gratis Anda.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
