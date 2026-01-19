'use client';

import { motion } from 'framer-motion';
import { LearningInsight } from '@/types/report';

interface InsightCardProps {
  insight: LearningInsight;
  index: number;
}

const TYPE_STYLES = {
  achievement: {
    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
  },
  improvement: {
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
  },
  suggestion: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
};

export function InsightCard({ insight, index }: InsightCardProps) {
  const style = TYPE_STYLES[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${style.bg} ${style.border} border rounded-2xl p-4 flex items-center gap-3`}
    >
      <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
        {insight.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-foreground text-sm">{insight.title}</h4>
        <p className="text-foreground/60 text-xs">{insight.description}</p>
      </div>
    </motion.div>
  );
}
