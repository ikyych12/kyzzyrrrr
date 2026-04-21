import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/helpers';
import { Button } from './UI';
import { ShieldCheck, User as UserIcon, Ban, BookOpen, Crown, X, ArrowRight, Check } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: "Selamat Datang di Kyzzyy!",
    desc: "Aplikasi asisten WhatsApp marketing paling stabil. Mari kita ulas fitur-fitur utamanya.",
    icon: ShieldCheck,
    color: "bg-brand-purple"
  },
  {
    title: "Badak WA",
    desc: "Fitur andalan untuk mengirimkan paket data/spam stabil ke nomor target. Tersedia berbagai server global.",
    icon: ShieldCheck,
    color: "bg-brand-purple"
  },
  {
    title: "Unband & Tutor",
    desc: "Butuh buka blokir atau tips anti-limit? Semua tutorial rahasia ada di sini.",
    icon: Ban,
    color: "bg-red-500"
  },
  {
    title: "Profil & Telegram",
    desc: "Pastikan Telegram ID Anda sudah terhubung di halaman profil untuk menerima laporan otomatis.",
    icon: UserIcon,
    color: "bg-blue-400"
  },
  {
    title: "Akun Premium",
    desc: "Upgrade ke Premium untuk mendapatkan limit hingga 200/day dan efisiensi pengiriman 100%.",
    icon: Crown,
    color: "bg-brand-gold"
  }
];

export const OnboardingTour: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user && !user.hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, [user]);

  const handleFinish = () => {
    if (!user) return;
    const users = storage.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, hasSeenOnboarding: true };
      }
      return u;
    });
    storage.setUsers(updatedUsers);
    refreshUser();
    setIsVisible(false);
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const skipTour = () => {
    handleFinish();
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md glass border-brand-purple/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(168,85,247,0.2)]"
        >
          <div className="p-8 space-y-8 relative">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={skipTour} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center text-white shadow-2xl`}
              >
                <step.icon className="w-12 h-12" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black font-display tracking-tighter uppercase italic">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {TOUR_STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-brand-purple' : 'w-1.5 bg-white/10'}`}
                />
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 h-12 rounded-2xl text-xs" onClick={skipTour}>
                Skip Tour
              </Button>
              <Button className="flex-2 h-12 rounded-2xl text-xs" onClick={nextStep}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Mulai Sekarang <Check className="w-4 h-4" /></>
                ) : (
                  <>Lanjut <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
