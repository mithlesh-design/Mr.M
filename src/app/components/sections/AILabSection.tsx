import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Cpu, Zap, Activity, Globe, Bot, Sparkles, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';
import { DepthCard } from '../ui/DepthCard';
import { useSound } from '../../audio/AudioSystem';

export default function AILabSection() {
  const { play } = useSound();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGenerateTimer = useCallback(() => {
    if (generateTimerRef.current) {
      clearTimeout(generateTimerRef.current);
      generateTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearGenerateTimer, [clearGenerateTimer]);

  const handleGenerate = () => {
    if (isGenerating) return;
    clearGenerateTimer();
    play('click');
    setIsGenerating(true);
    setGeneratedOutput(null);
    generateTimerRef.current = setTimeout(() => {
      generateTimerRef.current = null;
      setIsGenerating(false);
      play('success');
      setGeneratedOutput("OPTIMIZATION COMPLETE: User retention vectors align with high-intent pathways. Suggested intervention: Reduce friction in primary conversion loop by 14%.");
    }, 2500);
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-[#050505] relative overflow-hidden min-h-screen flex items-center justify-center perspective-[1000px]">
       {/* Ambient glow */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,209,255,0.04) 0%, transparent 70%)' }} />
       </div>

       <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10 relative">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
                <div className="flex items-center gap-3 mb-4">
                   <div className="relative">
                      {/* Icon — static glow, no pulse on structural elements */}
                      <BrainCircuit className="w-6 h-6 text-[#00D1FF] relative z-10" />
                      <div className="absolute inset-0 bg-[#00D1FF] blur-[10px] opacity-40" />
                   </div>
                   <span className="text-xs font-mono tracking-[0.2em] text-[#00D1FF] uppercase border border-[#00D1FF]/30 px-2 py-1 rounded bg-[#00D1FF]/5">
                      Neural Core Online
                   </span>
                </div>
                
                {/* Heading — capped to H2 system (max ~56px) */}
                <h2
                  className="font-heading font-bold text-white leading-[0.9] mb-6"
                  style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', letterSpacing: '0.09em' }}
                >
                   INTELLIGENCE <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] via-white to-[#00D1FF] animate-gradient-x bg-[length:200%_auto]">
                      AUGMENTED.
                   </span>
                </h2>
                
                <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-[#00D1FF]/30 pl-6 max-w-lg relative">
                   <span className="absolute -left-[2px] top-0 h-1/2 w-[2px] bg-[#00D1FF] shadow-[0_0_15px_#00D1FF]" />
                   Leveraging generative models to accelerate design velocity and uncover deeper user insights. 
                   This isn't just automation; it's cognitive expansion.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-8">
                   {[
                      { icon: Bot, label: "Agentic Workflows" },
                      { icon: Globe, label: "Real-time Synthesis" },
                      { icon: Sparkles, label: "Generative UI" },
                      { icon: Activity, label: "Predictive UX" }
                   ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 sm:p-4 bg-[#0A0A0A] border border-white/5 hover:border-[#00D1FF]/30 hover:bg-[#00D1FF]/5 transition-all group cursor-default"
                        onMouseEnter={() => play('hover')}
                      >
                         <item.icon className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-[#00D1FF] transition-colors" />
                         <span className="text-sm text-gray-400 group-hover:text-white font-mono uppercase tracking-tight">{item.label}</span>
                      </motion.div>
                   ))}
                </div>
             </motion.div>
          </div>

          {/* Right: Interactive Demo Panel — scroll-in without 3D rotation */}
          <motion.div 
             className="relative perspective-[1000px]"
             initial={{ opacity: 0, x: 24 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.75, ease: 'easeOut' }}
             viewport={{ once: true }}
          >
             <DepthCard depth={40} className="w-full bg-[#080808]/80 backdrop-blur-xl border border-[#00D1FF]/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,209,255,0.05)] relative z-20">
                {/* Header */}
                <div className="bg-[#0D0D0D] border-b border-white/10 p-4 flex justify-between items-center relative z-20">
                   <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-[#FF2A2A]/20 border border-[#FF2A2A]/50" />
                         <div className="w-2.5 h-2.5 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/50" />
                         <div className="w-2.5 h-2.5 rounded-full bg-[#00D1FF]/20 border border-[#00D1FF]/50" />
                      </div>
                      <div className="h-4 w-[1px] bg-white/10 mx-2" />
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <Terminal className="w-3 h-3 text-[#00D1FF]" />
                         System.Analyze()
                      </span>
                   </div>
                   <div className="text-[9px] font-mono text-[#00D1FF] opacity-70">
                      CPU: 12%
                   </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-8 h-[320px] sm:h-[360px] flex flex-col justify-center items-center relative overflow-hidden">

                   <AnimatePresence mode="wait">
                      {!isGenerating && !generatedOutput && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                           className="text-center space-y-8 relative z-20"
                         >
                            <button
                              type="button"
                              aria-label="Generate UX insight"
                              className="w-20 h-20 rounded-full border border-[#00D1FF]/30 flex items-center justify-center mx-auto relative group cursor-pointer transition-colors duration-200 hover:border-[#00D1FF]/70 bg-transparent p-0"
                              onClick={handleGenerate}
                            >
                               <div className="absolute inset-0 bg-[#00D1FF]/10 rounded-full animate-ping opacity-20" />
                               <div className="absolute inset-0 border border-[#00D1FF] rounded-full opacity-30 scale-110" />
                               <Zap className="w-8 h-8 text-[#00D1FF] group-hover:text-white transition-colors duration-200" />
                            </button>
                            
                            <div className="space-y-2">
                               <h4 className="text-white font-heading font-bold text-xl">Ready for Analysis</h4>
                               <p className="text-gray-500 text-sm font-mono max-w-xs mx-auto leading-relaxed">
                                  Initiate cognitive scan on current design parameters to identify optimization vectors.
                               </p>
                            </div>

                            <Button 
                              variant="outline" 
                              onClick={handleGenerate} 
                              className="border-[#00D1FF]/30 text-[#00D1FF] hover:bg-[#00D1FF] hover:text-black transition-all hover:shadow-[0_0_20px_rgba(0,209,255,0.4)]"
                           >
                              Generate UX Insight
                           </Button>
                         </motion.div>
                      )}

                      {isGenerating && (
                         <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex flex-col items-center gap-6 w-full relative z-20"
                         >
                            {/* Scanning Visual */}
                            <div className="w-full max-w-xs space-y-2">
                               <div className="flex justify-between text-[9px] font-mono text-[#00D1FF] uppercase">
                                  <span>Parsing Data...</span>
                                  <span>84%</span>
                               </div>
                               <div className="w-full h-1 bg-[#111] rounded overflow-hidden relative">
                                  <motion.div 
                                    className="absolute top-0 left-0 h-full bg-[#00D1FF] shadow-[0_0_10px_#00D1FF]"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                  />
                               </div>
                            </div>

                            <div className="relative w-16 h-16 flex items-center justify-center">
                               <Cpu className="w-8 h-8 text-[#00D1FF] animate-pulse" />
                               <div className="absolute inset-0 border-t border-[#00D1FF]/60 rounded-full animate-spin" />
                            </div>

                            <div className="font-mono text-xs text-[#00D1FF] animate-pulse tracking-widest uppercase text-center">
                               Processing Neural Pathways...<br/>
                               <span className="text-gray-500 text-[9px] normal-case">Calculating probability matrices</span>
                            </div>
                            
                         </motion.div>
                      )}

                      {generatedOutput && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                           className="w-full bg-[#00D1FF]/5 border border-[#00D1FF]/20 rounded-lg p-6 relative z-20 backdrop-blur-sm"
                        >
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D1FF]" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D1FF]" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D1FF]" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D1FF]" />
                            
                            <h4 className="text-[#00D1FF] font-bold font-mono text-xs uppercase mb-4 flex items-center gap-2 border-b border-[#00D1FF]/10 pb-2">
                               <Activity className="w-3 h-3" /> Insight Generated
                            </h4>
                            
                            <p className="text-white text-sm leading-relaxed font-mono typing-effect">
                               <span className="text-[#00D1FF] mr-2">{'>'}</span>
                               "{generatedOutput}"
                            </p>
                            
                            <div className="mt-6 flex justify-between items-center">
                               <div className="text-[9px] text-gray-500 font-mono">
                                  CONFIDENCE: 98.2%
                               </div>
                               <button 
                                 onClick={() => setGeneratedOutput(null)}
                                 className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest hover:underline flex items-center gap-1"
                               >
                                  <Terminal className="w-3 h-3" /> Reset
                               </button>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </DepthCard>

             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00D1FF]/10 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
          </motion.div>

       </div>
    </section>
  );
}
