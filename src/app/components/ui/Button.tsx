import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon,
  children, 
  loading,
  ...props 
}: ButtonProps) {
  
  const variants = {
    primary: "bg-[#FF2A2A] text-white hover:bg-[#D91E1E] shadow-[0_4px_18px_rgba(255,42,42,0.25)] hover:shadow-[0_4px_28px_rgba(255,42,42,0.45)] border border-transparent",
    secondary: "bg-[#00D1FF] text-[#050505] hover:bg-[#33DBFF] shadow-[0_4px_18px_rgba(0,209,255,0.25)] hover:shadow-[0_4px_28px_rgba(0,209,255,0.45)] border border-transparent",
    glass: "bg-white/[0.03] backdrop-blur-md border border-white/[0.08] text-white hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent",
    outline: "bg-transparent border border-white/[0.12] text-white hover:border-[#FF2A2A]/50 hover:text-white hover:bg-[#FF2A2A]/[0.08] hover:shadow-[0_0_16px_rgba(255,42,42,0.15)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] tracking-[0.12em]",
    md: "px-6 py-3 text-[11px] tracking-[0.14em]",
    lg: "px-8 py-4 text-[12px] tracking-[0.16em]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed font-ui uppercase transition-all duration-200 ease-out",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </motion.button>
  );
}