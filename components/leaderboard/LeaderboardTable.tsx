'use client';

import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/types/leaderboard';
import { GAMES } from '@/types/game';
import { RankBadge } from './RankBadge';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  showGame?: boolean;
}

const getGameInfo = (gameId: string) => {
  return GAMES.find((g) => g.id === gameId);
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export function LeaderboardTable({ entries, showGame = true }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <div className="text-4xl mb-2">🏆</div>
        <p>아직 기록이 없어요</p>
        <p className="text-sm">게임을 플레이해서 첫 기록을 세워보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const game = getGameInfo(entry.gameId);
        const isTopThree = index < 3;

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-2xl ${
              isTopThree ? 'bg-white shadow-md' : 'bg-white/60'
            }`}
          >
            <RankBadge rank={index + 1} size={isTopThree ? 'lg' : 'md'} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-bold truncate ${isTopThree ? 'text-lg' : ''}`}>
                  {entry.playerName}
                </span>
                {entry.maxCombo >= 5 && (
                  <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                    {entry.maxCombo}콤보
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                {showGame && game && (
                  <>
                    <span>{game.icon}</span>
                    <span>{game.nameKo}</span>
                    <span>·</span>
                  </>
                )}
                <span>{formatDate(entry.date)}</span>
              </div>
            </div>

            <div className={`font-bold ${isTopThree ? 'text-xl text-primary' : 'text-foreground/70'}`}>
              {entry.score}
              <span className="text-xs text-foreground/40 ml-0.5">점</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
