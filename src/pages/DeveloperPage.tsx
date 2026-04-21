import React from 'react';
import { Card, Badge, Button } from '../components/UI';
import { User, Mail, Globe, Github, Instagram, Code, Terminal, Cpu, Database, Layout } from 'lucide-react';
import { motion } from 'motion/react';

export const DeveloperPage: React.FC = () => {
  const skills = [
    { name: 'Frontend', icon: Layout, level: 'Expert', color: 'text-blue-400' },
    { name: 'Backend', icon: Database, iconColor: 'text-emerald-400' },
    { name: 'DevOps', icon: Terminal, iconColor: 'text-brand-purple' },
    { name: 'System Arch', icon: Cpu, iconColor: 'text-amber-400' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <section className="text-center space-y-6 pt-10">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-brand-purple shadow-[0_0_50px_rgba(168,85,247,0.3)] mx-auto">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Kyzzyy`} 
              alt="Developer" 
              className="w-full h-full object-cover bg-white/5"
            />
          </div>
          <Badge className="absolute -bottom-2 -right-2 bg-brand-purple text-white px-4 py-1.5 shadow-xl">
             DEVELOPER
          </Badge>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">Kyzzyy Software</h2>
          <p className="text-slate-400 font-medium">Bantul, Yogyakarta, Indonesia (DIY) 📍</p>
        </div>

        <div className="flex justify-center gap-3">
           <Badge variant="outline" className="px-4 py-2 border-white/5">Fullstack Developer</Badge>
           <Badge variant="outline" className="px-4 py-2 border-white/5">Web to APK Specialist</Badge>
           <Badge variant="outline" className="px-4 py-2 border-white/5">WA Tool Crafter</Badge>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="space-y-6 p-8 border-white/5 bg-brand-black/40">
           <h3 className="text-xl font-bold flex items-center gap-3">
              <Code className="w-6 h-6 text-brand-purple" /> Tentang Saya
           </h3>
           <p className="text-slate-400 leading-relaxed italic">
             "Berfokus pada pengembangan aplikasi web modern dengan performa tinggi dan user interface yang intuitif. Memiliki passion besar dalam automasi dan tools pendukung bisnis digital."
           </p>
           <div className="pt-4 flex gap-4">
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-2">
                 <Mail className="w-4 h-4" /> Hubungi
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-2">
                 <Instagram className="w-4 h-4" /> Follow
              </Button>
           </div>
        </Card>

        <div className="space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-3">
              <Terminal className="w-6 h-6 text-brand-purple" /> Technical Skills
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {skills.map((s, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-2 hover:bg-white/[0.08] transition-all">
                   <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                   <span className="font-bold text-sm">{s.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <footer className="text-center pt-8 border-t border-white/5">
         <p className="text-slate-500 text-xs font-medium">Built with ❤️ by Kyzzyy Labs &copy; 2024</p>
      </footer>
    </div>
  );
};
