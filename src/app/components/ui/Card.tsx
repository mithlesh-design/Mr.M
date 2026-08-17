import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass';
  glowColor?: string;
  onClick?: () => void;
}

export function Card({ 
  className, 
  variant = 'default', 
  children,
  onClick,
  glowColor = '#FF2A2A',
  ...props 
}: CardProps) {
  
  const variants = {
    default: "bg-[#0B0B0B]",
    glass: "bg-white/[0.03] backdrop-blur-xl"
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.2 }}
      className={cn(
        "relative p-6 overflow-hidden border border-white/[0.08] group hover:border-white/[0.15] transition-all duration-200 ease-out",
        variants[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
      }}
      {...props}
    >
      {/* Edge glow on hover */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          boxShadow: `inset 0 0 0 1px ${glowColor}20, 0 0 16px ${glowColor}12`
        }}
      />
      
      {/* Specular highlight overlay - subtle top-right shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      
      {/* Subtle bottom accent glow */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${glowColor}08 0%, transparent 100%)`
        }}
      />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}