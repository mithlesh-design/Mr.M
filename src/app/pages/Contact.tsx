import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Send, Terminal, User, ShieldCheck, Activity, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSound } from '../audio/AudioSystem';
import { useSecureUplinkFlow } from '../hooks/useSecureUplinkFlow';
import contactOperativeImg from '@/assets/8d35a94c1d7f6b0d72893a0d1dabfff6dba525e0.png';

export default function Contact() {
   const navigate = useNavigate();
   const { play } = useSound();
   const {
      messages,
      currentStep,
      inputValue,
      setInputValue,
      handleSend,
      clearTimers,
   } = useSecureUplinkFlow({
      onTransmit: () => play('transmit'),
      onSuccess: () => play('success'),
   });

   useEffect(() => {
      document.title = 'Uplink | Mithlesh Mishra — Secure Contact';
      return () => {
         clearTimers();
         document.title = 'Mithlesh Mishra | Senior UX Designer & Product Strategist';
      };
   }, [clearTimers]);

   return (
      <div className="pt-5 md:pt-[95px] pb-8 md:pb-0 min-h-screen bg-[#050505] relative overflow-hidden flex flex-col md:flex-row">
         {/* Background Elements */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />

         {/* Left: Character Presence */}
         <div className="hidden md:flex flex-1 relative items-center justify-center p-12 h-[calc(100vh-95px)] sticky top-[95px]">
            {/* Character Panel */}
            <div className="relative w-full max-w-md h-full max-h-[800px] border border-white/[0.06] overflow-hidden shadow-2xl bg-[#030303]">
               {/* Tactical grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />
               {/* Gradient overlays */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10 pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/10 via-transparent to-[#050505]/10 z-10 pointer-events-none" />
               <img
                  src={contactOperativeImg}
                  alt="Operative"
                  className="w-full h-full object-contain object-bottom"
                  style={{
                     filter: 'grayscale(15%) brightness(1.0) contrast(1.08)',
                     maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  }}
               />

               {/* Corner brackets */}
               {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
                  <div key={pos} className="absolute pointer-events-none z-20" style={{
                     ...(pos.startsWith('t') ? { top: 16 } : { bottom: 16 }),
                     ...(pos.endsWith('l') ? { left: 16 } : { right: 16 }),
                  }}>
                     <div style={{
                        position: 'absolute', width: 16, height: 1.5, background: '#00D1FF', opacity: 0.5,
                        ...(pos.startsWith('t') ? { top: 0 } : { bottom: 0 }),
                        ...(pos.endsWith('l') ? { left: 0 } : { right: 0 }),
                     }} />
                     <div style={{
                        position: 'absolute', width: 1.5, height: 16, background: '#00D1FF', opacity: 0.5,
                        ...(pos.startsWith('t') ? { top: 0 } : { bottom: 0 }),
                        ...(pos.endsWith('l') ? { left: 0 } : { right: 0 }),
                     }} />
                  </div>
               ))}

               {/* HUD top label */}
               <div className="absolute top-10 left-10 z-20 text-[9px] font-mono text-[#00D1FF]/70 tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00D1FF] animate-pulse" />
                  AI_OPERATIVE_ACTIVE
               </div>

               {/* Bottom data strip */}
               <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                  <div style={{ height: '1px', background: 'rgba(0,209,255,0.12)', marginBottom: '12px' }} />
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col gap-1">
                        <span className="font-mono uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(255,42,42,0.6)' }}>SECURE CHANNEL</span>
                        <span className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>Mithlesh Mishra</span>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <span className="font-mono uppercase" style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(0,209,255,0.5)' }}>CLEARANCE</span>
                        <span className="font-mono" style={{ fontSize: '10px', color: '#FF2A2A', letterSpacing: '0.15em' }}>LEVEL 7</span>
                     </div>
                  </div>
               </div>

               {/* Waveform */}
               <div className="absolute bottom-32 right-10 z-20 flex items-end gap-1 h-8 opacity-40">
                  {[...Array(5)].map((_, i) => (
                     <motion.div
                        key={i}
                        className="w-1 bg-[#00D1FF] rounded-sm"
                        animate={{ height: [5, 20, 5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1, ease: "easeInOut" }}
                     />
                  ))}
               </div>
            </div>
         </div>

         {/* Right: Chat Interface */}
         <div className="flex-1 flex flex-col p-6 md:p-12 border-l border-white/10 min-h-[calc(100vh-95px)] relative z-20 bg-[#050505]">
            <div className="max-w-2xl w-full mx-auto flex flex-col h-full" style={{ maxHeight: 'calc(100vh - 95px)' }}>

               {/* Header */}
               <div className="mb-6 border-b border-white/5 pb-6 flex items-center justify-between">
                  <div>
                     <h2 className="text-2xl md:text-3xl font-heading font-bold text-white flex items-center gap-3" style={{ letterSpacing: '0.09em' }}>
                        <ShieldCheck className="w-8 h-8 text-[#FF2A2A]" />
                        SECURE UPLINK
                     </h2>
                     <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00D1FF]/10 border border-[#00D1FF]/20 text-[10px] font-mono text-[#00D1FF] uppercase tracking-wider">
                           <Activity className="w-3 h-3" />
                           Signal: Strong
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2">
                           <span>ENCRYPTION: <span className="text-[#FF2A2A] animate-pulse">ON</span></span>
                           <span className="w-px h-3 bg-white/10" />
                           <span>PROTOCOL: <span className="text-white">TCP/SECURE</span></span>
                        </div>
                     </div>
                  </div>
                  <div className="hidden md:block text-right">
                     <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Transmission Log</div>
                     <div className="text-xs font-mono text-[#FF2A2A]">REC: Active</div>
                  </div>
               </div>

               {/* Chat History */}
               <div className="flex-1 space-y-6 mb-8 pr-2 overflow-y-auto" style={{ minHeight: 0 }}>
                  {messages.map((msg, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                        {msg.role === 'ai' && (
                           <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                              <Terminal className="w-4 h-4 text-[#00D1FF]" />
                           </div>
                        )}

                        <div className={`
                        max-w-[80%] p-4 text-sm font-mono leading-relaxed relative
                        ${msg.role === 'user'
                              ? 'bg-[#FF2A2A]/10 border border-[#FF2A2A]/20 text-white shadow-[0_0_20px_rgba(255,42,42,0.1)]'
                              : 'bg-[#0A0A0A] border border-white/10 text-gray-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]'}
                     `}>
                           {/* Corner Accents */}
                           {msg.role === 'user' ? (
                              <>
                                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF2A2A]" />
                                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF2A2A]" />
                              </>
                           ) : (
                              <>
                                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
                              </>
                           )}

                           {msg.text}
                        </div>

                        {msg.role === 'user' && (
                           <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-400" />
                           </div>
                        )}
                     </motion.div>
                  ))}

                  {currentStep === 'done' && (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8 space-y-4"
                     >
                        <div className="w-20 h-20 bg-[#00D1FF]/10 flex items-center justify-center border border-[#00D1FF]/30 shadow-[0_0_30px_rgba(0,209,255,0.2)]">
                           <CheckCircle className="w-10 h-10 text-[#00D1FF]" />
                        </div>
                        <p className="text-white font-heading text-xl" style={{ letterSpacing: '0.08em' }}>TRANSMISSION SENT</p>
                        <p className="text-[#FF2A2A] font-mono text-xs tracking-widest uppercase animate-pulse">UPLINK CLOSED</p>
                        <Button variant="outline" onClick={() => navigate('/')}>
                           Return to Base
                        </Button>
                     </motion.div>
                  )}
               </div>

               {/* Input Area */}
               {currentStep !== 'done' && (
                  <form onSubmit={handleSend} className="mt-auto group">
                     {/* Input + Send button wrapper */}
                     <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A2A]/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-xl" />
                        <input
                           type={currentStep === 'email' ? 'email' : 'text'}
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           placeholder={
                              currentStep === 'name' ? 'Enter Identification...' :
                                 currentStep === 'email' ? 'Enter Comms Freq (Email)...' :
                                    'Enter Mission Brief...'
                           }
                           className="w-full bg-[#080808] border border-white/10 py-5 px-6 pr-14 sm:pr-16 text-white font-mono text-sm focus:outline-none focus:border-[#00D1FF]/50 focus:shadow-[0_0_20px_rgba(0,209,255,0.15)] transition-all placeholder:text-gray-500 shadow-inner"
                           autoFocus
                           aria-label={
                              currentStep === 'name' ? 'Enter your name or identification' :
                                 currentStep === 'email' ? 'Enter your email address' :
                                    'Enter your message'
                           }
                        />
                        <button
                           type="submit"
                           className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#FF2A2A] transition-all duration-300"
                           disabled={!inputValue.trim()}
                           aria-label={inputValue.trim() ? 'Send message (Enter)' : 'Type a message first'}
                           title={inputValue.trim() ? 'Send (Enter ↵)' : 'Type a message to send'}
                           style={{
                              color: inputValue.trim() ? '#FF2A2A' : 'rgba(255,255,255,0.15)',
                              cursor: inputValue.trim() ? 'pointer' : 'default',
                           }}
                        >
                           <Send className="w-4 h-4" />
                        </button>
                     </div>
                     {/* Keyboard shortcut hint */}
                     <div className="flex items-center justify-end mt-2 pr-1" style={{ gap: '0.35rem' }}>
                        <span className="font-mono text-gray-600" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
                           Press
                        </span>
                        <kbd className="font-mono text-gray-500 border border-white/10 px-1.5 py-0.5 bg-white/5" style={{ fontSize: '8px', letterSpacing: '0.05em' }}>
                           Enter ↵
                        </kbd>
                        <span className="font-mono text-gray-600" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
                           to send
                        </span>
                     </div>
                  </form>
               )}

            </div>
         </div>
      </div>
   );
}
