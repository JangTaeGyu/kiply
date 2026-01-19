'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';

interface UseVoiceReturn {
  speak: (text: string, priority?: boolean) => void;
  cancel: () => void;
  isSupported: boolean;
}

export function useVoice(): UseVoiceReturn {
  const { settings } = useAccessibilityStore();
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text: string, priority: boolean = false) => {
    if (!settings.voiceEnabled || !synthRef.current) return;

    // Cancel current speech if priority
    if (priority && synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Try to use a Korean voice
    const voices = synthRef.current.getVoices();
    const koreanVoice = voices.find(
      (voice) => voice.lang.startsWith('ko') || voice.name.includes('Korean')
    );
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [settings.voiceEnabled]);

  const cancel = useCallback(() => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
    }
  }, []);

  return {
    speak,
    cancel,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}
