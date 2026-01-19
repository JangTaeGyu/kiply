'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameHeader, Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';
import { Difficulty, DIFFICULTIES } from '@/types/game';

interface Shape {
  type: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';
  color: string;
  rotation: number;
}

interface Option {
  shape: Shape;
  isCorrect: boolean;
}

const SHAPES: Shape['type'][] = ['circle', 'square', 'triangle', 'star', 'hexagon'];

const COLORS = {
  easy: ['#FF6B6B'], // Red only
  medium: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'], // Multiple colors
  hard: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'],
};

const ROTATIONS = {
  easy: [0],
  medium: [0],
  hard: [0, 45, 90, 135, 180, 225, 270, 315],
};

const GAME_DURATION = 60;
const QUESTIONS_PER_GAME = 15;

const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateQuestion = (difficulty: Difficulty): { target: Shape; options: Option[] } => {
  const colors = COLORS[difficulty];
  const rotations = ROTATIONS[difficulty];

  // Generate target shape
  const target: Shape = {
    type: getRandomItem(SHAPES),
    color: getRandomItem(colors),
    rotation: getRandomItem(rotations),
  };

  // Generate options (including one correct answer)
  const options: Option[] = [];

  // Add correct answer
  options.push({ shape: { ...target }, isCorrect: true });

  // Add wrong answers
  while (options.length < 4) {
    let newShape: Shape;

    if (difficulty === 'easy') {
      // Easy: only shape changes
      newShape = {
        type: getRandomItem(SHAPES.filter((s) => s !== target.type)),
        color: target.color,
        rotation: 0,
      };
    } else if (difficulty === 'medium') {
      // Medium: shape or color can change
      const changeType = Math.random() > 0.5;
      if (changeType) {
        newShape = {
          type: getRandomItem(SHAPES.filter((s) => s !== target.type)),
          color: target.color,
          rotation: 0,
        };
      } else {
        newShape = {
          type: target.type,
          color: getRandomItem(colors.filter((c) => c !== target.color)),
          rotation: 0,
        };
      }
    } else {
      // Hard: shape, color, or rotation can change
      const changeType = Math.floor(Math.random() * 3);
      if (changeType === 0) {
        newShape = {
          type: getRandomItem(SHAPES.filter((s) => s !== target.type)),
          color: target.color,
          rotation: target.rotation,
        };
      } else if (changeType === 1) {
        newShape = {
          type: target.type,
          color: getRandomItem(colors.filter((c) => c !== target.color)),
          rotation: target.rotation,
        };
      } else {
        newShape = {
          type: target.type,
          color: target.color,
          rotation: getRandomItem(rotations.filter((r) => r !== target.rotation)),
        };
      }
    }

    // Check if this shape already exists in options
    const isDuplicate = options.some(
      (o) =>
        o.shape.type === newShape.type &&
        o.shape.color === newShape.color &&
        o.shape.rotation === newShape.rotation
    );

    if (!isDuplicate) {
      options.push({ shape: newShape, isCorrect: false });
    }
  }

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { target, options };
};

const ShapeSVG = ({ shape, size = 80 }: { shape: Shape; size?: number }) => {
  const { type, color, rotation } = shape;

  const renderShape = () => {
    switch (type) {
      case 'circle':
        return <circle cx="50" cy="50" r="40" fill={color} />;
      case 'square':
        return <rect x="15" y="15" width="70" height="70" fill={color} />;
      case 'triangle':
        return <polygon points="50,10 90,90 10,90" fill={color} />;
      case 'star':
        return (
          <polygon
            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
            fill={color}
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="50,5 90,27 90,73 50,95 10,73 10,27"
            fill={color}
          />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {renderShape()}
    </svg>
  );
};

export default function ShapeMatchGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [question, setQuestion] = useState<{ target: Shape; options: Option[] } | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const startTimeRef = useRef<number>(0);

  const nextQuestion = useCallback(() => {
    if (questionCount >= QUESTIONS_PER_GAME) {
      endGame();
      return;
    }
    setQuestion(generateQuestion(difficulty));
    setQuestionCount((prev) => prev + 1);
  }, [difficulty, questionCount]);

  const endGame = useCallback(() => {
    setGameState('ended');
    const timeSpent = GAME_DURATION - timeLeft;

    setResult({
      gameName: '도형 맞추기',
      score,
      maxCombo,
      correctCount,
      wrongCount,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, correctCount, wrongCount, timeLeft, setResult, router]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setQuestionCount(0);
    setTimeLeft(GAME_DURATION);
    startTimeRef.current = Date.now();
    setQuestion(generateQuestion(difficulty));
    setQuestionCount(1);
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  const handleAnswer = (option: Option) => {
    if (option.isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((max) => Math.max(max, newCombo));
      setCorrectCount((prev) => prev + 1);

      // Score: 10 base + 5 combo bonus for combo >= 3
      const comboBonus = newCombo >= 3 ? 5 : 0;
      setScore((prev) => prev + 10 + comboBonus);
      setFeedback({ type: 'correct', key: Date.now() });
    } else {
      setCombo(0);
      setWrongCount((prev) => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });
    }

    setTimeout(() => {
      setFeedback(null);
      if (questionCount < QUESTIONS_PER_GAME) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 500);
  };

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl"
        >
          🔷
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">도형 맞추기</h1>
        <p className="text-foreground/60 text-center">
          위에 있는 도형과 똑같은 도형을 찾아요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">난이도</label>
            <div className="flex gap-2">
              {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1
                    ${difficulty === d
                      ? 'bg-primary text-white'
                      : 'bg-white text-foreground/60'
                    }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: DIFFICULTIES[d].stars }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <span>{DIFFICULTIES[d].label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 text-center text-sm text-foreground/60">
            {difficulty === 'easy' && '기본 도형만 나와요'}
            {difficulty === 'medium' && '색깔이 추가돼요'}
            {difficulty === 'hard' && '회전까지 구분해야 해요'}
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
      <GameHeader title="도형 맞추기" score={score} />

      {/* Stats */}
      <div className="bg-white/80 backdrop-blur-sm py-2 px-4 flex justify-center gap-6 text-sm">
        <div className="text-foreground/60">
          시간: <span className="font-bold text-foreground">{timeLeft}초</span>
        </div>
        <div className="text-foreground/60">
          문제: <span className="font-bold text-success">{questionCount}/{QUESTIONS_PER_GAME}</span>
        </div>
        {combo >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-accent font-bold"
          >
            🔥 {combo} 콤보!
          </motion.div>
        )}
      </div>

      {question && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
          {/* Target Shape */}
          <motion.div
            key={questionCount}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <p className="text-center text-foreground/60 text-sm mb-3">이 도형을 찾아요!</p>
            <div className="flex justify-center">
              <ShapeSVG shape={question.target} size={100} />
            </div>
          </motion.div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-center aspect-square touch-target hover:shadow-xl transition-shadow"
              >
                <ShapeSVG shape={option.shape} size={80} />
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
              {feedback.type === 'correct' ? '👍' : '😢'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
