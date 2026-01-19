import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { PWARegister } from "./components/PWARegister";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { Nav, Footer } from "../components/ui";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiply.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Kiply - 놀면서 자라는 우리 아이",
    template: "%s | Kiply",
  },
  description: "6~12세 어린이를 위한 교육용 미니게임 플랫폼. 수학, 언어, 기억력, 집중력을 재미있는 게임으로 키워보세요.",
  keywords: [
    "키플리",
    "Kiply",
    "어린이 게임",
    "교육용 게임",
    "미니게임",
    "수학 게임",
    "기억력 게임",
    "집중력 게임",
    "아동 교육",
    "학습 게임",
    "키즈 게임",
  ],
  authors: [{ name: "Kiply Team" }],
  creator: "Kiply",
  publisher: "Kiply",
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Kiply",
    title: "Kiply - 놀면서 자라는 우리 아이",
    description: "6~12세 어린이를 위한 교육용 미니게임 플랫폼. 수학, 언어, 기억력, 집중력을 재미있는 게임으로 키워보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiply - 놀면서 자라는 우리 아이",
    description: "6~12세 어린이를 위한 교육용 미니게임 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kiply",
  },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2DD4BF",
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
          <div className="min-h-dvh flex flex-col">
            <Nav />
            <main id="main-content" className="flex-1 flex flex-col" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
