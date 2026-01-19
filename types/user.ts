export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export const AVATAR_OPTIONS = [
  '🦁', '🐯', '🐻', '🐼', '🐨',
  '🐰', '🦊', '🐱', '🐶', '🐸',
  '🦄', '🐲', '🦋', '🐝', '🦜',
  '🐙', '🦈', '🐬', '🦩', '🦉',
];

export const MAX_PROFILES = 4;
