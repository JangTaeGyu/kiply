import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Kiply - 놀면서 자라는 우리 아이';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2DD4BF 0%, #06B6D4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Star mascot */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 512 512"
          style={{ marginBottom: 30 }}
        >
          <defs>
            <linearGradient id="starBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFD93D' }} />
              <stop offset="100%" style={{ stopColor: '#FF9F1C' }} />
            </linearGradient>
          </defs>
          <g transform="translate(256, 256) scale(2.5)">
            <path
              d="M0 -60 L14 -20 L58 -20 L22 5 L35 50 L0 25 L-35 50 L-22 5 L-58 -20 L-14 -20 Z"
              fill="url(#starBody)"
              stroke="#FF9F1C"
              strokeWidth="2"
            />
            <circle cx="0" cy="-5" r="25" fill="#FFF5D6" />
            <ellipse cx="-10" cy="-10" rx="6" ry="7" fill="#2D3436" />
            <ellipse cx="-8" cy="-12" rx="2" ry="3" fill="#FFFFFF" />
            <ellipse cx="10" cy="-10" rx="6" ry="7" fill="#2D3436" />
            <ellipse cx="12" cy="-12" rx="2" ry="3" fill="#FFFFFF" />
            <path
              d="M-10 5 Q0 15 10 5"
              fill="none"
              stroke="#2D3436"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="-20" cy="0" rx="6" ry="4" fill="rgba(45,212,191,0.4)" />
            <ellipse cx="20" cy="0" rx="6" ry="4" fill="rgba(45,212,191,0.4)" />
          </g>
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textShadow: '2px 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          Kiply
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
          }}
        >
          놀면서 자라는 우리 아이
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
            display: 'flex',
            gap: 20,
          }}
        >
          <span>🎮 교육용 미니게임</span>
          <span>📚 수학 · 언어 · 기억력</span>
          <span>👶 6~12세</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
