'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { GameHeader, Button, DifficultySelector } from '@/components/ui';
import { Difficulty } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { useSound } from '@/hooks';

interface Balloon {
  id: number;
  value: number;
  x: number;
  y: number;
  color: string;
  speed: number;
}

interface Problem {
  text: string;
  answer: number;
}

interface FloatingScore {
  id: number;
  value: number;
  x: number;
  y: number;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

// Convert hex color to RGB for confetti
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 255, 255];
};

const generateProblem = (difficulty: Difficulty): Problem => {
  let a: number, b: number, answer: number, text: string;

  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a + b;
    text = `${a} + ${b} = ?`;
  } else if (difficulty === 'medium') {
    const isAddition = Math.random() > 0.5;
    if (isAddition) {
      a = Math.floor(Math.random() * 15) + 1;
      b = Math.floor(Math.random() * 15) + 1;
      answer = a + b;
      text = `${a} + ${b} = ?`;
    } else {
      a = Math.floor(Math.random() * 15) + 5;
      b = Math.floor(Math.random() * Math.min(a, 15)) + 1;
      answer = a - b;
      text = `${a} - ${b} = ?`;
    }
  } else {
    a = Math.floor(Math.random() * 8) + 2;
    b = Math.floor(Math.random() * 8) + 2;
    answer = a * b;
    text = `${a} × ${b} = ?`;
  }

  return { text, answer };
};

const generateBalloons = (answer: number, count: number = 6): Balloon[] => {
  const balloons: Balloon[] = [];
  const values = new Set<number>();
  values.add(answer);

  while (values.size < count) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const newValue = Math.max(0, answer + offset);
    if (newValue !== answer || values.size === 0) {
      values.add(newValue);
    }
  }

  const valuesArray = Array.from(values).sort(() => Math.random() - 0.5);
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 80 : 300;

  valuesArray.forEach((value, index) => {
    balloons.push({
      id: Date.now() + index,
      value,
      x: Math.random() * containerWidth,
      y: -60 - Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.5 + Math.random() * 0.5,
    });
  });

  return balloons;
};

const generateClouds = (): Cloud[] => {
  const clouds: Cloud[] = [];
  for (let i = 0; i < 5; i++) {
    clouds.push({
      id: i,
      x: Math.random() * 100,
      y: 10 + Math.random() * 40,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.02 + Math.random() * 0.03,
      opacity: 0.4 + Math.random() * 0.3,
    });
  }
  return clouds;
};

// Floating Score Component
const FloatingScoreDisplay = ({ score, x, y }: { score: number; x: number; y: number }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 0.5 }}
    animate={{ opacity: 0, y: -60, scale: 1.2 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="absolute pointer-events-none z-20 font-bold text-2xl"
    style={{ left: x, top: y }}
  >
    <span className={score > 10 ? 'text-yellow-500' : 'text-green-500'}>
      +{score}
    </span>
  </motion.div>
);

// Enhanced Combo Display Component
const ComboDisplay = ({ combo }: { combo: number }) => {
  if (combo < 3) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      className="relative"
    >
      <span className="text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        🔥 {combo} 콤보!
      </span>
      {combo >= 5 && (
        <motion.span
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="absolute -top-1 -right-2 text-xs"
        >
          ✨
        </motion.span>
      )}
      {combo >= 10 && (
        <>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute -top-2 -left-2 text-xs"
          >
            💥
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.25, repeat: Infinity, delay: 0.1 }}
            className="absolute -bottom-1 -right-3 text-xs"
          >
            ⚡
          </motion.span>
        </>
      )}
    </motion.div>
  );
};

// Cloud Component
const CloudSvg = ({ opacity }: { opacity: number }) => (
  <svg viewBox="0 0 100 60" className="w-full h-full" style={{ opacity }}>
    <ellipse cx="50" cy="40" rx="30" ry="18" fill="white" />
    <ellipse cx="30" cy="38" rx="22" ry="14" fill="white" />
    <ellipse cx="70" cy="38" rx="22" ry="14" fill="white" />
    <ellipse cx="40" cy="30" rx="18" ry="12" fill="white" />
    <ellipse cx="60" cy="30" rx="18" ry="12" fill="white" />
  </svg>
);

