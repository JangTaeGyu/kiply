'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GameCard } from '@/components/ui';
import { ProfileSwitcher } from '@/components/user';
import { useUserStore } from '@/stores/userStore';
import { GAMES } from '@/types/game';

export default function Home() {
  const router = useRouter();
  const { profiles, currentProfileId, switchProfile, getCurrentProfile, _hasHydrated } = useUserStore();

  const currentProfile = _hasHydrated ? getCurrentProfile() : null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-16 rounded-b-[2rem]">
        {/* Profile Switcher */}
        {_hasHydrated && profiles.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <ProfileSwitcher
              profiles={profiles}
              currentProfileId={currentProfileId}
              onSwitch={switchProfile}
              onManage={() => router.push('/profile')}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl mb-3"
            suppressHydrationWarning
          >
            {currentProfile ? currentProfile.avatar : '🎮'}
          </motion.div>
          <h1 className="text-3xl font-bold mb-2" suppressHydrationWarning>
            {currentProfile ? `안녕, ${currentProfile.name}!` : 'Kiply'}
          </h1>
          <p className="text-white/80 text-sm">놀면서 자라는 우리 아이</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-3 mt-6">
          <Link href="/leaderboard" aria-label="리더보드 보기">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 px-4 py-3 bg-white/20 rounded-2xl touch-target"
            >
              <span className="text-2xl" aria-hidden="true">🏆</span>
              <span className="text-xs">리더보드</span>
            </motion.div>
          </Link>
          <Link href="/report" aria-label="리포트 보기">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 px-4 py-3 bg-white/20 rounded-2xl touch-target"
            >
              <span className="text-2xl" aria-hidden="true">📊</span>
              <span className="text-xs">리포트</span>
            </motion.div>
          </Link>
          <Link href="/profile" aria-label="프로필 관리">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 px-4 py-3 bg-white/20 rounded-2xl touch-target"
            >
              <span className="text-2xl" aria-hidden="true">👤</span>
              <span className="text-xs">프로필</span>
            </motion.div>
          </Link>
          <Link href="/settings" aria-label="접근성 설정">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 px-4 py-3 bg-white/20 rounded-2xl touch-target"
            >
              <span className="text-2xl" aria-hidden="true">⚙️</span>
              <span className="text-xs">설정</span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Games Section */}
      <div className="flex-1 px-5 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-xl"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 px-2">
            게임 선택
          </h2>
          <div className="space-y-3">
            {GAMES.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-foreground/40 text-sm pb-8"
        >
          <p>더 많은 게임이 곧 추가됩니다!</p>
        </motion.div>
      </div>
    </div>
  );
}
