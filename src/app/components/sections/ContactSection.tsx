import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ShieldCheck, Activity, CheckCircle, Terminal, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSound } from '../../audio/AudioSystem';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactFields: Array<{
  field: keyof ContactFormData;
  label: string;
  placeholder: string;
  type: 'text' | 'email';
}> = [
  { field: 'name', label: 'Operative ID', placeholder: 'Enter designation...', type: 'text' },
  { field: 'email', label: 'Comms Frequency', placeholder: 'secure@frequency.com', type: 'email' },
];

export default function ContactSection() {
  const { play } = useSound();
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [currentStep, setCurrentStep] = useState<'form' | 'sending' | 'success'>('form');
  const [fieldFocused, setFieldFocused] = useState(false);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Generate a stable reference ID once — not on every render
  const refId = useRef(
    Math.random().toString(36).substring(2, 9).toUpperCase()
  );

  const clearSubmitTimer = useCallback(() => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearSubmitTimer, [clearSubmitTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    clearSubmitTimer();
    play('transmit');
    setCurrentStep('sending');
    submitTimerRef.current = setTimeout(() => {
      submitTimerRef.current = null;
      play('success');
      setCurrentStep('success');
    }, 2500);
  };

  return (
    <section className="bg-[#050505] relative overflow-hidden flex items-center justify-center py-12 md:py-20" style={{ minHeight: '100vh' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,42,42,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 w-full relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <motion.div
            className="flex items-center justify-center"
            style={{ gap: '0.75rem' }}
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
            <span
              className="font-mono text-[#FF2A2A] uppercase border border-[#FF2A2A]/20 rounded bg-[#FF2A2A]/5"
              style={{ fontSize: '10px', letterSpacing: '0.25em', padding: '4px 12px' }}
            >
              Secure Uplink Established
            </span>
            <div className="h-[1px] w-8 bg-[#FF2A2A]" style={{ boxShadow: '0 0 6px rgba(255,42,42,0.5)' }} />
          </motion.div>

          <motion.h2
            className="font-heading font-bold text-white leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.09em' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            INITIATE{' '}
            <span
              style={{
                background: 'linear-gradient(105deg, #FF2A2A, rgba(100,100,100,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PROTOCOL.
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500 mx-auto leading-relaxed font-light"
            style={{ fontSize: '17px', maxWidth: '440px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Ready to execute high-value objectives? Encrypt your briefing below.
          </motion.p>
        </div>

        {/* Contact Terminal */}
        <motion.div
          className="relative w-full mx-auto"
          style={{ maxWidth: '640px' }}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Outer glow — static, no pulse */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-1px',
              background: 'linear-gradient(135deg, rgba(255,42,42,0.12), transparent 50%, rgba(255,42,42,0.08))',
              filter: 'blur(8px)',
              opacity: 0.5,
            }}
          />

          <div
            className="relative overflow-hidden"
            style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Terminal header */}
            <div
              className="flex items-center justify-between"
              style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 20px' }}
            >
              <div className="flex items-center" style={{ gap: '8px' }}>
                <div className="w-3 h-3 bg-[#FF2A2A]/20 border border-[#FF2A2A]/50" />
                <div className="w-3 h-3 bg-white/8 border border-white/20" />
                <div className="w-3 h-3 bg-white/8 border border-white/20" />
              </div>
              <div className="flex items-center font-mono text-gray-500 uppercase" style={{ gap: '0.5rem', fontSize: '10px', letterSpacing: '0.18em' }}>
                <motion.div
                  animate={fieldFocused ? {
                    color: '#22c55e',
                    scale: [1, 1.2, 1],
                    filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))',
                  } : {
                    color: '#FF2A2A',
                    scale: 1,
                    filter: 'drop-shadow(0 0 0px transparent)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Lock className="w-3 h-3" />
                </motion.div>
                <span style={{ color: fieldFocused ? '#22c55e' : undefined, transition: 'color 0.3s ease-out' }}>
                  AES-256 {fieldFocused ? 'SECURED' : 'Encrypted'}
                </span>
              </div>
            </div>

            {/* Form body */}
            <div
              className="relative flex flex-col justify-center"
              style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', minHeight: 'clamp(360px, 55vh, 420px)', background: '#080808' }}
            >
              <AnimatePresence mode="wait">
                {currentStep === 'form' && (
                  <motion.form
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    {contactFields.map(({ field, label, placeholder, type }) => (
                      <div key={field} className="group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label
                          htmlFor={`contact-${field}`}
                          className="font-mono uppercase transition-colors duration-200 group-focus-within:text-[#FF2A2A]"
                          style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}
                        >
                          {label}
                        </label>
                        <div className="relative">
                          <input
                            id={`contact-${field}`}
                            type={type}
                            required
                            aria-required="true"
                            value={formData[field]}
                            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                            placeholder={placeholder}
                            className="w-full font-mono text-white focus:outline-none transition-all duration-200 rounded contact-field"
                            style={{
                              background: '#050505',
                              border: '1px solid rgba(255,255,255,0.08)',
                              padding: '12px 16px 12px 20px',
                              fontSize: '14px',
                              color: '#ffffff',
                            }}
                            onFocus={() => setFieldFocused(true)}
                            onBlur={() => setFieldFocused(false)}
                          />
                          <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-focus-within:opacity-100 transition-opacity bg-[#FF2A2A]" />
                        </div>
                      </div>
                    ))}

                    <div className="group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label
                        htmlFor="contact-message"
                        className="font-mono uppercase transition-colors duration-200 group-focus-within:text-[#FF2A2A]"
                        style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
                        Mission Objectives
                      </label>
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          required
                          aria-required="true"
                          rows={4}
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Briefing details..."
                          className="w-full font-mono text-white focus:outline-none transition-all duration-200 resize-none rounded contact-field"
                          style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px 12px 20px', fontSize: '14px' }}
                          onFocus={() => setFieldFocused(true)}
                          onBlur={() => setFieldFocused(false)}
                        />
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-focus-within:opacity-100 transition-opacity bg-[#FF2A2A]" />
                      </div>
                    </div>

                    <Button
                      variant="primary" type="submit"
                      className="w-full justify-center group relative overflow-hidden bg-[#FF2A2A] hover:bg-[#D91E1E] text-white"
                      style={{ padding: '14px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', marginTop: '8px', boxShadow: '0 4px 24px rgba(255,42,42,0.3)' }}
                      onMouseEnter={() => play('hover')}
                    >
                      <span className="relative z-10 flex items-center justify-center" style={{ gap: '0.6rem' }}>
                        TRANSMIT DATA <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                      </span>
                      <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-white/10 transition-transform duration-300 ease-out" />
                    </Button>
                  </motion.form>
                )}

                {currentStep === 'sending' && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] z-30"
                    style={{ gap: '2rem' }}
                  >
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-t-2 border-[#FF2A2A] animate-spin" />
                      <div className="absolute inset-3 border-b-2 border-[#FF2A2A]/40 animate-spin" style={{ animationDirection: 'reverse' }} />
                      <Terminal className="absolute inset-0 m-auto w-7 h-7 text-[#FF2A2A] animate-pulse" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="font-mono text-[#FF2A2A] uppercase animate-pulse" style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
                        Encrypting Packet...
                      </div>
                      <div className="rounded-full overflow-hidden bg-white/5" style={{ height: '2px', width: '160px' }}>
                        <motion.div className="h-full bg-[#FF2A2A]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} />
                      </div>
                    </div>
                    <div className="font-mono text-gray-700 rounded bg-black/50 border border-white/5" style={{ fontSize: '10px', padding: '12px 16px', lineHeight: 1.7, letterSpacing: '0.05em', whiteSpace: 'pre-line' }}>
                      {`> init_handshake()\n> verifying_key...\n> packet_sealed\n> routing_via_proxy\n> transmission_complete`}
                    </div>
                  </motion.div>
                )}

                {currentStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] z-30"
                    style={{ gap: '1.5rem' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                      className="rounded-full flex items-center justify-center relative"
                      style={{ width: '88px', height: '88px', background: 'rgba(255,42,42,0.08)', border: '1px solid rgba(255,42,42,0.3)', boxShadow: '0 0 40px rgba(255,42,42,0.15)' }}
                    >
                      <CheckCircle className="w-10 h-10 text-[#FF2A2A]" />
                      <div className="absolute inset-0 border border-[#FF2A2A] animate-ping opacity-15" />
                    </motion.div>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h3 className="font-heading font-bold text-white" style={{ fontSize: '28px' }}>TRANSMISSION SENT</h3>
                      <p className="font-mono text-gray-500" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>Ref: {refId.current}</p>
                    </div>
                    <div className="font-mono font-bold text-[#FF2A2A] border border-[#FF2A2A]/40 bg-[#FF2A2A]/5 uppercase rounded"
                      style={{ fontSize: '9px', letterSpacing: '0.3em', padding: '6px 16px', transform: 'rotate(-1deg)' }}>
                      CONFIDENTIAL
                    </div>
                    <Button variant="outline" onClick={() => setCurrentStep('form')}
                      className="border-white/10 hover:border-[#FF2A2A]/40 hover:bg-[#FF2A2A]/5 text-gray-400 hover:text-white transition-all duration-200 ease-out"
                      style={{ marginTop: '0.5rem', fontSize: '12px', letterSpacing: '0.1em' }}
                      onMouseEnter={() => play('hover')}
                    >
                      Send Another
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Placeholder + caret colour override */}
      <style>{`
        .contact-field::placeholder {
          color: rgba(255, 255, 255, 0.42);
          font-family: inherit;
        }
        .contact-field:invalid:not(:placeholder-shown) {
          border-color: rgba(255, 42, 42, 0.55) !important;
          box-shadow: 0 0 0 3px rgba(255, 42, 42, 0.12) !important;
        }
        .contact-field:focus {
          border-color: rgba(255, 42, 42, 0.5) !important;
          background: rgba(255, 42, 42, 0.04) !important;
          box-shadow: 0 0 0 3px rgba(255, 42, 42, 0.1) !important;
        }
        .contact-field {
          caret-color: #FF2A2A;
        }
      `}</style>
    </section>
  );
}
