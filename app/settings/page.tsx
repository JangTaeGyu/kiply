'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { AccessibilityToggle } from '@/components/accessibility';
import { Button } from '@/components/ui';
import { useSound } from '@/hooks';
import { ColorMode, BalloonSize, BalloonSpeed } from '@/types/accessibility';

export default function SettingsPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const {
    settings,
    _hasHydrated,
    toggleVoice,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleEnlargedTouchArea,
    toggleKeyboardEnabled,
    setColorMode,
    setBalloonSize,
    setBalloonSpeed,
  } = useAccessibilityStore();

  const {
    soundEnabled,
    soundVolume,
    toggleSound,
    setSoundVolume,
  } = useSettingsStore();

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-4xl animate-pulse">⚙️</div>
      </div>
    );
  }

  const handleSoundToggle = () => {
    toggleSound();
    if (!soundEnabled) {
      // Play a test sound when enabling
      setTimeout(() => playSound('click'), 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setSoundVolume(volume);
    playSound('click');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">⚙️</div>
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="text-white/80 text-sm mt-1">
            더 편하게 게임을 즐기세요
          </p>
        </motion.div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-5 mt-4">
        {/* Sound Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wide mb-3 px-1">
            🔊 사운드 설정
          </h2>
          <div className="space-y-3">
            <AccessibilityToggle
              icon="🔔"
              label="효과음"
              description="게임 효과음을 재생해요"
              enabled={soundEnabled}
              onToggle={handleSoundToggle}
            />

            {soundEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">볼륨</span>
                  <span className="text-sm text-foreground/60">{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-foreground/40 mt-1">
                  <span>🔈</span>
                  <span>🔊</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Accessibility Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wide mb-3 px-1">
            ♿ 접근성 설정
          </h2>
          <div className="space-y-3">
            <AccessibilityToggle
              icon="🗣️"
              label="음성 안내"
              description="게임 진행 시 음성으로 안내해요"
              enabled={settings.voiceEnabled}
              onToggle={toggleVoice}
            />

            <AccessibilityToggle
              icon="🎨"
              label="고대비 모드"
              description="색상 대비를 높여 더 잘 보여요"
              enabled={settings.highContrast}
              onToggle={toggleHighContrast}
            />

            <AccessibilityToggle
              icon="🔤"
              label="큰 글씨"
              description="글자 크기를 크게 해요"
              enabled={settings.largeText}
              onToggle={toggleLargeText}
            />

            <AccessibilityToggle
              icon="✨"
              label="애니메이션 줄이기"
              description="움직임을 줄여 편안하게 해요"
              enabled={settings.reducedMotion}
              onToggle={toggleReducedMotion}
            />
          </div>
        </motion.div>

        {/* Game Accessibility Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wide mb-3 px-1">
            🎮 게임 접근성 설정
          </h2>
          <div className="space-y-3">
            {/* Color Mode Selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold text-foreground">색상 모드</h3>
                  <p className="text-sm text-foreground/60">색각 특성에 맞게 색상을 조정해요</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'default' as ColorMode, label: '기본', icon: '🌈' },
                  { value: 'colorblind' as ColorMode, label: '색맹 친화', icon: '👁️' },
                  { value: 'highContrast' as ColorMode, label: '고대비', icon: '⚫' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setColorMode(option.value);
                      playSound('click');
                    }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings.colorMode === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Balloon Size Selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎈</span>
                <div>
                  <h3 className="font-bold text-foreground">풍선 크기</h3>
                  <p className="text-sm text-foreground/60">풍선을 더 크게 또는 작게 해요</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small' as BalloonSize, label: '작게', icon: '🎈' },
                  { value: 'medium' as BalloonSize, label: '보통', icon: '🎈🎈' },
                  { value: 'large' as BalloonSize, label: '크게', icon: '🎈🎈🎈' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setBalloonSize(option.value);
                      playSound('click');
                    }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings.balloonSize === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`mb-1 ${
                      option.value === 'small' ? 'text-lg' :
                      option.value === 'medium' ? 'text-xl' : 'text-2xl'
                    }`}>{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Balloon Speed Selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💨</span>
                <div>
                  <h3 className="font-bold text-foreground">풍선 속도</h3>
                  <p className="text-sm text-foreground/60">풍선이 떠오르는 속도를 조절해요</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'slow' as BalloonSpeed, label: '느리게', icon: '🐢' },
                  { value: 'normal' as BalloonSpeed, label: '보통', icon: '🐇' },
                  { value: 'fast' as BalloonSpeed, label: '빠르게', icon: '🚀' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setBalloonSpeed(option.value);
                      playSound('click');
                    }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings.balloonSpeed === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Touch Area Toggle */}
            <AccessibilityToggle
              icon="👆"
              label="터치 영역 확대"
              description="풍선 터치 영역을 더 크게 해요"
              enabled={settings.enlargedTouchArea}
              onToggle={toggleEnlargedTouchArea}
            />

            {/* Keyboard Controls Toggle */}
            <AccessibilityToggle
              icon="⌨️"
              label="키보드 조작"
              description="숫자 키로 풍선을 선택할 수 있어요"
              enabled={settings.keyboardEnabled}
              onToggle={toggleKeyboardEnabled}
            />
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-primary/10 rounded-2xl p-4"
        >
          <h3 className="font-bold text-foreground mb-2">💡 도움말</h3>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• <strong>효과음</strong>: 풍선 터뜨리기, 정답/오답 소리를 들을 수 있어요</li>
            <li>• <strong>음성 안내</strong>: 정답/오답 시 음성 피드백을 들을 수 있어요</li>
            <li>• <strong>색상 모드</strong>: 색각 특성에 맞게 풍선 색상을 변경해요</li>
            <li>• <strong>풍선 크기</strong>: 풍선을 더 크게 또는 작게 조절해요</li>
            <li>• <strong>풍선 속도</strong>: 풍선이 올라오는 속도를 조절해요</li>
            <li>• <strong>키보드 조작</strong>: 1~5 숫자키로 풍선을 선택할 수 있어요</li>
          </ul>
        </motion.div>

        {/* Back Button */}
        <div className="mt-6 pb-8">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            fullWidth
          >
            ← 홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
