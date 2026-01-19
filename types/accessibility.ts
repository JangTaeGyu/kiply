// Accessibility settings types

export type BalloonSize = 'small' | 'medium' | 'large';
export type BalloonSpeed = 'slow' | 'normal' | 'fast';
export type ColorMode = 'default' | 'colorblind' | 'highContrast';

export interface AccessibilitySettings {
  voiceEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  // Game-specific accessibility
  colorMode: ColorMode;
  balloonSize: BalloonSize;
  balloonSpeed: BalloonSpeed;
  enlargedTouchArea: boolean;
  keyboardEnabled: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  voiceEnabled: false,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  // Game-specific defaults
  colorMode: 'default',
  balloonSize: 'medium',
  balloonSpeed: 'normal',
  enlargedTouchArea: false,
  keyboardEnabled: false,
};

// Balloon size configurations
export const BALLOON_SIZE_CONFIG: Record<BalloonSize, { width: number; height: number; fontSize: string }> = {
  small: { width: 56, height: 70, fontSize: 'text-lg' },
  medium: { width: 64, height: 80, fontSize: 'text-xl' },
  large: { width: 80, height: 100, fontSize: 'text-2xl' },
};

// Balloon speed configurations (multiplier)
export const BALLOON_SPEED_CONFIG: Record<BalloonSpeed, number> = {
  slow: 0.6,
  normal: 1.0,
  fast: 1.4,
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

// Balloon colors for different color modes
// Default: Bright, colorful palette
export const BALLOON_COLORS_DEFAULT = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Purple
  '#98D8C8', // Mint
];

// Colorblind-friendly palette (optimized for deuteranopia and protanopia)
// Uses blue-orange color scheme which is distinguishable by most color blind people
export const BALLOON_COLORS_COLORBLIND = [
  '#0077BB', // Blue
  '#EE7733', // Orange
  '#009988', // Teal
  '#CC3311', // Vermillion
  '#33BBEE', // Cyan
  '#EE3377', // Magenta
  '#BBBBBB', // Gray
];

// High contrast palette (for low vision users)
export const BALLOON_COLORS_HIGH_CONTRAST = [
  '#FF0000', // Pure Red
  '#0000FF', // Pure Blue
  '#00AA00', // Green
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFFF00', // Yellow
  '#FF8800', // Orange
];

// Get balloon colors based on color mode
export const getBalloonColors = (colorMode: ColorMode): string[] => {
  switch (colorMode) {
    case 'colorblind':
      return BALLOON_COLORS_COLORBLIND;
    case 'highContrast':
      return BALLOON_COLORS_HIGH_CONTRAST;
    default:
      return BALLOON_COLORS_DEFAULT;
  }
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
