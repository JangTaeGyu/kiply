// Achievement System Types

export type AchievementId =
  | 'first_100_points'
  | 'first_500_points'
  | 'first_1000_points'
  | 'combo_5'
  | 'combo_10'
  | 'combo_20'
  | 'perfect_game'
  | 'speed_demon'
  | 'math_master'
  | 'daily_player'
  | 'weekly_champion';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: 'score' | 'combo' | 'special' | 'streak';
  requirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: number;
  gameId?: string;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Score achievements
  {
    id: 'first_100_points',
    title: '첫 100점',
    description: '처음으로 100점을 달성했어요!',
    icon: '🎯',
    category: 'score',
    requirement: 100,
    rarity: 'common',
  },
  {
    id: 'first_500_points',
    title: '500점 돌파',
    description: '500점을 돌파했어요!',
    icon: '🌟',
    category: 'score',
    requirement: 500,
    rarity: 'rare',
  },
  {
    id: 'first_1000_points',
    title: '천점 달인',
    description: '1000점을 달성한 진정한 달인!',
    icon: '👑',
    category: 'score',
    requirement: 1000,
    rarity: 'epic',
  },

  // Combo achievements
  {
    id: 'combo_5',
    title: '5콤보',
    description: '5연속 정답을 맞혔어요!',
    icon: '🔥',
    category: 'combo',
    requirement: 5,
    rarity: 'common',
  },
  {
    id: 'combo_10',
    title: '10콤보 달성',
    description: '10연속 정답! 대단해요!',
    icon: '💥',
    category: 'combo',
    requirement: 10,
    rarity: 'rare',
  },
  {
    id: 'combo_20',
    title: '콤보 마스터',
    description: '20연속 정답! 당신은 천재!',
    icon: '⚡',
    category: 'combo',
    requirement: 20,
    rarity: 'legendary',
  },

  // Special achievements
  {
    id: 'perfect_game',
    title: '무실점 클리어',
    description: '한 번도 틀리지 않고 게임을 끝냈어요!',
    icon: '✨',
    category: 'special',
    requirement: 1,
    rarity: 'epic',
  },
  {
    id: 'speed_demon',
    title: '스피드 데몬',
    description: '타임어택 모드에서 200점 이상 획득!',
    icon: '⏱️',
    category: 'special',
    requirement: 200,
    rarity: 'rare',
  },
  {
    id: 'math_master',
    title: '수학 마스터',
    description: '어려움 난이도에서 300점 이상 획득!',
    icon: '🧮',
    category: 'special',
    requirement: 300,
    rarity: 'epic',
  },

  // Streak achievements
  {
    id: 'daily_player',
    title: '매일 플레이',
    description: '3일 연속 게임을 플레이했어요!',
    icon: '📅',
    category: 'streak',
    requirement: 3,
    rarity: 'common',
  },
  {
    id: 'weekly_champion',
    title: '일주일 챔피언',
    description: '7일 연속 게임을 플레이했어요!',
    icon: '🏆',
    category: 'streak',
    requirement: 7,
    rarity: 'rare',
  },
];

// Helper function to get achievement by ID
export const getAchievement = (id: AchievementId): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id);
};

// Rarity colors
export const RARITY_COLORS: Record<Achievement['rarity'], string> = {
  common: '#9CA3AF', // gray
  rare: '#3B82F6', // blue
  epic: '#8B5CF6', // purple
  legendary: '#F59E0B', // orange/gold
};

// Rarity labels
export const RARITY_LABELS: Record<Achievement['rarity'], string> = {
  common: '일반',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
};
