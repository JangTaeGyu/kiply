import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LeaderboardEntry, LeaderboardFilter } from '@/types/leaderboard';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  addEntry: (entry: Omit<LeaderboardEntry, 'id' | 'date'>) => void;
  getFilteredEntries: (filter: LeaderboardFilter) => LeaderboardEntry[];
  getTopEntries: (gameId: string | 'all', limit?: number) => LeaderboardEntry[];
  getPlayerRank: (playerName: string, gameId: string | 'all') => number | null;
  clearEntries: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: LeaderboardEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: Date.now(),
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      getFilteredEntries: (filter) => {
        const { entries } = get();
        let filtered = [...entries];

        // Filter by game
        if (filter.gameId !== 'all') {
          filtered = filtered.filter((e) => e.gameId === filter.gameId);
        }

        // Filter by difficulty
        if (filter.difficulty && filter.difficulty !== 'all') {
          filtered = filtered.filter((e) => e.difficulty === filter.difficulty);
        }

        // Filter by game mode
        if (filter.gameMode && filter.gameMode !== 'all') {
          filtered = filtered.filter((e) => e.gameMode === filter.gameMode);
        }

        // Filter by time range
        const now = Date.now();
        if (filter.timeRange === 'day') {
          const dayAgo = now - 24 * 60 * 60 * 1000;
          filtered = filtered.filter((e) => e.date >= dayAgo);
        } else if (filter.timeRange === 'week') {
          const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
          filtered = filtered.filter((e) => e.date >= weekAgo);
        } else if (filter.timeRange === 'month') {
          const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
          filtered = filtered.filter((e) => e.date >= monthAgo);
        }

        // Sort by score descending
        return filtered.sort((a, b) => b.score - a.score);
      },

      getTopEntries: (gameId, limit = 10) => {
        const { getFilteredEntries } = get();
        return getFilteredEntries({ gameId, timeRange: 'all' }).slice(0, limit);
      },

      getPlayerRank: (playerName, gameId) => {
        const { getFilteredEntries } = get();
        const entries = getFilteredEntries({ gameId, timeRange: 'all' });

        // Get best score per player
        const playerBests = new Map<string, number>();
        entries.forEach((e) => {
          const current = playerBests.get(e.playerName) || 0;
          if (e.score > current) {
            playerBests.set(e.playerName, e.score);
          }
        });

        // Sort players by their best score
        const sortedPlayers = Array.from(playerBests.entries())
          .sort((a, b) => b[1] - a[1]);

        const rank = sortedPlayers.findIndex(([name]) => name === playerName);
        return rank >= 0 ? rank + 1 : null;
      },

      clearEntries: () => {
        set({ entries: [] });
      },
    }),
    {
      name: 'kiply-leaderboard',
    }
  )
);
