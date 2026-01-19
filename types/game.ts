export interface GameResult {
  gameName: string;
  score: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  timeSpent: number;
}

export interface GameConfig {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  label: string;
  stars: number;
  description: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: '쉬움', stars: 1, description: '처음 시작하기 좋아요' },
  medium: { label: '보통', stars: 2, description: '조금 더 도전해봐요' },
  hard: { label: '어려움', stars: 3, description: '실력을 뽐내봐요' },
};

export const GAMES: GameConfig[] = [
  {
    id: 'math-pop',
    name: 'Math Pop',
    nameKo: '숫자 팡팡',
    description: '풍선을 터뜨려 정답을 맞춰봐요!',
    icon: '🧮',
    color: '#6C5CE7',
    path: '/games/math-pop',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    nameKo: '짝꿍 찾기',
    description: '같은 그림을 찾아봐요!',
    icon: '🃏',
    color: '#00D2D3',
    path: '/games/memory-match',
  },
  {
    id: 'word-hunt',
    name: 'Word Hunt',
    nameKo: '단어 퍼즐',
    description: '글자를 모아 단어를 완성해요!',
    icon: '🔤',
    color: '#FF9F43',
    path: '/games/word-hunt',
  },
  {
    id: 'color-touch',
    name: 'Color Touch',
    nameKo: '색깔 터치',
    description: '지시한 색깔을 빠르게 터치해요!',
    icon: '🎨',
    color: '#10AC84',
    path: '/games/color-touch',
  },
  {
    id: 'mole-math',
    name: 'Mole Math',
    nameKo: '두더지 암산',
    description: '정답 두더지를 잡아요!',
    icon: '🐹',
    color: '#D68910',
    path: '/games/mole-math',
  },
  {
    id: 'sequence',
    name: 'Sequence',
    nameKo: '순서 맞추기',
    description: '패턴을 기억하고 따라해요!',
    icon: '🧩',
    color: '#8E44AD',
    path: '/games/sequence',
  },
  {
    id: 'shape-match',
    name: 'Shape Match',
    nameKo: '도형 맞추기',
    description: '같은 도형을 찾아봐요!',
    icon: '🔷',
    color: '#3498DB',
    path: '/games/shape-match',
  },
];
