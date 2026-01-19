'use client';

import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'correct' | 'wrong' | 'click' | 'combo' | 'complete';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig[]> = {
  correct: [
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 },
  ],
  wrong: [
    { frequency: 200, duration: 0.15, type: 'square', volume: 0.2 },
    { frequency: 180, duration: 0.15, type: 'square', volume: 0.2 },
  ],
  click: [
    { frequency: 800, duration: 0.05, type: 'sine', volume: 0.2 },
  ],
  combo: [
    { frequency: 587.33, duration: 0.08, type: 'sine', volume: 0.25 },
    { frequency: 659.25, duration: 0.08, type: 'sine', volume: 0.25 },
    { frequency: 783.99, duration: 0.08, type: 'sine', volume: 0.25 },
    { frequency: 880, duration: 0.12, type: 'sine', volume: 0.25 },
  ],
  complete: [
    { frequency: 523.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 1046.5, duration: 0.3, type: 'sine', volume: 0.3 },
  ],
};

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const configs = SOUND_CONFIGS[type];
      let startTime = ctx.currentTime;

      configs.forEach((config) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, startTime);

        gainNode.gain.setValueAtTime(config.volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + config.duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + config.duration);

        startTime += config.duration * 0.8;
      });
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [getAudioContext]);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { playSound, setEnabled };
}
