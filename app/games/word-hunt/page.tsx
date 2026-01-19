'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameHeader, Button } from '@/components/ui';
import { Difficulty, DIFFICULTIES } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

interface WordData {
  word: string;
  hint: string;
  image: string;
}

const WORDS: Record<Difficulty, WordData[]> = {
  easy: [
    { word: '사과', hint: '빨간 과일', image: '🍎' },
    { word: '바나나', hint: '노란 과일', image: '🍌' },
    { word: '포도', hint: '보라색 과일', image: '🍇' },
    { word: '수박', hint: '여름 과일', image: '🍉' },
    { word: '딸기', hint: '빨간 작은 과일', image: '🍓' },
    { word: '고양이', hint: '야옹 울어요', image: '🐱' },
    { word: '강아지', hint: '멍멍 울어요', image: '🐶' },
    { word: '토끼', hint: '귀가 길어요', image: '🐰' },
    { word: '사자', hint: '동물의 왕', image: '🦁' },
    { word: '코끼리', hint: '코가 길어요', image: '🐘' },
  ],
  medium: [
    { word: '햄버거', hint: '패스트푸드', image: '🍔' },
    { word: '아이스크림', hint: '차가운 간식', image: '🍦' },
    { word: '비행기', hint: '하늘을 날아요', image: '✈️' },
    { word: '자동차', hint: '도로를 달려요', image: '🚗' },
    { word: '해바라기', hint: '해를 따라가요', image: '🌻' },
    { word: '무지개', hint: '비 온 뒤 나타나요', image: '🌈' },
    { word: '컴퓨터', hint: '일할 때 써요', image: '💻' },
    { word: '크리스마스', hint: '12월 25일', image: '🎄' },
  ],
  hard: [
    { word: 'APPLE', hint: '사과', image: '🍎' },
    { word: 'BANANA', hint: '바나나', image: '🍌' },
    { word: 'CAT', hint: '고양이', image: '🐱' },
    { word: 'DOG', hint: '강아지', image: '🐶' },
    { word: 'ELEPHANT', hint: '코끼리', image: '🐘' },
    { word: 'FLOWER', hint: '꽃', image: '🌸' },
    { word: 'RAINBOW', hint: '무지개', image: '🌈' },
    { word: 'STAR', hint: '별', image: '⭐' },
  ],
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateLetters = (word: string): { letter: string; id: number }[] => {
  const letters = word.split('').map((letter, index) => ({
    letter,
    id: index,
  }));

  // Add some decoy letters
  const decoyCount = Math.min(3, Math.floor(word.length / 2));
  const decoys = word.length <= 3
    ? ['ㄱ', 'ㄴ', 'ㅁ', 'ㅇ', 'ㅎ']
    : ['A', 'B', 'C', 'X', 'Y', 'Z'];

  for (let i = 0; i < decoyCount; i++) {
    letters.push({
      letter: decoys[Math.floor(Math.random() * decoys.length)],
      id: word.length + i,
    });
  }

  return shuffleArray(letters);
};

export default function WordHuntGame() {
  const router = useRouter();
  const { setResult } = useGameStore();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [letters, setLetters] = useState<{ letter: string; id: number; used: boolean }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; id: number }[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; key: number } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const startTimeRef = useRef<number>(0);
  const totalRounds = 5;

  const getNextWord = useCallback(() => {
    const availableWords = WORDS[difficulty].filter(w => !usedWords.has(w.word));
    if (availableWords.length === 0) {
      return WORDS[difficulty][Math.floor(Math.random() * WORDS[difficulty].length)];
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }, [difficulty, usedWords]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(1);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setHintsUsed(0);
    setUsedWords(new Set());
    startTimeRef.current = Date.now();

    const word = getNextWord();
    setCurrentWord(word);
    setLetters(generateLetters(word.word).map(l => ({ ...l, used: false })));
    setSelectedLetters([]);
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    setResult({
      gameName: '단어 퍼즐',
      score,
      maxCombo,
      correctCount,
      wrongCount,
      timeSpent,
    });

    router.push('/result');
  }, [score, maxCombo, correctCount, wrongCount, setResult, router]);

  const nextRound = useCallback(() => {
    if (round >= totalRounds) {
      endGame();
      return;
    }

    const word = getNextWord();
    setCurrentWord(word);
    setUsedWords(prev => new Set(prev).add(word.word));
    setLetters(generateLetters(word.word).map(l => ({ ...l, used: false })));
    setSelectedLetters([]);
    setRound(prev => prev + 1);
  }, [round, getNextWord, endGame]);

  const handleLetterClick = (letter: { letter: string; id: number }) => {
    if (!currentWord) return;

    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    setLetters(prev => prev.map(l => l.id === letter.id ? { ...l, used: true } : l));

    const currentInput = newSelected.map(l => l.letter).join('');

    if (currentInput === currentWord.word) {
      // Correct!
      const comboBonus = combo >= 3 ? 5 : 0;
      setScore(prev => prev + 10 + comboBonus);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      setCorrectCount(prev => prev + 1);
      setFeedback({ type: 'correct', key: Date.now() });

      setTimeout(() => {
        setFeedback(null);
        nextRound();
      }, 1000);
    } else if (currentInput.length === currentWord.word.length) {
      // Wrong - full word entered but incorrect
      setCombo(0);
      setWrongCount(prev => prev + 1);
      setFeedback({ type: 'wrong', key: Date.now() });

      setTimeout(() => {
        setFeedback(null);
        setLetters(prev => prev.map(l => ({ ...l, used: false })));
        setSelectedLetters([]);
      }, 800);
    } else if (!currentWord.word.startsWith(currentInput)) {
      // Wrong path - reset
      setFeedback({ type: 'wrong', key: Date.now() });

      setTimeout(() => {
        setFeedback(null);
        setLetters(prev => prev.map(l => ({ ...l, used: false })));
        setSelectedLetters([]);
      }, 500);
    }
  };

  const handleUndo = () => {
    if (selectedLetters.length === 0) return;

    const lastLetter = selectedLetters[selectedLetters.length - 1];
    setSelectedLetters(prev => prev.slice(0, -1));
    setLetters(prev => prev.map(l => l.id === lastLetter.id ? { ...l, used: false } : l));
  };

  const handleHint = () => {
    if (!currentWord || hintsUsed >= 2) return;

    const nextIndex = selectedLetters.length;
    if (nextIndex >= currentWord.word.length) return;

    const nextLetter = currentWord.word[nextIndex];
    const letterToSelect = letters.find(l => l.letter === nextLetter && !l.used);

    if (letterToSelect) {
      handleLetterClick(letterToSelect);
      setHintsUsed(prev => prev + 1);
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
          🔤
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">단어 퍼즐</h1>
        <p className="text-foreground/60 text-center">
          흩어진 글자를 모아 단어를 완성해요!
        </p>

        <div className="w-full max-w-xs space-y-4">
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-inner">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => {
              const config = DIFFICULTIES[diff];
              const isSelected = difficulty === diff;
              return (
                <motion.button
                  key={diff}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isSelected ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs">{'⭐'.repeat(config.stars)}</span>
                    <span>{config.label}</span>
                  </div>
                </motion.button>
              );
            })}
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
      <GameHeader title="단어 퍼즐" score={score} />

      {/* Round Info */}
      <div className="bg-white/80 backdrop-blur-sm py-2 px-4 flex justify-center gap-6 text-sm">
        <div className="text-foreground/60">
          라운드: <span className="font-bold text-foreground">{round}/{totalRounds}</span>
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

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {/* Image Hint */}
        <motion.div
          key={currentWord?.word}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl"
        >
          {currentWord?.image}
        </motion.div>

        {/* Text Hint */}
        <p className="text-foreground/60 text-sm">힌트: {currentWord?.hint}</p>

        {/* Selected Letters */}
        <div className="flex gap-2 min-h-[56px] items-center">
          {currentWord?.word.split('').map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                ${selectedLetters[index]
                  ? 'bg-primary text-white'
                  : 'bg-white border-2 border-dashed border-primary/30'
                }`}
            >
              {selectedLetters[index]?.letter || ''}
            </motion.div>
          ))}
        </div>

        {/* Available Letters */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {letters.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => !item.used && handleLetterClick(item)}
              disabled={item.used}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                transition-all touch-target
                ${item.used
                  ? 'bg-gray-200 text-gray-400 scale-90'
                  : 'bg-secondary text-white shadow-md hover:brightness-110'
                }`}
            >
              {item.letter}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={handleUndo}
            disabled={selectedLetters.length === 0}
          >
            ↩️ 되돌리기
          </Button>
          <Button
            variant="accent"
            onClick={handleHint}
            disabled={hintsUsed >= 2}
          >
            💡 힌트 ({2 - hintsUsed})
          </Button>
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
              {feedback.type === 'correct' ? '🎉' : '🤔'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
