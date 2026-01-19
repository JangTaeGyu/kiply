'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  // Determine time warning state
  const isTimeWarning = timeLeft !== undefined && timeLeft <= 10;
  const isTimeCritical = timeLeft !== undefined && timeLeft <= 5;

  return (
    <div className="relative bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-lg border-b-2 border-primary-light/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-candy" />

      <div className="flex items-center gap-3">
        {/* Back Button */}
        {showBack && (
          <Link href="/" aria-label="홈으로 돌아가기">
            <motion.div
              whileTap={{ scale: 0.85, rotate: -10 }}
              whileHover={{ scale: 1.1 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-light/30 to-primary-light/10
                         flex items-center justify-center text-xl border-2 border-primary-light/50
                         shadow-sm hover:shadow-md transition-shadow"
            >
              <motion.span
                animate={{ x: [-2, 0, -2] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ←
              </motion.span>
            </motion.div>
          </Link>
        )}

        {/* Title with fun styling */}
        <div className="flex items-center gap-2">
          <motion.h1
            className="font-bold text-lg text-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {title}
          </motion.h1>
          <motion.span
            className="text-sm"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Timer */}
        {timeLeft !== undefined && (
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold
                       ${isTimeCritical
                         ? 'bg-error/20 text-error'
                         : isTimeWarning
                           ? 'bg-accent/20 text-accent-dark'
                           : 'bg-secondary-light/30 text-secondary-dark'
                       }`}
            animate={isTimeCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <motion.span
              animate={{ rotate: isTimeWarning ? [0, -20, 20, 0] : 0 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⏱️
            </motion.span>
            <span className="min-w-[28px] text-center">{timeLeft}s</span>
          </motion.div>
        )}

        {/* Lives */}
        {lives !== undefined && (
          <div className="flex gap-1 bg-error-light/30 px-2 py-1 rounded-full">
            {Array.from({ length: maxLives }).map((_, i) => (
              <AnimatePresence key={i} mode="wait">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{
                    scale: i < lives ? 1 : 0.7,
                    opacity: i < lives ? 1 : 0.3,
                  }}
                  exit={{ scale: 0, rotate: -30 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="text-lg"
                >
                  {i < lives ? '❤️' : '🤍'}
                </motion.span>
              </AnimatePresence>
            ))}
          </div>
        )}

        {/* Score Display */}
        <motion.div
          className="relative"
          key={score}
          initial={{ scale: 1.3, rotate: 5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {/* Score pop effect */}
          <AnimatePresence>
            {score > 0 && (
              <motion.div
                key={`pop-${score}`}
                initial={{ scale: 0.8, opacity: 1, y: 0 }}
                animate={{ scale: 1.5, opacity: 0, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-accent font-bold text-sm">+10</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gradient-candy text-white px-5 py-2 rounded-full font-bold
                         min-w-[70px] text-center shadow-candy border-2 border-white/30">
            <motion.span
              className="flex items-center justify-center gap-1"
            >
              <span className="text-sm">⭐</span>
              <span>{score}</span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
