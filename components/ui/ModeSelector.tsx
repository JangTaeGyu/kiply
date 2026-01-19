'use client';

import { motion } from 'framer-motion';
import { GameMode, GAME_MODES } from '@/types/game';

interface ModeSelectorProps {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  const modes = Object.keys(GAME_MODES) as GameMode[];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {modes.map((mode) => {
          const config = GAME_MODES[mode];
          const isSelected = selected === mode;

          return (
            <motion.button
              key={mode}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(mode)}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium
                transition-all duration-200 border-2
                ${isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-md'
                  : 'border-transparent bg-white text-foreground/70 hover:bg-gray-50'
                }
              `}
              style={{
                borderColor: isSelected ? config.color : 'transparent',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{config.icon}</span>
                <span className="font-bold">{config.label}</span>
                <span className="text-xs text-foreground/50 line-clamp-1">
                  {config.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
