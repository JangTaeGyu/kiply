import { Difficulty, GameMode } from './game';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  gameId: string;
  score: number;
  date: number;
  maxCombo: number;
  difficulty?: Difficulty;
  gameMode?: GameMode;
  correctCount?: number;
  wrongCount?: number;
}

export interface LeaderboardFilter {
  gameId: string | 'all';
  timeRange: 'all' | 'day' | 'week' | 'month';
  difficulty?: Difficulty | 'all';
  gameMode?: GameMode | 'all';
}
