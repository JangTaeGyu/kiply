'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { useReportStore } from '@/stores/reportStore';
import { useUserStore } from '@/stores/userStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { BADGES } from '@/types/badge';
import { ACHIEVEMENTS, getAchievement, RARITY_COLORS, AchievementId } from '@/types/achievement';

const getResultMessage = (score: number): { message: string; emoji: string; subMessage: string } => {
  if (score >= 91) return {
    message: '와! 천재인걸?',
    subMessage: '완벽해!',
    emoji: '👑'
  };
  if (score >= 61) return {
    message: '대단해!',
    subMessage: '정말 잘하는구나!',
    emoji: '🎉'
  };
  if (score >= 31) return {
    message: '잘했어!',
    subMessage: '조금만 더 연습하자!',
    emoji: '🌟'
  };
  return {
    message: '좋은 시작이야!',
    subMessage: '다시 해볼까?',
    emoji: '💪'
  };
};

const getScoreGrade = (score: number): { grade: string; color: string; bgColor: string } => {
  if (score >= 91) return { grade: 'S', color: '#FFD700', bgColor: 'from-yellow-400 to-amber-500' };
  if (score >= 71) return { grade: 'A', color: '#6BCB77', bgColor: 'from-green-400 to-emerald-500' };
  if (score >= 51) return { grade: 'B', color: '#00D4FF', bgColor: 'from-cyan-400 to-blue-500' };
  if (score >= 31) return { grade: 'C', color: '#B088F9', bgColor: 'from-purple-400 to-violet-500' };
  return { grade: 'D', color: '#FF8C8C', bgColor: 'from-orange-400 to-rose-500' };
};

const GAME_PATH_MAP: Record<string, string> = {
  '숫자 팡팡': '/games/math-pop',
  '짝꿍 찾기': '/games/memory-match',
  '단어 퍼즐': '/games/word-hunt',
  '색깔 터치': '/games/color-touch',
  '두더지 암산': '/games/mole-math',
  '순서 맞추기': '/games/sequence',
  '도형 맞추기': '/games/shape-match',
};

const GAME_ID_MAP: Record<string, string> = {
  '숫자 팡팡': 'math-pop',
  '짝꿍 찾기': 'memory-match',
  '단어 퍼즐': 'word-hunt',
  '색깔 터치': 'color-touch',
  '두더지 암산': 'mole-math',
  '순서 맞추기': 'sequence',
  '도형 맞추기': 'shape-match',
};

