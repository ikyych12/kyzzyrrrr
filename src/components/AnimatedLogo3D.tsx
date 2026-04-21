import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '../utils/helpers';

interface AnimatedLogo3DProps {
  text?: string;
  className?: string;
  interactive?: boolean;
}

export const AnimatedLogo3D: React.FC<AnimatedLogo3DProps> = ({ 
  text = "Kyzzyy", 
  className,
  interactive = true 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className={cn("perspective-1000 select-none", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ rotateY: 0 }}
        animate={!interactive ? {
          rotateY: [0, 10, -10, 0],
          rotateX: [0, -5, 5, 0],
        } : {}}
        transition={!interactive ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        className="relative preserve-3d"
      >
        <span className="relative z-10 block font-display font-black tracking-tighter text-white text-3d">
          {text}
        </span>
        
        {/* Shadow/Back Layer */}
        <span 
          className="absolute inset-0 block font-display font-black tracking-tighter text-brand-purple/20 blur-sm translate-z-[-10px] scale-105"
          aria-hidden="true"
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
};
