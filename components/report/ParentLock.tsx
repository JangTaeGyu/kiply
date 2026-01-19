'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

interface ParentLockProps {
  onUnlock: () => void;
}

const generateMathProblem = (): { question: string; answer: number } => {
  const a = Math.floor(Math.random() * 10) + 10; // 10-19
  const b = Math.floor(Math.random() * 10) + 5;  // 5-14
  const operations = ['+', '-', '*'] as const;
  const op = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;

  switch (op) {
    case '+':
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '*':
      const smallA = Math.floor(Math.random() * 5) + 3; // 3-7
      const smallB = Math.floor(Math.random() * 5) + 2; // 2-6
      answer = smallA * smallB;
      question = `${smallA} × ${smallB}`;
      break;
  }

  return { question: question!, answer: answer! };
};

export function ParentLock({ onUnlock }: ParentLockProps) {
  const [problem, setProblem] = useState<{ question: string; answer: number } | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setProblem(generateMathProblem());
  }, []);

  const handleSubmit = () => {
    if (!problem) return;

    if (parseInt(input) === problem.answer) {
      onUnlock();
    } else {
      setError(true);
      setInput('');
      setProblem(generateMathProblem());
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!problem) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-primary/10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center"
      >
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-foreground mb-2">학부모 전용</h1>
        <p className="text-foreground/60 text-sm mb-6">
          아래 문제를 풀어서 잠금을 해제하세요
        </p>

        <div className="bg-primary/10 rounded-2xl p-4 mb-4">
          <p className="text-2xl font-bold text-primary">
            {problem.question} = ?
          </p>
        </div>

        <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="답을 입력하세요"
            className={`w-full text-center text-2xl py-4 rounded-xl border-2 outline-none transition-colors
              ${error ? 'border-error bg-error/10' : 'border-gray-200 focus:border-primary'}
            `}
            autoFocus
          />
        </motion.div>

        <Button onClick={handleSubmit} fullWidth className="mt-4">
          확인
        </Button>

        <p className="text-xs text-foreground/40 mt-4">
          이 화면은 아이가 쉽게 접근하지 못하도록
          <br />
          간단한 수학 문제로 보호되고 있어요
        </p>
      </motion.div>
    </div>
  );
}
