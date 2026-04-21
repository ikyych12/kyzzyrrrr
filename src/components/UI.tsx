import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/helpers';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={cn("glass p-8", className)}
  >
    {children}
  </motion.div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  type?: 'button' | 'submit'; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'sakura';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}> = ({ children, onClick, type = 'button', variant = 'primary', className, disabled, loading }) => {
  const variants = {
    primary: "bg-gradient-to-r from-brand-purple to-brand-purple/80 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] text-white",
    secondary: "bg-gradient-to-r from-brand-blue to-brand-blue/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] text-white",
    outline: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] text-white",
    sakura: "bg-gradient-to-r from-brand-sakura to-brand-sakura-light hover:shadow-[0_0_25px_rgba(255,138,176,0.4)] text-white"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "px-8 py-4 rounded-[1.25rem] font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight",
        variants[variant],
        className
      )}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </motion.button>
  );
};

export const Input: React.FC<{
  label?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}> = ({ label, type = 'text', value, onChange, placeholder, icon, required, className }) => (
  <div className={cn("space-y-2", className)}>
    {label && <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-purple transition-colors">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-purple/[0.02] transition-all placeholder:text-slate-600 font-medium",
          icon && "pl-14"
        )}
      />
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'free' | 'premium' | 'sakura' }> = ({ children, variant = 'free' }) => {
  const styles = {
    free: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    premium: "bg-brand-gold/20 text-brand-gold border-brand-gold/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]",
    sakura: "bg-brand-sakura/20 text-brand-sakura border-brand-sakura/30"
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1", styles[variant])}>
      {children}
    </span>
  );
};
