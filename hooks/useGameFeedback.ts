'use client';

import { useCallback } from 'react';
import { useVoice } from './useVoice';
import { VOICE_MESSAGES } from '@/types/accessibility';

export function useGameFeedback() {
  const { speak, cancel } = useVoice();

  const feedbackCorrect = useCallback(() => {
    speak(VOICE_MESSAGES.correct, true);
  }, [speak]);

  const feedbackWrong = useCallback(() => {
    speak(VOICE_MESSAGES.wrong, true);
  }, [speak]);

  const feedbackGameStart = useCallback(() => {
    speak(VOICE_MESSAGES.gameStart, true);
  }, [speak]);

  const feedbackGameEnd = useCallback(() => {
    speak(VOICE_MESSAGES.gameEnd, true);
  }, [speak]);

  const feedbackCombo = useCallback((count: number) => {
    speak(`${count} ${VOICE_MESSAGES.combo}`, true);
  }, [speak]);

  const feedbackInstruction = useCallback((text: string) => {
    speak(text, true);
  }, [speak]);

  const feedbackScore = useCallback((score: number) => {
    if (score >= 90) {
      speak(VOICE_MESSAGES.excellent, true);
    } else if (score >= 50) {
      speak(VOICE_MESSAGES.good, true);
    } else {
      speak(VOICE_MESSAGES.tryAgain, true);
    }
  }, [speak]);

  return {
    feedbackCorrect,
    feedbackWrong,
    feedbackGameStart,
    feedbackGameEnd,
    feedbackCombo,
    feedbackInstruction,
    feedbackScore,
    cancelFeedback: cancel,
  };
}
