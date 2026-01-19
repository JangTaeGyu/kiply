'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GameCard } from '@/components/ui';
import { ProfileSwitcher } from '@/components/user';
import { useUserStore } from '@/stores/userStore';
import { GAMES } from '@/types/game';

// Floating SVG decoration component
function FloatingDecoration({ src, className, size = 32 }: { src: string; className: string; size?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Image src={src} alt="" width={size} height={size} />
    </motion.div>
  );
}

// Quick action button component
function QuickActionButton({
  href,
  icon,
  label,
  color,
  delay
}: {
  href: string;
  icon: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <Link href={href} aria-label={label}>
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay,
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        whileHover={{ scale: 1.1, y: -3 }}
        className={`flex flex-col items-center gap-1 p-3 rounded-2xl touch-target
                   backdrop-blur-sm border-2 border-white/30 shadow-lg
                   transition-shadow hover:shadow-xl`}
        style={{
          background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
        }}
      >
        <motion.span
          className="text-2xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay + 1 }}
          aria-hidden="true"
        >
          {icon}
        </motion.span>
        <span className="text-xs font-bold text-white drop-shadow-sm">{label}</span>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const router = useRouter();
  const { profiles, currentProfileId, switchProfile, getCurrentProfile, _hasHydrated } = useUserStore();

  const currentProfile = _hasHydrated ? getCurrentProfile() : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section with Candy Gradient */}
      <div className="relative bg-gradient-candy text-white px-6 pt-14 pb-20 rounded-b-[3rem] shadow-candy overflow-hidden">
        {/* Floating SVG Decorations */}
        <FloatingDecoration src="/images/decorations/star.svg" className="top-8 left-8 opacity-90" size={36} />
        <FloatingDecoration src="/images/decorations/sparkle.svg" className="top-16 right-12 opacity-80" size={28} />
        <FloatingDecoration src="/images/decorations/rainbow.svg" className="top-24 left-1/4 opacity-70" size={48} />
        <FloatingDecoration src="/images/decorations/heart.svg" className="bottom-24 right-8 opacity-80" size={32} />
        <FloatingDecoration src="/images/decorations/balloon.svg" className="bottom-16 left-12 opacity-70" size={40} />
        <FloatingDecoration src="/images/decorations/cloud.svg" className="top-12 right-1/3 opacity-60" size={50} />

        {/* Bubble decorations */}
        <div className="absolute top-10 right-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-20 left-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-accent/20 blur-lg" />

        {/* Profile Switcher */}
        {_hasHydrated && profiles.length > 0 && (
          <motion.div
            className="absolute top-4 left-4 z-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ProfileSwitcher
              profiles={profiles}
              currentProfileId={currentProfileId}
              onSwitch={switchProfile}
              onManage={() => router.push('/profile')}
            />
          </motion.div>
        )}

        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          {/* Avatar/Mascot with bounce animation */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className="mb-4 drop-shadow-lg flex justify-center"
            suppressHydrationWarning
          >
            {currentProfile ? (
              <span className="text-6xl inline-block">{currentProfile.avatar}</span>
            ) : (
              <Image
                src="/images/mascot.svg"
                alt="Kiply 마스코트"
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
            )}
          </motion.div>

          {/* Greeting with sparkle effect */}
          <motion.h1
            className="text-3xl font-bold mb-2 drop-shadow-md"
            suppressHydrationWarning
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {currentProfile ? (
              <>
                안녕, <span className="text-accent-light">{currentProfile.name}</span>!
                <motion.span
                  className="inline-block ml-1"
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  👋
                </motion.span>
              </>
            ) : (
              <>
                <span className="text-gradient-candy bg-gradient-to-r from-accent-light to-white bg-clip-text">Kiply</span>
              </>
            )}
          </motion.h1>

          {/* Tagline with fun styling */}
          <motion.p
            className="text-white/90 text-base font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-2">
              <span>🌟</span>
              놀면서 자라는 우리 아이
              <span>🌟</span>
            </span>
          </motion.p>
        </motion.div>

        {/* Quick Actions - Colorful Buttons */}
        <div className="flex justify-center gap-3 mt-8 relative z-10">
          <QuickActionButton href="/leaderboard" icon="🏆" label="리더보드" color="#FFD93D" delay={0.5} />
          <QuickActionButton href="/report" icon="📊" label="리포트" color="#6BCB77" delay={0.6} />
          <QuickActionButton href="/profile" icon="👤" label="프로필" color="#00D4FF" delay={0.7} />
          <QuickActionButton href="/settings" icon="⚙️" label="설정" color="#B088F9" delay={0.8} />
        </div>
      </div>

      {/* Games Section */}
      <div className="flex-1 px-5 -mt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md rounded-[2rem] p-5 shadow-xl border-2 border-primary-light/30"
        >
          {/* Section Header with decoration */}
          <div className="flex items-center gap-3 mb-5 px-1">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image
                src="/images/mascot.svg"
                alt=""
                width={40}
                height={40}
              />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                게임 선택
              </h2>
              <p className="text-sm text-text-secondary">어떤 게임을 해볼까요?</p>
            </div>
            <motion.div
              className="ml-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Image
                src="/images/decorations/sparkle.svg"
                alt=""
                width={28}
                height={28}
              />
            </motion.div>
          </div>

          {/* Game Cards Grid */}
          <div className="space-y-3">
            {GAMES.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Coming Soon - Fun message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center pb-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-lavender/20 text-lavender px-5 py-3 rounded-full"
          >
            <span className="text-xl">🚀</span>
            <span className="font-bold text-sm">더 많은 게임이 곧 추가됩니다!</span>
            <span className="text-xl">🎉</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
