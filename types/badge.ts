export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: number;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalScore: number;
  highestScore: number;
  maxCombo: number;
  gamesPlayed: Record<string, number>;
  consecutiveCorrect: number;
  badges: string[];
}

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    name: '첫 걸음',
    description: '첫 게임을 완료했어요!',
    icon: '🌟',
    condition: 'totalGamesPlayed >= 1',
  },
  {
    id: 'combo-king',
    name: '연속왕',
    description: '10연속 정답을 달성했어요!',
    icon: '🔥',
    condition: 'maxCombo >= 10',
  },
  {
    id: 'genius',
    name: '천재',
    description: '100점 이상 획득했어요!',
    icon: '🧠',
    condition: 'highestScore >= 100',
  },
  {
    id: 'master',
    name: '마스터',
    description: '모든 게임을 플레이했어요!',
    icon: '👑',
    condition: 'allGamesPlayed',
  },
  {
    id: 'math-lover',
    name: '수학 달인',
    description: '숫자 팡팡을 5번 플레이했어요!',
    icon: '🧮',
    condition: 'gamesPlayed.math-pop >= 5',
  },
  {
    id: 'memory-master',
    name: '기억력 마스터',
    description: '짝꿍 찾기를 5번 플레이했어요!',
    icon: '🃏',
    condition: 'gamesPlayed.memory-match >= 5',
  },
  {
    id: 'word-wizard',
    name: '단어 마법사',
    description: '단어 퍼즐을 5번 플레이했어요!',
    icon: '🔤',
    condition: 'gamesPlayed.word-hunt >= 5',
  },
  {
    id: 'color-expert',
    name: '색깔 전문가',
    description: '색깔 터치를 5번 플레이했어요!',
    icon: '🎨',
    condition: 'gamesPlayed.color-touch >= 5',
  },
  {
    id: 'score-hunter',
    name: '점수 사냥꾼',
    description: '총 1000점을 획득했어요!',
    icon: '🎯',
    condition: 'totalScore >= 1000',
  },
  {
    id: 'dedicated',
    name: '열정 만점',
    description: '게임을 20번 플레이했어요!',
    icon: '💪',
    condition: 'totalGamesPlayed >= 20',
  },
  {
    id: 'shape-expert',
    name: '도형 박사',
    description: '도형 맞추기를 5번 플레이했어요!',
    icon: '🔷',
    condition: 'gamesPlayed.shape-match >= 5',
  },
  {
    id: 'mole-hunter',
    name: '두더지 헌터',
    description: '두더지 암산을 5번 플레이했어요!',
    icon: '🐹',
    condition: 'gamesPlayed.mole-math >= 5',
  },
  {
    id: 'sequence-master',
    name: '순서 마스터',
    description: '순서 맞추기를 5번 플레이했어요!',
    icon: '🧩',
    condition: 'gamesPlayed.sequence >= 5',
  },
];

export const ALL_GAME_IDS = [
  'math-pop',
  'memory-match',
  'word-hunt',
  'color-touch',
  'mole-math',
  'sequence',
  'shape-match',
];
