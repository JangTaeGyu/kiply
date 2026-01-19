'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GameHeader, Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';

interface ColorButton {
  id: number;
  color: string;
  activeColor: string;
  name: string;
}

const COLORS: ColorButton[] = [
  { id: 0, color: '#EF4444', activeColor: '#FCA5A5', name: '빨강' },
  { id: 1, color: '#3B82F6', activeColor: '#93C5FD', name: '파랑' },
  { id: 2, color: '#EAB308', activeColor: '#FDE047', name: '노랑' },
  { id: 3, color: '#22C55E', activeColor: '#86EFAC', name: '초록' },
];

type GamePhase = 'ready' | 'showing' | 'input' | 'success' | 'fail' | 'ended';

export default function SequenceGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [highestRound, setHighestRound] = useState(0);
  const [lives, setLives] = useState(3);
  const startTimeRef = useRef<number>(0);
  const showingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    setSequence((prev) => [...prev, newColor]);
  }, []);

  const showSequence = useCallback(async () => {
    setPhase('showing');
    setPlayerInput([]);

    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => {
        showingTimeoutRef.current = setTimeout(() => {
          setActiveButton(sequence[i]);
          setTimeout(() => {
            setActiveButton(null);
            resolve(null);
          }, 400);
        }, i === 0 ? 500 : 600);
      });
    }

    setTimeout(() => {
      setPhase('input');
    }, 300);
  }, [sequence]);

  const startGame = () => {
    setGameState('playing');
    setPhase('ready');
    setSequence([]);
    setPlayerInput([]);
    setScore(0);
    setRound(0);
    setHighestRound(0);
    setLives(3);
    startTimeRef.current = Date.now();

    setTimeout(() => {
      const firstColor = Math.floor(Math.random() * 4);
      setSequence([firstColor]);
      setRound(1);
    }, 500);
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    setPhase('ended');

    if (showingTimeoutRef.current) {
      clearTimeout(showingTimeoutRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setResult({
      gameName: '순서 맞추기',
      score,
      maxCombo: highestRound,
      correctCount: highestRound,
      wrongCount: 3 - lives,
      timeSpent,
    });

    router.push('/result');
  }, [score, highestRound, lives, setResult, router]);

  useEffect(() => {
    if (sequence.length > 0 && gameState === 'playing' && phase !== 'showing') {
      showSequence();
    }
  }, [sequence.length, gameState]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setPhase('fail');
      setTimeout(endGame, 1500);
    }
  }, [lives, gameState, endGame]);

  const handleButtonClick = (colorId: number) => {
    if (phase !== 'input') return;

    setActiveButton(colorId);
    setTimeout(() => setActiveButton(null), 200);

    const newInput = [...playerInput, colorId];
    setPlayerInput(newInput);

    const currentIndex = newInput.length - 1;

    if (sequence[currentIndex] !== colorId) {
      // Wrong!
      setPhase('fail');
      setLives((prev) => prev - 1);

      if (lives > 1) {
        setTimeout(() => {
          setPlayerInput([]);
          showSequence();
        }, 1000);
      }
      return;
    }

    if (newInput.length === sequence.length) {
      // Correct sequence!
      setPhase('success');
      const roundScore = sequence.length * 10;
      setScore((prev) => prev + roundScore);
      setHighestRound((prev) => Math.max(prev, sequence.length));

      setTimeout(() => {
        setRound((prev) => prev + 1);
        addToSequence();
      }, 1000);
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
            src="/images/games/sequence.svg"
            alt="순서 맞추기"
            width={96}
            height={96}
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">순서 맞추기</h1>
        <p className="text-foreground/60 text-center">
          불빛이 켜진 순서를 기억하고 따라해요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          <div className="bg-white/80 rounded-xl p-4 text-sm text-foreground/70 space-y-2">
            <p>1. 색깔 버튼이 순서대로 빛나요</p>
            <p>2. 같은 순서로 버튼을 눌러요</p>
            <p>3. 라운드마다 순서가 하나씩 늘어나요</p>
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
      <GameHeader title="순서 맞추기" score={score} lives={lives} />

      {/* Status */}
      <div className="bg-white/80 backdrop-blur-sm py-3 px-4 flex justify-center gap-6 text-sm">
        <div className="text-foreground/60">
          라운드: <span className="font-bold text-primary">{round}</span>
        </div>
        <div className="text-foreground/60">
          패턴 길이: <span className="font-bold text-secondary">{sequence.length}</span>
        </div>
      </div>

      {/* Phase Message */}
      <div className="py-4 text-center">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-bold ${
            phase === 'showing'
              ? 'text-primary'
              : phase === 'input'
              ? 'text-secondary'
              : phase === 'success'
              ? 'text-success'
              : phase === 'fail'
              ? 'text-error'
              : 'text-foreground'
          }`}
        >
          {phase === 'showing' && '잘 보세요! 👀'}
          {phase === 'input' && '따라 해보세요! 👆'}
          {phase === 'success' && '잘했어요! 🎉'}
          {phase === 'fail' && '다시 도전! 💪'}
        </motion.p>

        {/* Progress dots */}
        {phase === 'input' && (
          <div className="flex justify-center gap-2 mt-2">
            {sequence.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index < playerInput.length
                    ? 'bg-success scale-110'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Color Buttons */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
          {COLORS.map((color) => (
            <motion.button
              key={color.id}
              whileTap={{ scale: phase === 'input' ? 0.95 : 1 }}
              onClick={() => handleButtonClick(color.id)}
              disabled={phase !== 'input'}
              className="aspect-square rounded-3xl shadow-lg transition-all duration-150 touch-target"
              style={{
                backgroundColor:
                  activeButton === color.id ? color.activeColor : color.color,
                boxShadow:
                  activeButton === color.id
                    ? `0 0 30px ${color.activeColor}`
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                transform: activeButton === color.id ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
