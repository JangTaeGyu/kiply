export interface LeaderboardEntry {
  id: string;
  playerName: string;
  gameId: string;
  score: number;
  date: number;
  maxCombo: number;
}

export interface LeaderboardFilter {
  gameId: string | 'all';
  timeRange: 'all' | 'week' | 'month';
}
