'use client';

import { motion } from 'framer-motion';
import { AVATAR_OPTIONS } from '@/types/user';

interface AvatarPickerProps {
  selected: string;
  onSelect: (avatar: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {AVATAR_OPTIONS.map((avatar, index) => (
        <motion.button
          key={avatar}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(avatar)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all
            ${selected === avatar
              ? 'bg-primary/20 ring-2 ring-primary scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
            }`}
        >
          {avatar}
        </motion.button>
      ))}
    </div>
  );
}
