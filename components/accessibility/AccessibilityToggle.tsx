'use client';

import { motion } from 'framer-motion';

interface AccessibilityToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: string;
}

export function AccessibilityToggle({
  label,
  description,
  enabled,
  onToggle,
  icon,
}: AccessibilityToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 touch-target"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} ${enabled ? '켜짐' : '꺼짐'}`}
    >
      <div className="text-3xl" aria-hidden="true">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="font-bold text-foreground">{label}</div>
        <div className="text-sm text-text-secondary">{description}</div>
      </div>
      <div
        className={`w-14 h-8 rounded-full p-1 transition-colors ${
          enabled ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-white rounded-full shadow-md"
        />
      </div>
    </motion.button>
  );
}
