'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Image
            src="/images/mascot.svg"
            alt="Kiply 마스코트"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">Kiply 소개</h1>
          <p className="text-foreground/60">놀면서 자라는 우리 아이</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg space-y-6"
        >
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">Kiply란?</h2>
            <p className="text-foreground/70 leading-relaxed">
              Kiply는 <strong>Kids + Play</strong>의 합성어로, 6~12세 어린이를 위한
              교육용 미니게임 플랫폼입니다. 재미있는 게임을 통해 수학, 언어, 기억력,
              집중력 등 다양한 능력을 자연스럽게 발달시킬 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">우리의 목표</h2>
            <ul className="space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>놀이를 통한 자연스러운 학습 경험 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>아이들의 자기주도 학습 능력 향상</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>안전하고 광고 없는 학습 환경 조성</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>부모님이 안심하고 맡길 수 있는 교육 콘텐츠</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">제공 게임</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: '숫자 팡팡', desc: '덧셈, 뺄셈 연습' },
                { name: '짝꿍 찾기', desc: '기억력 향상' },
                { name: '단어 퍼즐', desc: '어휘력 발달' },
                { name: '색깔 터치', desc: '집중력 강화' },
                { name: '두더지 암산', desc: '암산 능력 향상' },
                { name: '순서 맞추기', desc: '패턴 인식력' },
                { name: '도형 맞추기', desc: '공간 지각력' },
              ].map((game) => (
                <div
                  key={game.name}
                  className="bg-primary/5 rounded-xl p-3 text-center"
                >
                  <p className="font-medium text-foreground">{game.name}</p>
                  <p className="text-xs text-foreground/50">{game.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/*<section>*/}
          {/*  <h2 className="text-xl font-bold text-primary mb-3">문의</h2>*/}
          {/*  <p className="text-foreground/70">*/}
          {/*    서비스 이용 중 궁금한 점이 있으시면 언제든지 문의해 주세요.*/}
          {/*  </p>*/}
          {/*  <p className="text-primary font-medium mt-2">*/}
          {/*    support@kiply.com*/}
          {/*  </p>*/}
          {/*</section>*/}
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
