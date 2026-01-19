import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerStats, BADGES, ALL_GAME_IDS, Badge } from '@/types/badge';
import { GameResult } from '@/types/game';

interface PlayerState extends PlayerStats {
  addGameResult: (gameId: string, result: GameResult) => string[];
  checkBadges: () => string[];
  getUnlockedBadges: () => Badge[];
  getLockedBadges: () => Badge[];
  resetStats: () => void;
}

const initialStats: PlayerStats = {
  totalGamesPlayed: 0,
  totalScore: 0,
  highestScore: 0,
  maxCombo: 0,
  gamesPlayed: {},
  consecutiveCorrect: 0,
  badges: [],
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initialStats,

      addGameResult: (gameId: string, result: GameResult) => {
        const newBadges: string[] = [];

        set((state) => {
          const newGamesPlayed = {
            ...state.gamesPlayed,
            [gameId]: (state.gamesPlayed[gameId] || 0) + 1,
          };

          return {
            totalGamesPlayed: state.totalGamesPlayed + 1,
            totalScore: state.totalScore + result.score,
            highestScore: Math.max(state.highestScore, result.score),
            maxCombo: Math.max(state.maxCombo, result.maxCombo),
            gamesPlayed: newGamesPlayed,
            consecutiveCorrect: Math.max(state.consecutiveCorrect, result.maxCombo),
          };
        });

        // Check for new badges
        const unlockedBadges = get().checkBadges();
        return unlockedBadges;
      },

      checkBadges: () => {
        const state = get();
        const newBadges: string[] = [];

        BADGES.forEach((badge) => {
          if (state.badges.includes(badge.id)) return;

          let unlocked = false;

          switch (badge.id) {
            case 'first-step':
              unlocked = state.totalGamesPlayed >= 1;
              break;
            case 'combo-king':
              unlocked = state.maxCombo >= 10;
              break;
            case 'genius':
              unlocked = state.highestScore >= 100;
              break;
            case 'master':
              unlocked = ALL_GAME_IDS.every((id) => (state.gamesPlayed[id] || 0) >= 1);
              break;
            case 'math-lover':
              unlocked = (state.gamesPlayed['math-pop'] || 0) >= 5;
              break;
            case 'memory-master':
              unlocked = (state.gamesPlayed['memory-match'] || 0) >= 5;
              break;
            case 'word-wizard':
              unlocked = (state.gamesPlayed['word-hunt'] || 0) >= 5;
              break;
            case 'color-expert':
              unlocked = (state.gamesPlayed['color-touch'] || 0) >= 5;
              break;
            case 'score-hunter':
              unlocked = state.totalScore >= 1000;
              break;
            case 'dedicated':
              unlocked = state.totalGamesPlayed >= 20;
              break;
            case 'shape-expert':
              unlocked = (state.gamesPlayed['shape-match'] || 0) >= 5;
              break;
            case 'mole-hunter':
              unlocked = (state.gamesPlayed['mole-math'] || 0) >= 5;
              break;
            case 'sequence-master':
              unlocked = (state.gamesPlayed['sequence'] || 0) >= 5;
              break;
          }

          if (unlocked) {
            newBadges.push(badge.id);
          }
        });

        if (newBadges.length > 0) {
          set((state) => ({
            badges: [...state.badges, ...newBadges],
          }));
        }

        return newBadges;
      },

      getUnlockedBadges: () => {
        const state = get();
        return BADGES.filter((badge) => state.badges.includes(badge.id));
      },

      getLockedBadges: () => {
        const state = get();
        return BADGES.filter((badge) => !state.badges.includes(badge.id));
      },

      resetStats: () => {
        set(initialStats);
      },
    }),
    {
      name: 'kiply-player-stats',
    }
  )
);