export default function MathPopGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const { playSound } = useSound();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const animationRef = useRef<number | null>(null);
  const cloudAnimationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameAreaControls = useAnimation();

  // Initialize clouds
  useEffect(() => {
    setClouds(generateClouds());
  }, []);

  // Cloud animation
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animateClouds = () => {
      setClouds((prev) =>
        prev.map((cloud) => ({
          ...cloud,
          x: cloud.x > 110 ? -20 : cloud.x + cloud.speed,
        }))
      );
      cloudAnimationRef.current = requestAnimationFrame(animateClouds);
    };

    cloudAnimationRef.current = requestAnimationFrame(animateClouds);

    return () => {
      if (cloudAnimationRef.current) {
        cancelAnimationFrame(cloudAnimationRef.current);
      }
    };
  }, [gameState]);

  // Trigger confetti effect
  const triggerConfetti = useCallback((x: number, y: number, color: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = (x + 32) / rect.width;
    const normalizedY = (y + 40) / window.innerHeight;

    const rgb = hexToRgb(color);
    const colors = [
      color,
      `rgb(${Math.min(255, rgb[0] + 50)}, ${Math.min(255, rgb[1] + 50)}, ${Math.min(255, rgb[2] + 50)})`,
      `rgb(${Math.max(0, rgb[0] - 50)}, ${Math.max(0, rgb[1] - 50)}, ${Math.max(0, rgb[2] - 50)})`,
    ];

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: normalizedX, y: normalizedY },
      colors,
      ticks: 50,
      gravity: 1.5,
      scalar: 0.8,
      drift: 0,
    });
  }, []);

  // Trigger star burst for correct answers
  const triggerStarBurst = useCallback((x: number, y: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = (x + 32) / rect.width;
    const normalizedY = (y + 40) / window.innerHeight;

    confetti({
      particleCount: 15,
      spread: 360,
      origin: { x: normalizedX, y: normalizedY },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FFFF00'],
      ticks: 40,
      gravity: 0.8,
      scalar: 1,
    });
  }, []);

  // Screen shake effect
  const triggerShake = useCallback(async () => {
    setIsShaking(true);
    await gameAreaControls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });
    setIsShaking(false);
  }, [gameAreaControls]);

  // Add floating score
  const addFloatingScore = useCallback((value: number, x: number, y: number) => {
    const id = Date.now();
    setFloatingScores((prev) => [...prev, { id, value, x, y }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== id));
    }, 800);
  }, []);

  const nextProblem = useCallback(() => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setBalloons(generateBalloons(newProblem.answer));
  }, [difficulty]);

  const startGame = () => {
    playSound('click');
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFloatingScores([]);
    startTimeRef.current = Date.now();
    nextProblem();
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    playSound('gameOver');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (cloudAnimationRef.current) {
      cancelAnimationFrame(cloudAnimationRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setResult({
      gameName: '숫자 팡팡',
      score,
      maxCombo,
      correctCount,
      wrongCount,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, correctCount, wrongCount, setResult, router, playSound]);

  const handleBalloonTap = (balloon: Balloon) => {
    if (gameState !== 'playing' || !problem) return;

    // Pop sound for any balloon tap
    playSound('pop');

    if (balloon.value === problem.answer) {
      const comboBonus = combo >= 3 ? 5 : 0;
      const earnedScore = 10 + comboBonus;

      setScore((prev) => prev + earnedScore);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        // Play combo sound for 3+ combos
        if (newCombo >= 3) {
          playSound('combo', { comboLevel: newCombo });
        }
        return newCombo;
      });
      setCorrectCount((prev) => prev + 1);
      setFeedback({ type: 'correct', key: Date.now() });

      // Correct sound
      playSound('correct');

      // Visual effects
      triggerConfetti(balloon.x, balloon.y, balloon.color);
      triggerStarBurst(balloon.x, balloon.y);
      addFloatingScore(earnedScore, balloon.x, balloon.y);

      setTimeout(() => nextProblem(), 500);
    } else {
      setLives((prev) => prev - 1);
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

      // Wrong sound
      playSound('wrong');

      // Shake effect
      triggerShake();
    }

    setTimeout(() => setFeedback(null), 500);
  };

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      endGame();
    }
  }, [lives, gameState, endGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const containerHeight = containerRef.current?.clientHeight || 500;

    const animate = () => {
      setBalloons((prev) => {
        const updated = prev.map((balloon) => ({
          ...balloon,
          y: balloon.y + balloon.speed,
        }));

        const escaped = updated.filter((b) => b.y > containerHeight);
        if (escaped.some((b) => b.value === problem?.answer)) {
          setLives((l) => Math.max(0, l - 1));
          setCombo(0);
          triggerShake();
          nextProblem();
          return [];
        }

        return updated.filter((b) => b.y <= containerHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, problem, nextProblem, triggerShake]);

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Image
            src="/images/games/math-pop.svg"
            alt="숫자 팡팡"
            width={96}
            height={96}
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">숫자 팡팡</h1>
        <p className="text-foreground/60 text-center">
          문제의 정답이 적힌 풍선을 터뜨려요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
          <Button onClick={startGame} fullWidth size="lg">
            게임 시작
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <GameHeader title="숫자 팡팡" score={score} lives={lives} />

      {/* Problem Display */}
      <div className="bg-white/90 backdrop-blur-sm py-4 px-6 text-center shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem?.text}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-3xl font-bold text-primary"
          >
            {problem?.text}
          </motion.div>
        </AnimatePresence>
        <div className="mt-1 h-6">
          <ComboDisplay combo={combo} />
        </div>
      </div>

      {/* Game Area */}
      <motion.div
        ref={containerRef}
        animate={gameAreaControls}
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-sky-50"
      >
        {/* Animated Clouds */}
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute pointer-events-none"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: `${80 * cloud.scale}px`,
              height: `${50 * cloud.scale}px`,
              transform: `scale(${cloud.scale})`,
            }}
          >
            <CloudSvg opacity={cloud.opacity} />
          </div>
        ))}

        {/* Balloons */}
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.button
              key={balloon.id}
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: [0, -3, 3, 0],
              }}
              exit={{
                scale: [1, 1.3, 0],
                opacity: [1, 1, 0],
                rotate: [0, 15, -15],
                transition: { duration: 0.3 },
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                },
              }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleBalloonTap(balloon)}
              className="absolute w-16 h-20 flex items-center justify-center cursor-pointer touch-target z-10"
              style={{
                left: balloon.x,
                top: balloon.y,
              }}
            >
              <svg viewBox="0 0 60 75" className="w-full h-full drop-shadow-lg">
                <defs>
                  <radialGradient id={`balloon-${balloon.id}`} cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor={balloon.color} stopOpacity="1" />
                  </radialGradient>
                </defs>
                <ellipse cx="30" cy="28" rx="26" ry="28" fill={`url(#balloon-${balloon.id})`} />
                <ellipse cx="22" cy="18" rx="6" ry="4" fill="white" fillOpacity="0.5" />
                <polygon points="30,56 26,62 34,62" fill={balloon.color} />
                <path d="M30,62 Q32,68 30,75" stroke="#888" strokeWidth="1.5" fill="none" />
              </svg>
              <span className="absolute top-3 text-xl font-bold text-white drop-shadow-md">
                {balloon.value}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Floating Scores */}
        <AnimatePresence>
          {floatingScores.map((fs) => (
            <FloatingScoreDisplay key={fs.id} score={fs.value} x={fs.x} y={fs.y} />
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
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <motion.div
                animate={feedback.type === 'correct' ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {
                  x: [0, -10, 10, -10, 10, 0],
                }}
                transition={{ duration: 0.4 }}
                className={`text-7xl ${
                  feedback.type === 'correct' ? 'text-success' : 'text-error'
                }`}
              >
                {feedback.type === 'correct' ? '⭕' : '❌'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
