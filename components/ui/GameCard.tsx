'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GameConfig } from '@/types/game';

interface GameCardProps {
  game: GameConfig;
  index: number;
}

// Unified color scheme - Mint/Teal theme
const cardStyle = {
  bg: 'from-teal-50 to-cyan-50',
  border: '#99F6E4',
  shadow: 'rgba(45, 212, 191, 0.15)',
};

export function GameCard({ game, index }: GameCardProps) {

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
          className={`relative bg-gradient-to-br ${cardStyle.bg} rounded-3xl p-4
                     flex items-center gap-4 cursor-pointer
                     border-3 transition-all duration-300 touch-target
                     overflow-hidden group`}
          style={{
            borderColor: cardStyle.border,
            boxShadow: `0 4px 20px ${cardStyle.shadow}`,
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
                       shadow-inner overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5
                       border-2 border-primary/20"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated ring on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 border-2 border-primary"
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
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primary"
              >
                GO!
              </motion.span>
            </h3>
            <p className="text-sm text-text-secondary truncate">{game.description}</p>
          </div>

          {/* Play Arrow - Unified primary color */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md
                       bg-gradient-to-br from-primary to-primary-dark"
          >
            <span className="text-white text-lg font-bold ml-0.5">▶</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
