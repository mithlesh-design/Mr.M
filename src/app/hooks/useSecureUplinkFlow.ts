import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, MutableRefObject } from 'react';

export type SecureUplinkStep = 'name' | 'email' | 'message' | 'sending' | 'done';
export type SecureUplinkRole = 'ai' | 'user';

export interface SecureUplinkMessage {
  role: SecureUplinkRole;
  text: string;
}

export interface SecureUplinkFormData {
  name: string;
  email: string;
  message: string;
}

interface UseSecureUplinkFlowOptions {
  initialPrompt?: string;
  stepDelayMs?: number;
  sendDelayMs?: number;
  onTransmit?: () => void;
  onSuccess?: () => void;
}

const DEFAULT_PROMPT = 'Secure channel established. Please identify yourself (Name / Org).';

export function useSecureUplinkFlow({
  initialPrompt = DEFAULT_PROMPT,
  stepDelayMs = 600,
  sendDelayMs = 1500,
  onTransmit,
  onSuccess,
}: UseSecureUplinkFlowOptions = {}) {
  const [messages, setMessages] = useState<SecureUplinkMessage[]>([
    { role: 'ai', text: initialPrompt },
  ]);
  const [currentStep, setCurrentStep] = useState<SecureUplinkStep>('name');
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState<SecureUplinkFormData>({
    name: '',
    email: '',
    message: '',
  });
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const queueTimer = useCallback(
    (
      timerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
      cb: () => void,
      delay: number
    ) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        cb();
      }, delay);
    },
    []
  );

  const resetFlow = useCallback(
    (nextPrompt = initialPrompt) => {
      clearTimers();
      setMessages([{ role: 'ai', text: nextPrompt }]);
      setCurrentStep('name');
      setFormData({ name: '', email: '', message: '' });
      setInputValue('');
    },
    [clearTimers, initialPrompt]
  );

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (!inputValue.trim()) return;

      onTransmit?.();

      const value = inputValue;
      setMessages((prev) => [...prev, { role: 'user', text: value }]);
      setInputValue('');

      queueTimer(
        stepTimerRef,
        () => {
          if (currentStep === 'name') {
            setFormData((prev) => ({ ...prev, name: value }));
            setMessages((prev) => [
              ...prev,
              { role: 'ai', text: `Acknowledged, ${value}. Enter comms frequency (Email).` },
            ]);
            setCurrentStep('email');
          } else if (currentStep === 'email') {
            setFormData((prev) => ({ ...prev, email: value }));
            setMessages((prev) => [
              ...prev,
              { role: 'ai', text: 'Channel locked. State your mission objective.' },
            ]);
            setCurrentStep('message');
          } else if (currentStep === 'message') {
            setFormData((prev) => ({ ...prev, message: value }));
            setMessages((prev) => [...prev, { role: 'ai', text: 'Encrypting data packet...' }]);
            setCurrentStep('sending');

            queueTimer(sendTimerRef, () => {
              onSuccess?.();
              setMessages((prev) => [
                ...prev,
                { role: 'ai', text: 'Transmission sent. Stand by for response.' },
              ]);
              setCurrentStep('done');
            }, sendDelayMs);
          }
        },
        stepDelayMs
      );
    },
    [currentStep, inputValue, onSuccess, onTransmit, queueTimer, sendDelayMs, stepDelayMs]
  );

  return {
    messages,
    currentStep,
    inputValue,
    setInputValue,
    formData,
    handleSend,
    resetFlow,
    clearTimers,
  };
}
