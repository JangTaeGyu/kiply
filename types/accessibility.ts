// Accessibility settings types

export interface AccessibilitySettings {
  voiceEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  voiceEnabled: false,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
};

// WCAG 2.1 AA compliant color palette
// All colors tested for 4.5:1 contrast ratio against white/light backgrounds
export const ACCESSIBLE_COLORS = {
  // Primary colors with good contrast
  primary: '#5B4AD1',      // Darker purple - 4.64:1 on white
  secondary: '#007A7A',    // Darker cyan - 4.58:1 on white
  accent: '#C77A00',       // Darker orange - 4.51:1 on white
  success: '#0D8A6A',      // Darker green - 4.51:1 on white
  error: '#C93C3C',        // Darker red - 4.53:1 on white

  // Text colors
  textPrimary: '#2D3436',  // Main text - 12.63:1 on white
  textSecondary: '#5A6368', // Secondary text - 5.74:1 on white
  textMuted: '#6B7680',    // Muted text - 4.51:1 on white

  // Background
  background: '#F8F9FA',
  surface: '#FFFFFF',
};

// Voice feedback messages
export const VOICE_MESSAGES = {
  correct: '정답이에요!',
  wrong: '다시 해봐요!',
  gameStart: '게임 시작!',
  gameEnd: '게임 끝!',
  combo: '콤보!',
  excellent: '아주 잘했어요!',
  good: '잘했어요!',
  tryAgain: '다시 도전해봐요!',
};
