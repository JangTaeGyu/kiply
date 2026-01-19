import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameHistoryEntry, DailyActivity, GameProgress, LearningInsight } from '@/types/report';
import { GAMES } from '@/types/game';

interface ReportState {
  history: GameHistoryEntry[];
  addHistoryEntry: (entry: Omit<GameHistoryEntry, 'id' | 'date'>) => void;
  getWeeklyActivity: () => DailyActivity[];
  getGameProgress: (gameId: string) => GameProgress | null;
  getAllGameProgress: () => GameProgress[];
  getInsights: () => LearningInsight[];
  clearHistory: () => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
};

const getRecentDays = (days: number): string[] => {
  const result: string[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().split('T')[0]);
  }

  return result;
};

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      history: [],

      addHistoryEntry: (entry) => {
        const newEntry: GameHistoryEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: Date.now(),
        };

        set((state) => ({
          history: [...state.history, newEntry],
        }));
      },

      getWeeklyActivity: () => {
        const { history } = get();
        const days = getRecentDays(7);
        const activityMap = new Map<string, DailyActivity>();

        // Initialize all days
        days.forEach((date) => {
          activityMap.set(date, {
            date,
            gamesPlayed: 0,
            totalScore: 0,
            totalTime: 0,
          });
        });

        // Fill in data from history
        history.forEach((entry) => {
          const date = formatDate(entry.date);
          const activity = activityMap.get(date);
          if (activity) {
            activity.gamesPlayed += 1;
            activity.totalScore += entry.score;
            activity.totalTime += entry.timeSpent;
          }
        });

        return days.map((date) => activityMap.get(date)!);
      },

      getGameProgress: (gameId) => {
        const { history } = get();
        const gameHistory = history.filter((e) => e.gameId === gameId);

        if (gameHistory.length === 0) return null;

        const scores = gameHistory.map((e) => e.score);
        const recentScores = scores.slice(-5);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const bestScore = Math.max(...scores);

        // Calculate trend based on recent scores
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (recentScores.length >= 2) {
          const firstHalf = recentScores.slice(0, Math.floor(recentScores.length / 2));
          const secondHalf = recentScores.slice(Math.floor(recentScores.length / 2));
          const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

          if (secondAvg > firstAvg * 1.1) trend = 'up';
          else if (secondAvg < firstAvg * 0.9) trend = 'down';
        }

        return {
          gameId,
          totalGames: gameHistory.length,
          averageScore,
          bestScore,
          recentScores,
          trend,
        };
      },

      getAllGameProgress: () => {
        const { getGameProgress } = get();
        return GAMES
          .map((game) => getGameProgress(game.id))
          .filter((p): p is GameProgress => p !== null);
      },

      getInsights: () => {
        const { history, getAllGameProgress } = get();
        const insights: LearningInsight[] = [];
        const progress = getAllGameProgress();

        // Check for achievements
        const totalGames = history.length;
        if (totalGames >= 10 && totalGames < 20) {
          insights.push({
            id: 'games-10',
            type: 'achievement',
            title: '꾸준한 학습',
            description: '벌써 10번이나 게임을 했어요!',
            icon: '🎯',
          });
        } else if (totalGames >= 20) {
          insights.push({
            id: 'games-20',
            type: 'achievement',
            title: '열정적인 학습자',
            description: '20번 이상 게임을 완료했어요!',
            icon: '🔥',
          });
        }

        // Check for improvements
        const improvingGames = progress.filter((p) => p.trend === 'up');
        if (improvingGames.length > 0) {
          const game = GAMES.find((g) => g.id === improvingGames[0].gameId);
          if (game) {
            insights.push({
              id: 'improving',
              type: 'improvement',
              title: '실력 향상 중',
              description: `${game.nameKo}에서 점수가 계속 올라가고 있어요!`,
              icon: '📈',
            });
          }
        }

        // Check for high scores
        const highScorer = progress.find((p) => p.bestScore >= 100);
        if (highScorer) {
          const game = GAMES.find((g) => g.id === highScorer.gameId);
          if (game) {
            insights.push({
              id: 'high-score',
              type: 'achievement',
              title: '고득점 달성',
              description: `${game.nameKo}에서 ${highScorer.bestScore}점을 기록했어요!`,
              icon: '🏆',
            });
          }
        }

        // Suggestions
        const playedGameIds = new Set(history.map((e) => e.gameId));
        const unplayedGames = GAMES.filter((g) => !playedGameIds.has(g.id));
        if (unplayedGames.length > 0 && playedGameIds.size > 0) {
          insights.push({
            id: 'try-new',
            type: 'suggestion',
            title: '새로운 도전',
            description: `${unplayedGames[0].nameKo}도 한번 해볼까요?`,
            icon: '💡',
          });
        }

        // Weekly consistency
        const weeklyGames = history.filter(
          (e) => e.date > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length;
        if (weeklyGames >= 7) {
          insights.push({
            id: 'weekly-consistency',
            type: 'achievement',
            title: '일주일 내내 활동',
            description: '이번 주에 매일 게임을 했어요!',
            icon: '⭐',
          });
        }

        return insights.slice(0, 4); // Return max 4 insights
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'kiply-report',
    }
  )
);
