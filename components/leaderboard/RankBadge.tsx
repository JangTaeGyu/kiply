'use client';

import { motion } from 'framer-motion';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

const RANK_STYLES: Record<number, { bg: string; emoji: string; color: string }> = {
  1: { bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500', emoji: '🥇', color: 'text-yellow-700' },
  2: { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', emoji: '🥈', color: 'text-gray-600' },
  3: { bg: 'bg-gradient-to-br from-amber-400 to-amber-600', emoji: '🥉', color: 'text-amber-700' },
};

const SIZES = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const style = RANK_STYLES[rank];

  if (rank <= 3 && style) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`${SIZES[size]} flex items-center justify-center text-lg`}
      >
        {style.emoji}
      </motion.div>
    );
  }

  return (
    <div className={`${SIZES[size]} rounded-full bg-gray-100 flex items-center justify-center font-bold text-foreground/60`}>
      {rank}
    </div>
  );
}
