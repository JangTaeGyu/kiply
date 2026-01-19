import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { PWARegister } from "./components/PWARegister";

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
        <main className="min-h-dvh flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
