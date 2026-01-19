'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameHeader, Button, DifficultySelector } from '@/components/ui';
import { Difficulty } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

interface Mole {
  id: number;
  value: number;
  isVisible: boolean;
  isHit: boolean;
}

interface Problem {
  text: string;
  answer: number;
}

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

const generateMoleValues = (answer: number): number[] => {
  const values = new Set<number>();
  values.add(answer);

  while (values.size < 9) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const newValue = Math.max(1, answer + offset);
    values.add(newValue);
  }

  return Array.from(values).sort(() => Math.random() - 0.5);
};

export default function MoleMathGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const initMoles = useCallback((answer: number) => {
    const values = generateMoleValues(answer);
    return values.map((value, index) => ({
      id: index,
      value,
      isVisible: false,
      isHit: false,
    }));
  }, []);

  const showRandomMoles = useCallback(() => {
    setMoles((prev) => {
      const hiddenMoles = prev.filter((m) => !m.isVisible && !m.isHit);
      const count = Math.min(3 + Math.floor(Math.random() * 2), hiddenMoles.length);
      const toShow = hiddenMoles.sort(() => Math.random() - 0.5).slice(0, count);
      const toShowIds = new Set(toShow.map((m) => m.id));

      return prev.map((mole) => ({
        ...mole,
        isVisible: toShowIds.has(mole.id) ? true : mole.isVisible,
      }));
    });
  }, []);

  const hideSomeMoles = useCallback(() => {
    setMoles((prev) => {
      const visibleMoles = prev.filter((m) => m.isVisible && !m.isHit);
      if (visibleMoles.length <= 2) return prev;

      const toHide = visibleMoles[Math.floor(Math.random() * visibleMoles.length)];
      return prev.map((mole) =>
        mole.id === toHide.id ? { ...mole, isVisible: false } : mole
      );
    });
  }, []);

  const nextProblem = useCallback(() => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setMoles(initMoles(newProblem.answer));

    setTimeout(() => showRandomMoles(), 300);
  }, [difficulty, initMoles, showRandomMoles]);

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
    if (moleTimerRef.current) {
      clearInterval(moleTimerRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setResult({
      gameName: '두더지 암산',
      score,
      maxCombo,
      correctCount,
      wrongCount,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, correctCount, wrongCount, setResult, router]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      endGame();
    }
  }, [lives, gameState, endGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    moleTimerRef.current = setInterval(() => {
      if (Math.random() > 0.5) {
        showRandomMoles();
      } else {
        hideSomeMoles();
      }
    }, 1200);

    return () => {
      if (moleTimerRef.current) {
        clearInterval(moleTimerRef.current);
      }
    };
  }, [gameState, showRandomMoles, hideSomeMoles]);

  const handleMoleClick = (mole: Mole) => {
    if (gameState !== 'playing' || !problem || !mole.isVisible || mole.isHit) return;

    if (mole.value === problem.answer) {
      const comboBonus = combo >= 3 ? 5 : 0;
      setScore((prev) => prev + 10 + comboBonus);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
      setCorrectCount((prev) => prev + 1);
      setFeedback({ type: 'correct', key: Date.now() });
      setMoles((prev) => prev.map((m) => (m.id === mole.id ? { ...m, isHit: true } : m)));

      setTimeout(() => {
        setFeedback(null);
        nextProblem();
      }, 800);
    } else {
      setLives((prev) => prev - 1);
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });
      setMoles((prev) => prev.map((m) => (m.id === mole.id ? { ...m, isVisible: false } : m)));

      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl"
        >
          🐹
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">두더지 암산</h1>
        <p className="text-foreground/60 text-center">
          정답을 들고 있는 두더지를 잡아요!
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
      <GameHeader title="두더지 암산" score={score} lives={lives} />

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

      {/* Game Area - Mole Grid */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-amber-100 to-amber-200">
        <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
          {moles.map((mole) => (
            <motion.button
              key={mole.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoleClick(mole)}
              className="aspect-square relative"
            >
              {/* Hole */}
              <div className="absolute inset-x-2 bottom-0 h-4 bg-amber-800 rounded-full" />
              <div className="absolute inset-x-4 bottom-1 h-3 bg-amber-900/50 rounded-full" />

              {/* Mole */}
              <AnimatePresence>
                {mole.isVisible && !mole.isHit && (
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-700">
                      <span className="text-white font-bold text-lg">{mole.value}</span>
                    </div>
                    <div className="text-2xl -mt-1">🐹</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hit effect */}
              {mole.isHit && (
                <motion.div
                  initial={{ scale: 1.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center text-4xl"
                >
                  ⭐
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className={`text-6xl ${feedback.type === 'correct' ? 'text-success' : 'text-error'}`}>
              {feedback.type === 'correct' ? '🎯' : '❌'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
