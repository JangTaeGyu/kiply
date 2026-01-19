'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { useReportStore } from '@/stores/reportStore';
import { useUserStore } from '@/stores/userStore';
import { BADGES } from '@/types/badge';
import { GAMES } from '@/types/game';

const getResultMessage = (score: number): { message: string; emoji: string } => {
  if (score >= 91) return { message: '와! 천재인걸? 완벽해!', emoji: '👑' };
  if (score >= 61) return { message: '대단해! 정말 잘하는구나!', emoji: '🎉' };
  if (score >= 31) return { message: '잘했어! 조금만 더 연습하자!', emoji: '🌟' };
  return { message: '좋은 시작이야! 다시 해볼까?', emoji: '💪' };
};

const getScoreGrade = (score: number): { grade: string; color: string } => {
  if (score >= 91) return { grade: 'S', color: '#FFD700' };
  if (score >= 71) return { grade: 'A', color: '#10AC84' };
  if (score >= 51) return { grade: 'B', color: '#00D2D3' };
  if (score >= 31) return { grade: 'C', color: '#6C5CE7' };
  return { grade: 'D', color: '#FF9F43' };
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

export default function ResultPage() {
  const router = useRouter();
  const { currentResult, clearResult } = useGameStore();
  const { addGameResult } = usePlayerStore();
  const { addEntry } = useLeaderboardStore();
  const { addHistoryEntry } = useReportStore();
  const { getCurrentProfile } = useUserStore();
  const [displayScore, setDisplayScore] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!currentResult) {
      router.push('/');
      return;
    }

    // Prevent double saving
    if (hasSaved) return;
    setHasSaved(true);

    // Save result and check for new badges
    const gameId = GAME_ID_MAP[currentResult.gameName] || '';
    if (gameId) {
      const earnedBadges = addGameResult(gameId, currentResult);
      if (earnedBadges.length > 0) {
        setNewBadges(earnedBadges);
        setTimeout(() => setShowBadgeModal(true), 2000);
      }

      // Save to leaderboard
      const currentProfile = getCurrentProfile();
      addEntry({
        playerName: currentProfile?.name || '플레이어',
        gameId,
        score: currentResult.score,
        maxCombo: currentResult.maxCombo,
      });

      // Save to report history
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

    return () => clearInterval(timer);
  }, [currentResult, router, addGameResult, addEntry, addHistoryEntry, getCurrentProfile, hasSaved]);

  if (!currentResult) {
    return null;
  }

  const { message, emoji } = getResultMessage(currentResult.score);
  const { grade, color } = getScoreGrade(currentResult.score);

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
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 bg-gradient-to-b from-background to-primary/10">
      {/* Game Name */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-foreground/60 font-medium"
      >
        {currentResult.gameName}
      </motion.p>

      {/* Result Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="text-8xl"
      >
        {emoji}
      </motion.div>

      {/* Message */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-foreground text-center"
      >
        {message}
      </motion.h1>

      {/* Score Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center gap-2">
          <span className="text-foreground/60 text-sm">점수</span>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-primary">{displayScore}</span>
            <span className="text-2xl text-foreground/40 mb-2">점</span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.8, type: 'spring', bounce: 0.6 }}
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {grade}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-4 w-full max-w-xs"
      >
        <div className="bg-white/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-success">{currentResult.correctCount}</div>
          <div className="text-xs text-foreground/60">정답</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-accent">{currentResult.maxCombo}</div>
          <div className="text-xs text-foreground/60">최대 콤보</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-secondary">{currentResult.timeSpent}s</div>
          <div className="text-xs text-foreground/60">플레이 시간</div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-xs space-y-3 mt-4"
      >
        <Button onClick={handlePlayAgain} fullWidth size="lg">
          다시 하기
        </Button>
        <Button onClick={handleGoHome} variant="ghost" fullWidth>
          홈으로
        </Button>
      </motion.div>

      {/* Badge Modal */}
      <AnimatePresence>
        {showBadgeModal && earnedBadgeDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-2">🎊</div>
              <h2 className="text-xl font-bold text-foreground mb-4">새 배지 획득!</h2>
              <div className="space-y-3">
                {earnedBadgeDetails.map((badge) => badge && (
                  <motion.div
                    key={badge.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 bg-primary/10 rounded-2xl p-3"
                  >
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="text-left">
                      <div className="font-bold text-foreground">{badge.name}</div>
                      <div className="text-sm text-foreground/60">{badge.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => setShowBadgeModal(false)} className="mt-4" fullWidth>
                확인
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
