'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GameConfig } from '@/types/game';

interface GameCardProps {
  game: GameConfig;
  index: number;
}

// Color schemes for different game cards
const colorSchemes = [
  { bg: 'from-pink-50 to-rose-50', border: '#FFB3CC', shadow: 'rgba(255, 107, 157, 0.2)' },
  { bg: 'from-cyan-50 to-blue-50', border: '#7EEAFF', shadow: 'rgba(0, 212, 255, 0.2)' },
  { bg: 'from-amber-50 to-yellow-50', border: '#FFEB8A', shadow: 'rgba(255, 217, 61, 0.2)' },
  { bg: 'from-emerald-50 to-green-50', border: '#A8E6A3', shadow: 'rgba(107, 203, 119, 0.2)' },
  { bg: 'from-orange-50 to-amber-50', border: '#FFCBA4', shadow: 'rgba(255, 140, 140, 0.2)' },
  { bg: 'from-purple-50 to-violet-50', border: '#D4BFFF', shadow: 'rgba(176, 136, 249, 0.2)' },
  { bg: 'from-teal-50 to-cyan-50', border: '#7FDBDA', shadow: 'rgba(127, 219, 218, 0.2)' },
];

export function GameCard({ game, index }: GameCardProps) {
  const scheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <Link
        href={game.path}
        aria-label={`${game.nameKo} 게임 시작하기 - ${game.description}`}
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative bg-gradient-to-br ${scheme.bg} rounded-3xl p-4
                     flex items-center gap-4 cursor-pointer
                     border-3 transition-all duration-300 touch-target
                     overflow-hidden group`}
          style={{
            borderColor: scheme.border,
            boxShadow: `0 4px 20px ${scheme.shadow}`,
          }}
        >
          {/* Decorative sparkle on hover */}
          <motion.div
            className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ✨
          </motion.div>

          {/* Icon Container with SVG image */}
          <motion.div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center
                       shadow-inner overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${game.color}20 0%, ${game.color}10 100%)`,
              border: `2px solid ${game.color}30`,
            }}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated ring on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
              style={{
                border: `2px solid ${game.color}`,
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <Image
              src={game.iconImage}
              alt={game.nameKo}
              width={48}
              height={48}
              className="relative z-10 drop-shadow-sm"
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate flex items-center gap-2">
              {game.nameKo}
              <motion.span
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: game.color }}
              >
                GO!
              </motion.span>
            </h3>
            <p className="text-sm text-text-secondary truncate">{game.description}</p>
          </div>

          {/* Play Arrow with animation */}
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center
                       shadow-md"
            style={{
              background: `linear-gradient(135deg, ${game.color} 0%, ${game.color}CC 100%)`,
            }}
            whileHover={{ scale: 1.15 }}
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white text-lg font-bold ml-0.5">▶</span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
