'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameHeaderProps {
  title: string;
  score: number;
  lives?: number;
  maxLives?: number;
  timeLeft?: number;
  showBack?: boolean;
}

export function GameHeader({
  title,
  score,
  lives,
  maxLives = 3,
  timeLeft,
  showBack = true,
}: GameHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-xl"
            >
              ←
            </motion.div>
          </Link>
        )}
        <h1 className="font-bold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {timeLeft !== undefined && (
          <div className="flex items-center gap-1 text-accent font-bold">
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        )}

        {lives !== undefined && (
          <div className="flex gap-0.5">
            {Array.from({ length: maxLives }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                className="text-lg"
              >
                ❤️
              </motion.span>
            ))}
          </div>
        )}

        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-primary text-white px-4 py-1.5 rounded-full font-bold min-w-[60px] text-center"
        >
          {score}
        </motion.div>
      </div>
    </div>
  );
}
