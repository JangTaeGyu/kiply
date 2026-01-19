import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AchievementId,
  UnlockedAchievement,
  ACHIEVEMENTS,
  getAchievement,
} from '@/types/achievement';
import { Difficulty, GameMode } from '@/types/game';

interface GameResult {
  score: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  difficulty: Difficulty;
  gameMode: GameMode;
  gameId: string;
}

interface AchievementState {
  unlockedAchievements: UnlockedAchievement[];
  lastPlayDates: number[]; // Timestamps of play dates for streak tracking
  newlyUnlocked: AchievementId[]; // Recently unlocked, for showing notifications

  // Actions
  checkAndUnlockAchievements: (result: GameResult) => AchievementId[];
  isUnlocked: (id: AchievementId) => boolean;
  getUnlockedAt: (id: AchievementId) => number | null;
  clearNewlyUnlocked: () => void;
  recordPlayDate: () => void;
  getPlayStreak: () => number;
  resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      lastPlayDates: [],
      newlyUnlocked: [],

      checkAndUnlockAchievements: (result) => {
        const { unlockedAchievements, isUnlocked, getPlayStreak } = get();
        const newlyUnlocked: AchievementId[] = [];

        const unlock = (id: AchievementId) => {
          if (!isUnlocked(id)) {
            newlyUnlocked.push(id);
          }
        };

        // Score achievements
        if (result.score >= 100) unlock('first_100_points');
        if (result.score >= 500) unlock('first_500_points');
        if (result.score >= 1000) unlock('first_1000_points');

        // Combo achievements
        if (result.maxCombo >= 5) unlock('combo_5');
        if (result.maxCombo >= 10) unlock('combo_10');
        if (result.maxCombo >= 20) unlock('combo_20');

        // Perfect game (no wrong answers and at least 5 correct)
        if (result.wrongCount === 0 && result.correctCount >= 5) {
          unlock('perfect_game');
        }

        // Speed demon (time attack with 200+ points)
        if (result.gameMode === 'timeAttack' && result.score >= 200) {
          unlock('speed_demon');
        }

        // Math master (hard difficulty with 300+ points)
        if (result.difficulty === 'hard' && result.score >= 300) {
          unlock('math_master');
        }

        // Streak achievements (check current streak)
        const streak = getPlayStreak();
        if (streak >= 3) unlock('daily_player');
        if (streak >= 7) unlock('weekly_champion');

        // Add newly unlocked achievements to store
        if (newlyUnlocked.length > 0) {
          const newEntries: UnlockedAchievement[] = newlyUnlocked.map((id) => ({
            id,
            unlockedAt: Date.now(),
            gameId: result.gameId,
          }));

          set((state) => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newEntries],
            newlyUnlocked: [...state.newlyUnlocked, ...newlyUnlocked],
          }));
        }

        return newlyUnlocked;
      },

      isUnlocked: (id) => {
        const { unlockedAchievements } = get();
        return unlockedAchievements.some((a) => a.id === id);
      },

      getUnlockedAt: (id) => {
        const { unlockedAchievements } = get();
        const achievement = unlockedAchievements.find((a) => a.id === id);
        return achievement?.unlockedAt ?? null;
      },

      clearNewlyUnlocked: () => {
        set({ newlyUnlocked: [] });
      },

      recordPlayDate: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        set((state) => {
          // Check if already recorded today
          const alreadyRecorded = state.lastPlayDates.some((date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === todayTimestamp;
          });

          if (alreadyRecorded) {
            return state;
          }

          // Keep only last 30 days of play dates
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          const recentDates = state.lastPlayDates.filter((d) => d >= thirtyDaysAgo);

          return {
            lastPlayDates: [...recentDates, Date.now()],
          };
        });
      },

      getPlayStreak: () => {
        const { lastPlayDates } = get();
        if (lastPlayDates.length === 0) return 0;

        // Sort dates descending
        const sortedDates = [...lastPlayDates].sort((a, b) => b - a);

        // Normalize dates to start of day
        const normalizedDates = sortedDates.map((d) => {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        });

        // Remove duplicates
        const uniqueDates = [...new Set(normalizedDates)];

        // Check for consecutive days
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        // Check if played today or yesterday (streak is still active)
        const dayInMs = 24 * 60 * 60 * 1000;
        const yesterday = todayTimestamp - dayInMs;

        if (uniqueDates[0] !== todayTimestamp && uniqueDates[0] !== yesterday) {
          return 0; // Streak broken
        }

        // Count consecutive days
        let expectedDate = uniqueDates[0];
        for (const date of uniqueDates) {
          if (date === expectedDate) {
            streak++;
            expectedDate -= dayInMs;
          } else if (date < expectedDate) {
            break; // Gap found, streak ends
          }
        }

        return streak;
      },

      resetAchievements: () => {
        set({
          unlockedAchievements: [],
          lastPlayDates: [],
          newlyUnlocked: [],
        });
      },
    }),
    {
      name: 'kiply-achievements',
    }
  )
);
