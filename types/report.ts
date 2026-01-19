export interface GameHistoryEntry {
  id: string;
  gameId: string;
  score: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  timeSpent: number;
  date: number;
  difficulty?: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  gamesPlayed: number;
  totalScore: number;
  totalTime: number;
}

export interface GameProgress {
  gameId: string;
  totalGames: number;
  averageScore: number;
  bestScore: number;
  recentScores: number[];
  trend: 'up' | 'down' | 'stable';
}

export interface LearningInsight {
  id: string;
  type: 'achievement' | 'improvement' | 'suggestion';
  title: string;
  description: string;
  icon: string;
}
