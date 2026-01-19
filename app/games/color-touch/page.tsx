'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameHeader, Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';
import { useGameFeedback } from '@/hooks';

type GameMode = 'normal' | 'reverse' | 'english';

interface ColorData {
  name: string;
  nameKo: string;
  hex: string;
}

const COLORS: ColorData[] = [
  { name: 'RED', nameKo: '빨간색', hex: '#FF6B6B' },
  { name: 'BLUE', nameKo: '파란색', hex: '#4ECDC4' },
  { name: 'YELLOW', nameKo: '노란색', hex: '#FFE66D' },
  { name: 'GREEN', nameKo: '초록색', hex: '#95E1A3' },
  { name: 'PURPLE', nameKo: '보라색', hex: '#A29BFE' },
  { name: 'ORANGE', nameKo: '주황색', hex: '#FFA502' },
];

interface ColorCircle {
  id: number;
  color: ColorData;
  x: number;
  y: number;
  size: number;
}

const generateCircles = (count: number = 6): ColorCircle[] => {
  const circles: ColorCircle[] = [];
  const usedPositions: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    let attempts = 0;

    do {
      x = 15 + Math.random() * 70;
      y = 10 + Math.random() * 70;
      attempts++;
    } while (
      attempts < 50 &&
      usedPositions.some(
        (pos) => Math.abs(pos.x - x) < 20 && Math.abs(pos.y - y) < 20
      )
    );

    usedPositions.push({ x, y });

    circles.push({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x,
      y,
      size: 56 + Math.random() * 16,
    });
  }

  return circles;
};

export default function ColorTouchGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const { feedbackCorrect, feedbackWrong, feedbackGameStart, feedbackInstruction } = useGameFeedback();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [mode, setMode] = useState<GameMode>('normal');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [targetColor, setTargetColor] = useState<ColorData | null>(null);
  const [circles, setCircles] = useState<ColorCircle[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getInstruction = useCallback(() => {
    if (!targetColor) return '';

    switch (mode) {
      case 'normal':
        return `${targetColor.nameKo}을 터치하세요!`;
      case 'reverse':
        return `${targetColor.nameKo} 말고 다른 색!`;
      case 'english':
        return `Touch ${targetColor.name}!`;
      default:
        return '';
    }
  }, [targetColor, mode]);

  const nextRound = useCallback(() => {
    const newTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(newTarget);
    setCircles(generateCircles(6));
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    startTimeRef.current = Date.now();
    feedbackGameStart();
    nextRound();
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    setResult({
      gameName: '색깔 터치',
      score,
      maxCombo,
      correctCount,
      wrongCount,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, correctCount, wrongCount, setResult, router]);

  // Speak instruction when target color changes
  useEffect(() => {
    if (gameState === 'playing' && targetColor) {
      const instruction = mode === 'normal'
        ? `${targetColor.nameKo}을 터치하세요`
        : mode === 'reverse'
          ? `${targetColor.nameKo} 말고 다른 색`
          : `Touch ${targetColor.name}`;
      feedbackInstruction(instruction);
    }
  }, [targetColor, gameState, mode, feedbackInstruction]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);

  const handleCircleClick = (circle: ColorCircle) => {
    if (gameState !== 'playing' || !targetColor) return;

    let isCorrect: boolean;

    if (mode === 'reverse') {
      isCorrect = circle.color.name !== targetColor.name;
    } else {
      isCorrect = circle.color.name === targetColor.name;
    }

    if (isCorrect) {
      const comboBonus = combo >= 3 ? 5 : 0;
      setScore((prev) => prev + 10 + comboBonus);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
      setCorrectCount((prev) => prev + 1);
      setFeedback({ type: 'correct', key: Date.now() });
      feedbackCorrect();
      nextRound();
    } else {
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });
      feedbackWrong();
      setCircles((prev) => prev.filter((c) => c.id !== circle.id));
    }

    setTimeout(() => setFeedback(null), 300);
  };

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl"
        >
          🎨
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">색깔 터치</h1>
        <p className="text-foreground/60 text-center">
          지시하는 색깔을 빠르게 터치해요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">게임 모드</label>
            <div className="flex gap-2">
              {[
                { key: 'normal' as const, icon: '🎯', label: '기본' },
                { key: 'reverse' as const, icon: '🔄', label: '반대' },
                { key: 'english' as const, icon: '🔤', label: '영어' },
              ].map((m) => (
                <motion.button
                  key={m.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode(m.key)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1
                    ${mode === m.key
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-foreground/60'
                    }`}
                >
                  <span>{m.icon}</span>
                  <span className="text-xs">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mode Description */}
          <div className="bg-white/80 rounded-xl p-3 text-sm text-center text-foreground/70">
            {mode === 'normal' && '지시한 색깔을 터치하세요'}
            {mode === 'reverse' && '지시한 색깔 외 다른 색을 터치하세요'}
            {mode === 'english' && '영어로 지시한 색깔을 터치하세요'}
          </div>

          <Button onClick={startGame} fullWidth size="lg">
            게임 시작
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <GameHeader title="색깔 터치" score={score} timeLeft={timeLeft} />

      {/* Instruction */}
      <motion.div
        key={targetColor?.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm py-4 px-6 text-center shadow-sm"
      >
        <div
          className="text-2xl font-bold"
          style={{ color: mode === 'reverse' ? '#2D3436' : targetColor?.hex }}
        >
          {getInstruction()}
        </div>
        {combo >= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-accent text-sm font-bold mt-1"
          >
            🔥 {combo} 콤보!
          </motion.div>
        )}
      </motion.div>

      {/* Game Area */}
      <div
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-background to-primary/5"
        role="application"
        aria-label="색깔 터치 게임 영역"
      >
        <AnimatePresence>
          {circles.map((circle) => (
            <motion.button
              key={circle.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCircleClick(circle)}
              className="absolute rounded-full shadow-lg touch-target-lg"
              aria-label={`${circle.color.nameKo} 색깔`}
              style={{
                left: `${circle.x}%`,
                top: `${circle.y}%`,
                width: Math.max(circle.size, 64),
                height: Math.max(circle.size, 64),
                backgroundColor: circle.color.hex,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.key}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className={`text-6xl ${feedback.type === 'correct' ? 'text-success' : 'text-error'}`}>
                {feedback.type === 'correct' ? '⭕' : '❌'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
