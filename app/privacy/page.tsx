'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">개인정보처리방침</h1>
          <p className="text-foreground/60">최종 수정일: 2024년 1월 1일</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg space-y-6"
        >
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. 개인정보 수집 항목</h2>
            <p className="text-foreground/70 leading-relaxed">
              Kiply는 서비스 제공을 위해 최소한의 개인정보만을 수집합니다.
            </p>
            <ul className="mt-3 space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>필수 항목:</strong> 프로필 닉네임, 아바타 선택</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>자동 수집:</strong> 게임 점수, 플레이 기록</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. 개인정보 수집 목적</h2>
            <ul className="space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>서비스 제공 및 게임 진행 상황 저장</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>리더보드 및 학습 리포트 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>서비스 개선을 위한 통계 분석</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. 개인정보 보관 및 파기</h2>
            <p className="text-foreground/70 leading-relaxed">
              Kiply는 로컬 저장소(브라우저)에 데이터를 저장하며, 별도의 서버에
              개인정보를 전송하거나 저장하지 않습니다. 브라우저 데이터를 삭제하면
              모든 정보가 영구적으로 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. 아동의 개인정보 보호</h2>
            <p className="text-foreground/70 leading-relaxed">
              Kiply는 아동을 대상으로 하는 서비스로서, 아동의 개인정보 보호에
              특별히 주의를 기울입니다. 부모님께서는 자녀의 개인정보 관리에
              대해 언제든지 문의하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. 쿠키 사용</h2>
            <p className="text-foreground/70 leading-relaxed">
              Kiply는 서비스 제공을 위해 로컬 스토리지를 사용합니다.
              이는 게임 진행 상황 저장 및 사용자 설정 유지를 위해 필요합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. 개인정보 보호책임자</h2>
            <p className="text-foreground/70 leading-relaxed">
              개인정보 처리에 관한 문의사항이 있으시면 아래 연락처로 문의해 주세요.
            </p>
            <div className="mt-3 bg-primary/5 rounded-xl p-4">
              <p className="text-foreground/70">이메일: ttggbbgg2@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. 방침 변경</h2>
            <p className="text-foreground/70 leading-relaxed">
              본 개인정보처리방침은 법령 및 서비스 변경에 따라 내용이 변경될 수
              있습니다. 변경 시 서비스 내 공지를 통해 안내드립니다.
            </p>
          </section>
        </motion.div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
