'use client';

import { motion } from 'framer-motion';
import { GameProgress } from '@/types/report';
import { GAMES } from '@/types/game';

interface GameProgressCardProps {
  progress: GameProgress;
  index: number;
}

const TREND_ICONS = {
  up: { icon: '📈', color: 'text-success', label: '상승중' },
  down: { icon: '📉', color: 'text-error', label: '하락중' },
  stable: { icon: '➡️', color: 'text-foreground/60', label: '유지중' },
};

export function GameProgressCard({ progress, index }: GameProgressCardProps) {
  const game = GAMES.find((g) => g.id === progress.gameId);
  if (!game) return null;

  const trend = TREND_ICONS[progress.trend];
  const maxRecentScore = Math.max(...progress.recentScores, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-4 shadow-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${game.color}20` }}
        >
          {game.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-foreground">{game.nameKo}</h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground/60">{progress.totalGames}회 플레이</span>
            <span className={`flex items-center gap-0.5 ${trend.color}`}>
              <span>{trend.icon}</span>
              <span className="text-xs">{trend.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Score Stats */}
      <div className="flex gap-4 mb-3">
        <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-primary">{progress.averageScore}</div>
          <div className="text-xs text-foreground/50">평균 점수</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-accent">{progress.bestScore}</div>
          <div className="text-xs text-foreground/50">최고 점수</div>
        </div>
      </div>

      {/* Recent Scores Mini Chart */}
      {progress.recentScores.length > 1 && (
        <div>
          <p className="text-xs text-foreground/50 mb-1">최근 점수</p>
          <div className="flex items-end gap-1 h-8">
            {progress.recentScores.map((score, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(score / maxRecentScore) * 100}%` }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex-1 rounded-sm"
                style={{ backgroundColor: game.color }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
