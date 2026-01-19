'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameHeader, Button, DifficultySelector } from '@/components/ui';
import { Difficulty } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

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

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

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

export default function MathPopGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
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
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextProblem = useCallback(() => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setBalloons(generateBalloons(newProblem.answer));
  }, [difficulty]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    startTimeRef.current = Date.now();
    nextProblem();
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
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
  }, [score, maxCombo, correctCount, wrongCount, setResult, router]);

  const handleBalloonTap = (balloon: Balloon) => {
    if (gameState !== 'playing' || !problem) return;

    if (balloon.value === problem.answer) {
      const comboBonus = combo >= 3 ? 5 : 0;
      setScore((prev) => prev + 10 + comboBonus);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
      setCorrectCount((prev) => prev + 1);
      setFeedback({ type: 'correct', key: Date.now() });
      setTimeout(() => nextProblem(), 500);
    } else {
      setLives((prev) => prev - 1);
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
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
  }, [gameState, problem, nextProblem]);

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl"
        >
          🧮
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
        {combo >= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-accent text-sm font-bold mt-1"
          >
            🔥 {combo} 콤보!
          </motion.div>
        )}
      </div>

      {/* Game Area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200">
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.button
              key={balloon.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleBalloonTap(balloon)}
              className="absolute w-16 h-20 flex items-center justify-center cursor-pointer touch-target"
              style={{
                left: balloon.x,
                top: balloon.y,
              }}
            >
              <svg viewBox="0 0 60 75" className="w-full h-full">
                <ellipse cx="30" cy="28" rx="26" ry="28" fill={balloon.color} />
                <polygon points="30,56 26,62 34,62" fill={balloon.color} />
                <path d="M30,62 Q32,68 30,75" stroke="#888" strokeWidth="1" fill="none" />
              </svg>
              <span className="absolute top-3 text-xl font-bold text-white drop-shadow-md">
                {balloon.value}
              </span>
            </motion.button>
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
              <div
                className={`text-6xl ${
                  feedback.type === 'correct' ? 'text-success' : 'text-error'
                }`}
              >
                {feedback.type === 'correct' ? '⭕' : '❌'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
