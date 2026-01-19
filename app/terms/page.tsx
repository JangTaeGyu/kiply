'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">이용약관</h1>
          <p className="text-foreground/60">최종 수정일: 2024년 1월 1일</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg space-y-6"
        >
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제1조 (목적)</h2>
            <p className="text-foreground/70 leading-relaxed">
              본 약관은 Kiply(이하 &quot;서비스&quot;)의 이용조건 및 절차, 회사와
              이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제2조 (서비스의 내용)</h2>
            <p className="text-foreground/70 leading-relaxed">
              서비스는 6~12세 아동을 대상으로 하는 교육용 미니게임 플랫폼으로,
              다음과 같은 서비스를 제공합니다.
            </p>
            <ul className="mt-3 space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>수학, 언어, 기억력 등 다양한 교육용 게임</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>학습 진행 상황 및 리포트 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>프로필 관리 및 리더보드 기능</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제3조 (이용자의 의무)</h2>
            <p className="text-foreground/70 leading-relaxed">
              이용자는 다음 행위를 하여서는 안 됩니다.
            </p>
            <ul className="mt-3 space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>서비스의 정상적인 운영을 방해하는 행위</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>타인의 명예를 손상시키거나 불이익을 주는 행위</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>서비스를 이용하여 법령에 위반되는 행위</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>부정한 방법으로 게임 점수를 조작하는 행위</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제4조 (서비스 이용)</h2>
            <p className="text-foreground/70 leading-relaxed">
              서비스는 무료로 제공되며, 별도의 회원가입 없이 이용 가능합니다.
              서비스 이용 시간은 24시간 연중무휴를 원칙으로 하나, 시스템 점검 등의
              사유로 일시 중단될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제5조 (저작권)</h2>
            <p className="text-foreground/70 leading-relaxed">
              서비스에 포함된 모든 콘텐츠(게임, 이미지, 텍스트 등)의 저작권은
              Kiply에 귀속됩니다. 이용자는 서비스를 이용함으로써 얻은 정보를
              상업적 목적으로 사용할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제6조 (면책조항)</h2>
            <ul className="space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수
                  없는 경우 책임이 면제됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  이용자의 귀책사유로 인한 서비스 이용 장애에 대해서는 책임지지
                  않습니다.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제7조 (약관의 변경)</h2>
            <p className="text-foreground/70 leading-relaxed">
              본 약관은 법령의 변경이나 서비스 정책의 변경에 따라 수정될 수 있으며,
              변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제8조 (문의)</h2>
            <p className="text-foreground/70 leading-relaxed">
              본 약관에 관한 문의사항은 아래 연락처로 문의해 주세요.
            </p>
            <div className="mt-3 bg-primary/5 rounded-xl p-4">
              <p className="text-foreground/70">이메일: ttggbbgg2@gmail.com</p>
            </div>
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
