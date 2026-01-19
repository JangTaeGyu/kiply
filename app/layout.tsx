import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { PWARegister } from "./components/PWARegister";
import { AccessibilityProvider } from "./components/AccessibilityProvider";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiply - 놀면서 자라는 우리 아이",
  description: "6~12세 어린이를 위한 교육용 미니게임",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kiply",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6C5CE7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${gowunDodum.variable} antialiased`}>
        <PWARegister />
        <AccessibilityProvider>
          <a href="#main-content" className="skip-link">
            메인 콘텐츠로 이동
          </a>
          <main id="main-content" className="min-h-dvh flex flex-col" role="main">
            {children}
          </main>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
