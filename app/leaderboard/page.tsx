'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LeaderboardTable } from '@/components/leaderboard';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { GAMES, Difficulty, GameMode, GAME_MODES } from '@/types/game';
import { LeaderboardFilter } from '@/types/leaderboard';

type TimeRange = 'all' | 'day' | 'week' | 'month';

const TIME_RANGES: { value: TimeRange; label: string; icon: string }[] = [
  { value: 'day', label: '오늘', icon: '📅' },
  { value: 'week', label: '이번 주', icon: '📆' },
  { value: 'month', label: '이번 달', icon: '🗓️' },
  { value: 'all', label: '전체', icon: '♾️' },
];

const DIFFICULTIES: { value: Difficulty | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '전체', icon: '🎯' },
  { value: 'easy', label: '쉬움', icon: '🌱' },
  { value: 'medium', label: '보통', icon: '⚡' },
  { value: 'hard', label: '어려움', icon: '🔥' },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const { getFilteredEntries } = useLeaderboardStore();
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  const filter: LeaderboardFilter = {
    gameId: selectedGame,
    timeRange,
    difficulty: selectedDifficulty,
  };

  const entries = getFilteredEntries(filter);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <span className="text-xl">&larr;</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl mb-3"
          >
            🏆
          </motion.div>
          <h1 className="text-2xl font-bold mb-1">리더보드</h1>
          <p className="text-white/80 text-sm">누가 제일 잘할까요?</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-5 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-xl space-y-3"
        >
          {/* Game Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGame('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${selectedGame === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-foreground/60'
                }`}
            >
              전체
            </motion.button>
            {GAMES.map((game) => (
              <motion.button
                key={game.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGame(game.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1
                  ${selectedGame === game.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-foreground/60'
                  }`}
              >
                <span>{game.icon}</span>
                <span className="hidden sm:inline">{game.nameKo}</span>
              </motion.button>
            ))}
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2">
            {TIME_RANGES.map((range) => (
              <motion.button
                key={range.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1
                  ${timeRange === range.value
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-foreground/60'
                  }`}
              >
                <span className="text-xs">{range.icon}</span>
                <span>{range.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            {DIFFICULTIES.map((diff) => (
              <motion.button
                key={diff.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1
                  ${selectedDifficulty === diff.value
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-foreground/60'
                  }`}
              >
                <span className="text-xs">{diff.icon}</span>
                <span>{diff.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <LeaderboardTable entries={entries.slice(0, 50)} showGame={selectedGame === 'all'} />
      </div>
    </div>
  );
}
