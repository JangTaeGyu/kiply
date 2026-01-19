'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GameHeader, Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GridSize = '4x3' | '4x4' | '5x4';

const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸'],
  fruits: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🍌', '🍉'],
  vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️'],
};

const GRID_CONFIGS: Record<GridSize, { cols: number; rows: number; pairs: number }> = {
  '4x3': { cols: 4, rows: 3, pairs: 6 },
  '4x4': { cols: 4, rows: 4, pairs: 8 },
  '5x4': { cols: 5, rows: 4, pairs: 10 },
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateCards = (gridSize: GridSize, theme: keyof typeof EMOJI_SETS): Card[] => {
  const { pairs } = GRID_CONFIGS[gridSize];
  const emojis = shuffleArray(EMOJI_SETS[theme]).slice(0, pairs);
  const cards: Card[] = [];

  emojis.forEach((emoji, index) => {
    cards.push(
      { id: index * 2, emoji, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
    );
  });

  return shuffleArray(cards);
};

export default function MemoryMatchGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [gridSize, setGridSize] = useState<GridSize>('4x3');
  const [theme, setTheme] = useState<keyof typeof EMOJI_SETS>('animals');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const startTimeRef = useRef<number>(0);

  const { pairs } = GRID_CONFIGS[gridSize];

  const startGame = () => {
    setGameState('playing');
    setCards(generateCards(gridSize, theme));
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setCombo(0);
    setMaxCombo(0);
    setMatchedPairs(0);
    startTimeRef.current = Date.now();
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    setResult({
      gameName: '짝꿍 찾기',
      score,
      maxCombo,
      correctCount: matchedPairs,
      wrongCount: moves - matchedPairs,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, matchedPairs, moves, setResult, router]);

  useEffect(() => {
    if (gameState === 'playing' && matchedPairs === pairs) {
      setTimeout(endGame, 1000);
    }
  }, [matchedPairs, pairs, gameState, endGame]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((max) => Math.max(max, newCombo));

        const comboBonus = newCombo >= 3 ? 5 : 0;
        setScore((prev) => prev + 10 + comboBonus);
        setMatchedPairs((prev) => prev + 1);
        setFeedback({ type: 'correct', key: Date.now() });

        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          )
        );

        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
          setFeedback(null);
        }, 500);
      } else {
        setCombo(0);
        setFeedback({ type: 'wrong', key: Date.now() });

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
          setFeedback(null);
        }, 1000);
      }
    }
  };

  if (gameState === 'ready') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Image
            src="/images/games/memory-match.svg"
            alt="짝꿍 찾기"
            width={96}
            height={96}
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">짝꿍 찾기</h1>
        <p className="text-foreground/60 text-center">
          같은 그림을 찾아서 짝을 맞춰봐요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          {/* Grid Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">카드 수</label>
            <div className="flex gap-2">
              {(Object.keys(GRID_CONFIGS) as GridSize[]).map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGridSize(size)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                    ${gridSize === size
                      ? 'bg-primary text-white'
                      : 'bg-white text-foreground/60'
                    }`}
                >
                  {size.replace('x', '×')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">테마</label>
            <div className="flex gap-2">
              {[
                { key: 'animals' as const, icon: '🐾', label: '동물' },
                { key: 'fruits' as const, icon: '🍎', label: '과일' },
                { key: 'vehicles' as const, icon: '🚗', label: '탈것' },
              ].map((t) => (
                <motion.button
                  key={t.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(t.key)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1
                    ${theme === t.key
                      ? 'bg-secondary text-white'
                      : 'bg-white text-foreground/60'
                    }`}
                >
                  <span>{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <Button onClick={startGame} fullWidth size="lg">
            게임 시작
          </Button>
        </div>
      </div>
    );
  }

  const { cols, rows } = GRID_CONFIGS[gridSize];

  return (
    <div className="flex-1 flex flex-col">
      <GameHeader title="짝꿍 찾기" score={score} />

      {/* Stats */}
      <div className="bg-white/80 backdrop-blur-sm py-2 px-4 flex justify-center gap-6 text-sm">
        <div className="text-foreground/60">
          시도: <span className="font-bold text-foreground">{moves}</span>
        </div>
        <div className="text-foreground/60">
          찾은 짝: <span className="font-bold text-success">{matchedPairs}/{pairs}</span>
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

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            maxWidth: cols <= 4 ? '320px' : '380px',
            width: '100%',
            aspectRatio: `${cols}/${rows}`,
          }}
        >
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: card.isFlipped || card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className="relative aspect-square touch-target"
            >
              <AnimatePresence mode="wait">
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl sm:text-3xl
                      ${card.isMatched
                        ? 'bg-success/20 border-2 border-success'
                        : 'bg-white border-2 border-primary/20'
                      }`}
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -180 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-white text-2xl shadow-md"
                  >
                    ?
                  </motion.div>
                )}
              </AnimatePresence>
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
              {feedback.type === 'correct' ? '👍' : '🤔'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
