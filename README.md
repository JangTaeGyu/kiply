# Kiply

**놀면서 자라는 우리 아이** - 6~12세 어린이를 위한 교육용 미니게임 플랫폼

## 소개

Kiply는 **Kids + Play**의 합성어로, 재미있는 게임을 통해 아이들의 수학, 언어, 기억력, 집중력 등 다양한 능력을 자연스럽게 발달시킬 수 있는 교육용 미니게임 플랫폼입니다.

## 주요 기능

### 게임
- **숫자 팡팡** - 풍선을 터뜨려 덧셈, 뺄셈 연습
- **짝꿍 찾기** - 카드 뒤집기로 기억력 향상
- **단어 퍼즐** - 흩어진 글자로 어휘력 발달
- **색깔 터치** - 빠른 색깔 인식으로 집중력 강화
- **두더지 암산** - 두더지 잡기로 암산 능력 향상
- **순서 맞추기** - 패턴 기억으로 인식력 향상
- **도형 맞추기** - 도형 매칭으로 공간 지각력 발달

### 기능
- 다중 프로필 지원
- 난이도 선택 (쉬움/보통/어려움)
- 학습 리포트
- 리더보드
- PWA 지원 (오프라인 사용 가능)
- 접근성 기능 (WCAG 준수)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **PWA**: next-pwa

## 시작하기

### 요구 사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/kiply.git
cd kiply

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 프로젝트 구조

```
kiply/
├── app/                    # Next.js App Router 페이지
│   ├── games/             # 게임 페이지
│   ├── about/             # 소개 페이지
│   ├── privacy/           # 개인정보처리방침
│   ├── terms/             # 이용약관
│   └── ...
├── components/            # React 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   └── user/             # 사용자 관련 컴포넌트
├── stores/               # Zustand 스토어
├── types/                # TypeScript 타입 정의
├── public/               # 정적 파일
│   └── images/           # 이미지 및 SVG
└── ...
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
