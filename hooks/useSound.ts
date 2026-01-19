'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

type SoundType = 'correct' | 'wrong' | 'click' | 'combo' | 'complete' | 'pop' | 'gameOver' | 'levelUp';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  endFrequency?: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig[]> = {
  correct: [
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 },
  ],
  wrong: [
    { frequency: 300, duration: 0.15, type: 'sawtooth', volume: 0.2, endFrequency: 150 },
    { frequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.2, endFrequency: 100 },
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
  pop: [
    { frequency: 400, duration: 0.1, type: 'sine', volume: 0.25, endFrequency: 100 },
    { frequency: 300, duration: 0.08, type: 'triangle', volume: 0.2 },
  ],
  gameOver: [
    { frequency: 400, duration: 0.3, type: 'sine', volume: 0.25, endFrequency: 300 },
    { frequency: 350, duration: 0.3, type: 'sine', volume: 0.25, endFrequency: 250 },
    { frequency: 300, duration: 0.3, type: 'sine', volume: 0.25, endFrequency: 200 },
    { frequency: 250, duration: 0.5, type: 'sine', volume: 0.25, endFrequency: 150 },
  ],
  levelUp: [
    { frequency: 523, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 587, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 659, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 784, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 1047, duration: 0.2, type: 'sine', volume: 0.3 },
  ],
};

// Dynamic combo sounds based on combo level
const getComboConfig = (level: number): SoundConfig[] => {
  const baseFreq = 400 + Math.min(level, 10) * 50;
  const configs: SoundConfig[] = [
    { frequency: baseFreq, duration: 0.08, type: 'square', volume: 0.2 },
    { frequency: baseFreq * 1.25, duration: 0.08, type: 'square', volume: 0.2 },
    { frequency: baseFreq * 1.5, duration: 0.12, type: 'square', volume: 0.2 },
  ];

  if (level >= 5) {
    configs.push({ frequency: baseFreq * 2, duration: 0.15, type: 'sine', volume: 0.25 });
  }

  if (level >= 10) {
    configs.push({ frequency: baseFreq * 2.5, duration: 0.2, type: 'sine', volume: 0.3 });
  }

  return configs;
};

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSoundConfigs = useCallback((configs: SoundConfig[]) => {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      let startTime = ctx.currentTime;

      configs.forEach((config) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, startTime);

        if (config.endFrequency) {
          oscillator.frequency.exponentialRampToValueAtTime(
            config.endFrequency,
            startTime + config.duration
          );
        }

        const adjustedVolume = config.volume * soundVolume;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(adjustedVolume, startTime + 0.01);
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
  }, [getAudioContext, soundEnabled, soundVolume]);

  const playSound = useCallback((type: SoundType, options?: { comboLevel?: number }) => {
    if (!soundEnabled) return;

    if (type === 'combo' && options?.comboLevel) {
      playSoundConfigs(getComboConfig(options.comboLevel));
    } else {
      playSoundConfigs(SOUND_CONFIGS[type]);
    }
  }, [soundEnabled, playSoundConfigs]);

  return { playSound };
}
