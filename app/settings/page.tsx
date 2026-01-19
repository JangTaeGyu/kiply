'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { AccessibilityToggle } from '@/components/accessibility';
import { Button } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const {
    settings,
    _hasHydrated,
    toggleVoice,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
  } = useAccessibilityStore();

  if (!_hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-4xl animate-pulse">⚙️</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">접근성 설정</h1>
          <p className="text-white/80 text-sm mt-1">
            더 편하게 게임을 즐기세요
          </p>
        </motion.div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-5 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <AccessibilityToggle
            icon="🔊"
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
            <li>• <strong>음성 안내</strong>: 정답/오답 시 음성 피드백을 들을 수 있어요</li>
            <li>• <strong>고대비 모드</strong>: 색약이 있어도 잘 보이도록 색상을 조정해요</li>
            <li>• <strong>큰 글씨</strong>: 모든 글씨가 10% 더 커져요</li>
            <li>• <strong>애니메이션 줄이기</strong>: 어지러움을 느끼면 켜보세요</li>
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
