import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps, useMotionTemplate } from 'motion/react';
import { cn } from '../../../lib/utils';
import { usePrecisionMode } from '../../context/PrecisionModeContext';

interface DepthCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  depth?: number; // 1-5 scale of depth
  variant?: 'default' | 'glass' | 'solid';
  glareOpacity?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  noHover?: boolean;
}

export function DepthCard({ 
  children, 
  className, 
  depth = 3, 
  variant = 'default',
  glareOpacity = 0.08,
  tiltMaxAngleX = 3,
  tiltMaxAngleY = 3,
  noHover = false,
  style,
  ...props 
}: DepthCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = usePrecisionMode();
  
  // Motion values for tilt - reduced sensitivity
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement with gentler spring
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  // Calculate rotation based on mouse position - subtle angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltMaxAngleX, -tiltMaxAngleX]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltMaxAngleY, tiltMaxAngleY]);
  
  // Hover state
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate glare position
  const mouseXPercent = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const mouseYPercent = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${mouseXPercent} ${mouseYPercent}, rgba(255,255,255,${glareOpacity}), transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || noHover) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Styles based on variant
  const variantStyles = {
    default: "bg-[#0B0B0B] border border-white/[0.08]",
    glass: "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
    solid: "bg-[#0F0F0F] border border-white/10"
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative transition-all duration-200 ease-out",
        variantStyles[variant],
        isHovered && "border-white/[0.15]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: "preserve-3d",
        rotateX: noHover ? 0 : rotateX,
        rotateY: noHover ? 0 : rotateY,
        ...style
      }}
      animate={{
        z: isHovered && !noHover ? 8 : 0,
        scale: isHovered && !noHover ? 1.01 : 1,
      }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {/* Shadow Layer (Cinematic) */}
      <motion.div 
        className="absolute inset-4 -z-10 bg-black/40 blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.7 : 0.35,
          transform: "translateZ(-16px)" 
        }}
      />

      {/* Inner Highlight / Glare - very subtle */}
      <motion.div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{ 
          opacity: isHovered ? 1 : 0,
          background: glareBackground
        }} 
      />

      {/* Content Container with minimal Z-lift */}
      <div className="relative z-20 h-full" style={{ transform: "translateZ(6px)" }}>
        {children}
      </div>

      {/* Intel Mode Scanline - refined */}
      {mode === 'INTEL' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 opacity-15">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#00D1FF]/40 shadow-[0_0_8px_#00D1FF] animate-[scan_4s_linear_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,209,255,0.04)_50%,transparent_100%)] bg-[length:100%_3px]" />
        </div>
      )}
    </motion.div>
  );
}