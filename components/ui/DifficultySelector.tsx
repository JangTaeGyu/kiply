'use client';

import { motion } from 'framer-motion';
import { Difficulty, DIFFICULTIES } from '@/types/game';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-inner">
      {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => {
        const config = DIFFICULTIES[diff];
        const isSelected = selected === diff;

        return (
          <motion.button
            key={diff}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(diff)}
            className={`
              flex-1 py-2 px-3 rounded-xl text-sm font-medium
              transition-all duration-200
              ${isSelected
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground/60 hover:text-foreground'
              }
            `}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs">
                {'⭐'.repeat(config.stars)}
              </span>
              <span>{config.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