// Confetti piece component
function ConfettiPiece({ delay, x }: { delay: number; x: number }) {
  const colors = ['#FF6B9D', '#00D4FF', '#FFD93D', '#6BCB77', '#B088F9', '#FF8C8C'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        left: `${x}%`,
        top: '-5%',
        backgroundColor: color,
      }}
      initial={{ y: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: '120vh',
        rotate: 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        ease: 'linear',
      }}
    />
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { currentResult, clearResult } = useGameStore();
  const { addGameResult } = usePlayerStore();
  const { addEntry } = useLeaderboardStore();
  const { addHistoryEntry } = useReportStore();
  const { getCurrentProfile } = useUserStore();
  const { checkAndUnlockAchievements, recordPlayDate, clearNewlyUnlocked } = useAchievementStore();
  const [displayScore, setDisplayScore] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Generate confetti pieces
  const confettiPieces = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 1,
      x: Math.random() * 100,
    })), []);

  useEffect(() => {
    if (!currentResult) {
      router.push('/');
      return;
    }

    if (hasSaved) return;
    setHasSaved(true);

    // Extract base game name (remove mode suffix like "(클래식)")
    const baseGameName = currentResult.gameName.split(' (')[0];
    const gameId = GAME_ID_MAP[baseGameName] || GAME_ID_MAP[currentResult.gameName] || '';

    if (gameId) {
      // Record play date for streak tracking
      recordPlayDate();

      // Check for new badges
      const earnedBadges = addGameResult(gameId, currentResult);
      if (earnedBadges.length > 0) {
        setNewBadges(earnedBadges);
        setTimeout(() => setShowBadgeModal(true), 2500);
      }

      // Check for new achievements
      const earnedAchievements = checkAndUnlockAchievements({
        score: currentResult.score,
        maxCombo: currentResult.maxCombo,
        correctCount: currentResult.correctCount,
        wrongCount: currentResult.wrongCount,
        difficulty: currentResult.difficulty || 'easy',
        gameMode: currentResult.gameMode || 'classic',
        gameId,
      });

      if (earnedAchievements.length > 0) {
        setNewAchievements(earnedAchievements);
        // Show achievements after badges (or immediately if no badges)
        const achievementDelay = earnedBadges.length > 0 ? 5000 : 2500;
        setTimeout(() => setShowAchievementModal(true), achievementDelay);
      }

      const currentProfile = getCurrentProfile();
      addEntry({
        playerName: currentProfile?.name || '플레이어',
        gameId,
        score: currentResult.score,
        maxCombo: currentResult.maxCombo,
        difficulty: currentResult.difficulty,
        gameMode: currentResult.gameMode,
        correctCount: currentResult.correctCount,
        wrongCount: currentResult.wrongCount,
      });

      addHistoryEntry({
        gameId,
        score: currentResult.score,
        maxCombo: currentResult.maxCombo,
        correctCount: currentResult.correctCount,
        wrongCount: currentResult.wrongCount,
        timeSpent: currentResult.timeSpent,
      });
    }

    // Animate score
    const targetScore = currentResult.score;
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setDisplayScore(Math.min(Math.round(increment * step), targetScore));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 4000);

    return () => clearInterval(timer);
  }, [currentResult, router, addGameResult, addEntry, addHistoryEntry, getCurrentProfile, hasSaved, checkAndUnlockAchievements, recordPlayDate]);

  if (!currentResult) {
    return null;
  }

  const { message, emoji, subMessage } = getResultMessage(currentResult.score);
  const { grade, bgColor } = getScoreGrade(currentResult.score);

  const handlePlayAgain = () => {
    const gamePath = GAME_PATH_MAP[currentResult.gameName] || '/';
    clearResult();
    router.push(gamePath);
  };

  const handleGoHome = () => {
    clearResult();
    router.push('/');
  };

  const earnedBadgeDetails = newBadges.map(id => BADGES.find(b => b.id === id)).filter(Boolean);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-light/10 to-secondary-light/10" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute top-1/3 right-5 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <ConfettiPiece key={piece.id} delay={piece.delay} x={piece.x} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-sm">
        {/* Game Name Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge-fun badge-pink"
        >
          <span>🎮</span>
          <span>{currentResult.gameName}</span>
        </motion.div>

        {/* Result Emoji with bounce */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            className="text-8xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.div>
          {/* Sparkles around emoji */}
          <motion.span
            className="absolute -top-2 -right-2 text-2xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -bottom-1 -left-3 text-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
          >
            ⭐
          </motion.span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">{message}</h1>
          <p className="text-lg text-text-secondary">{subMessage}</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="relative w-full"
        >
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border-3 border-primary-light/30 flex flex-col items-center gap-3">
            <span className="text-text-secondary text-sm font-medium">최종 점수</span>
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-6xl font-bold text-gradient-candy"
                key={displayScore}
              >
                {displayScore}
              </motion.span>
              <span className="text-2xl text-text-muted mb-1">점</span>
            </div>

            {/* Grade Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.8, type: 'spring', bounce: 0.6 }}
              className={`absolute -top-5 -right-3 w-16 h-16 rounded-2xl bg-gradient-to-br ${bgColor}
                         flex items-center justify-center text-3xl font-bold text-white shadow-lg
                         border-3 border-white`}
            >
              {grade}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-3 w-full"
        >
          <div className="bg-success-light/30 rounded-2xl p-3 text-center border-2 border-success/30">
            <motion.div
              className="text-2xl font-bold text-success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              {currentResult.correctCount}
            </motion.div>
            <div className="text-xs text-text-secondary font-medium">✓ 정답</div>
          </div>
          <div className="bg-accent-light/30 rounded-2xl p-3 text-center border-2 border-accent/30">
            <motion.div
              className="text-2xl font-bold text-accent-dark"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, type: 'spring' }}
            >
              {currentResult.maxCombo}
            </motion.div>
            <div className="text-xs text-text-secondary font-medium">🔥 콤보</div>
          </div>
          <div className="bg-secondary-light/30 rounded-2xl p-3 text-center border-2 border-secondary/30">
            <motion.div
              className="text-2xl font-bold text-secondary-dark"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
            >
              {currentResult.timeSpent}s
            </motion.div>
            <div className="text-xs text-text-secondary font-medium">⏱️ 시간</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full space-y-3 mt-2"
        >
          <Button onClick={handlePlayAgain} fullWidth size="lg" variant="candy" icon="🔄">
            다시 하기
          </Button>
          <Button onClick={handleGoHome} variant="ghost" fullWidth icon="🏠">
            홈으로
          </Button>
        </motion.div>
      </div>

      {/* Badge Modal */}
      <AnimatePresence>
        {showBadgeModal && earnedBadgeDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl border-3 border-accent-light"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-3"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🎊
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-1">축하해요!</h2>
              <p className="text-text-secondary mb-4">새 배지를 획득했어요!</p>

              <div className="space-y-3">
                {earnedBadgeDetails.map((badge, index) => badge && (
                  <motion.div
                    key={badge.id}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-primary-light/30 to-accent-light/30
                               rounded-2xl p-4 border-2 border-primary-light/50"
                  >
                    <motion.div
                      className="text-4xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {badge.icon}
                    </motion.div>
                    <div className="text-left">
                      <div className="font-bold text-foreground">{badge.name}</div>
                      <div className="text-sm text-text-secondary">{badge.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={() => setShowBadgeModal(false)} className="mt-5" fullWidth variant="candy">
                확인 ✨
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Modal */}
      <AnimatePresence>
        {showAchievementModal && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => {
              setShowAchievementModal(false);
              clearNewlyUnlocked();
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl border-3 border-yellow-400"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-3"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🏅
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-1">도전 과제 달성!</h2>
              <p className="text-text-secondary mb-4">새로운 도전 과제를 달성했어요!</p>

              <div className="space-y-3">
                {newAchievements.map((achievementId, index) => {
                  const achievement = getAchievement(achievementId);
                  if (!achievement) return null;

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-center gap-3 rounded-2xl p-4 border-2"
                      style={{
                        backgroundColor: `${RARITY_COLORS[achievement.rarity]}15`,
                        borderColor: `${RARITY_COLORS[achievement.rarity]}50`,
                      }}
                    >
                      <motion.div
                        className="text-4xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {achievement.icon}
                      </motion.div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-foreground">{achievement.title}</div>
                        <div className="text-sm text-text-secondary">{achievement.description}</div>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: RARITY_COLORS[achievement.rarity] }}
                      >
                        {achievement.rarity === 'common' ? '일반' :
                         achievement.rarity === 'rare' ? '희귀' :
                         achievement.rarity === 'epic' ? '영웅' : '전설'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <Button
                onClick={() => {
                  setShowAchievementModal(false);
                  clearNewlyUnlocked();
                }}
                className="mt-5"
                fullWidth
                variant="candy"
              >
                멋져요! 🏆
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
