'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GameConfig } from '@/types/game';

interface GameCardProps {
  game: GameConfig;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={game.path}
        aria-label={`${game.nameKo} 게임 시작하기 - ${game.description}`}
      >
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-5 shadow-lg shadow-black/5
                     flex items-center gap-4 cursor-pointer
                     border-2 border-transparent hover:border-primary/20
                     transition-colors touch-target focus-within-highlight"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${game.color}20` }}
            aria-hidden="true"
          >
            {game.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground">{game.nameKo}</h3>
            <p className="text-sm text-text-secondary">{game.description}</p>
          </div>
          <div className="text-2xl text-text-muted" aria-hidden="true">›</div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
