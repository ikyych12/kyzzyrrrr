import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar, Navbar } from './Navigation';
import { Toaster } from 'react-hot-toast';
import { OnboardingTour } from './OnboardingTour';
import { Ban } from 'lucide-react';
import { Card, Button } from './UI';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (isLoading) return <div className="min-h-screen bg-brand-black flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
  </div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 bg-mesh overflow-hidden relative">
        <div className="absolute inset-0 bg-red-500/5 blur-[100px] rounded-full" />
        <Card className="max-w-md w-full border-red-500/20 glass text-center space-y-6 p-10 neon-border shadow-red-500/20">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
             <Ban className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black tracking-tighter italic uppercase text-red-400">AKUN DIBEKUKAN</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Sistem mendeteksi adanya pelanggaran kebijakan (Multi-Account / Scam Referral). Akun Anda telah dibanned permanen oleh Administrator.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Hubungi Admin untuk ajukan banding</p>
            <a href="https://t.me/kyzzyreal" target="_blank" rel="noopener noreferrer">
              <Button variant="danger" className="w-full h-12 rounded-2xl text-xs uppercase font-black tracking-widest">
                Support Kyzzy Real
              </Button>
            </a>
            <button 
              onClick={() => {
                localStorage.removeItem('kyzzyy_currentUser');
                window.location.href = '/login';
              }} 
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-slate-100">
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <OnboardingTour />
      <main className="pt-20 pb-10 px-6 lg:ml-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#111827',
          color: '#F8FAFC',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
    </div>
  );
};

export const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/home" replace />;
  return <Outlet />;
};
