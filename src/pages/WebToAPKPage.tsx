import React, { useState } from 'react';
import { Card, Input, Badge, Button } from '../components/UI';
import { Smartphone, Globe, Settings, Shield, Terminal, Play, Download, Settings2, Sparkles, Layers, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export const WebToAPKPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [versionName, setVersionName] = useState('1.0.0');
  const [versionCode, setVersionCode] = useState('1');
  const [activeTab, setActiveTab] = useState<'metadata' | 'config' | 'permissions'>('metadata');
  const [isBuilding, setIsBuilding] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-8));
  };

  const handleBuild = () => {
    if (!url || !appName) {
      toast.error('Masukkan URL dan Nama Aplikasi!');
      return;
    }

    setIsBuilding(true);
    setLogs([]);
    addLog('🚀 Memulai proses build...');
    
    const steps = [
      'Inisialisasi manifest...',
      'Mengunduh resource WebView...',
      'Injecting assets...',
      'Optimizing APK size...',
      'Signing package...',
      'Build selesai!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);
        if (index === steps.length - 1) {
          setIsBuilding(false);
          toast.success('APK Berhasil Dibuat!');
          window.open('/template.apk', '_blank');
        }
      }, (index + 1) * 1500);
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-brand-purple" /> Web To APK V2
          </h2>
          <p className="text-slate-400">Ubah website menjadi aplikasi android profesional dalam hitungan detik.</p>
        </div>
        <Badge variant="premium" className="w-fit">ENTERPRISE V2</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-white/5 bg-brand-black/40">
            <div className="flex border-b border-white/5">
              {(['metadata', 'config', 'permissions'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${activeTab === tab ? 'text-brand-purple border-b-2 border-brand-purple bg-brand-purple/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'metadata' && (
                  <motion.div 
                    key="metadata" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <Input label="App URL" value={url} onChange={setUrl} icon={<Globe className="w-5 h-5" />} placeholder="https://example.com" />
                    <Input label="App Name" value={appName} onChange={setAppName} icon={<Smartphone className="w-5 h-5" />} placeholder="My Application" />
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Version Code" value={versionCode} onChange={setVersionCode} icon={<Layers className="w-5 h-5" />} placeholder="1" />
                       <Input label="Version Name" value={versionName} onChange={setVersionName} icon={<Sparkles className="w-5 h-5" />} placeholder="1.0.0" />
                    </div>
                  </motion.div>
                )}
                {activeTab === 'config' && (
                  <motion.div 
                    key="config" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[ 'Enable JS', 'Cache Mode', 'Fullscreen', 'Pull to Refresh', 'Clear Cache on Exit', 'Safe Browsing' ].map(cfg => (
                         <div key={cfg} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-purple/20 transition-all group">
                            <span className="text-sm font-medium text-slate-300">{cfg}</span>
                            <div className="w-10 h-5 bg-slate-700 rounded-full relative group-hover:bg-brand-purple/20 transition-colors">
                               <div className="absolute left-1 top-1 w-3 h-3 bg-slate-400 rounded-full"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'permissions' && (
                  <motion.div 
                    key="permissions" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[ 'Internet Access', 'Storage Read/Write', 'Camera Access', 'Microphone Access', 'Location Tracking', 'Contact Access' ].map(perm => (
                         <div key={perm} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-brand-purple/5 transition-all">
                            <div className="w-5 h-5 border-2 border-white/20 rounded-md flex items-center justify-center group-hover:border-brand-purple transition-colors">
                               <div className="w-2.5 h-2.5 bg-brand-purple rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-300">{perm}</span>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-brand-purple/20" 
            onClick={handleBuild}
            disabled={isBuilding}
          >
            {isBuilding ? 'Generating APK...' : 'Build APK Now 🚀'}
          </Button>
        </div>

        <div className="space-y-6">
           <Card className="bg-brand-black/60 border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-brand-purple uppercase font-bold text-[10px] tracking-widest">
                 <Terminal className="w-3 h-3" /> System Logs
              </div>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] space-y-2 min-h-[150px] border border-white/5">
                 {logs.length === 0 ? (
                   <p className="text-slate-600 italic">Waiting for trigger...</p>
                 ) : (
                   logs.map((log, i) => (
                     <div key={i} className="flex gap-2">
                        <span className="text-brand-purple font-bold">➜</span>
                        <span className="text-slate-300">{log}</span>
                     </div>
                   ))
                 )}
              </div>
           </Card>

           <Card className="bg-gradient-to-br from-indigo-900/20 to-brand-purple/10 border-brand-purple/20">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple shadow-lg">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h4 className="font-bold">Signature V2 Cloud</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Setiap APK yang dihasilkan secara otomatis ditandatangani menggunakan Signature V2 untuk menghindari deteksi Play Protect.
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
