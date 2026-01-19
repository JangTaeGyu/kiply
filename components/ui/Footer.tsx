'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const footerLinks = [
  { href: '/about', label: '소개' },
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/terms', label: '이용약관' },
];

export function Footer() {
  const pathname = usePathname();

  // Don't show footer on game play pages
  const isGamePage = pathname?.startsWith('/games/') && pathname !== '/games';

  if (isGamePage) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-primary/10 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/mascot.svg"
              alt="Kiply"
              width={28}
              height={28}
              className="opacity-70"
            />
            <div className="text-sm text-foreground/50">
              <span className="font-medium text-primary/70">Kiply</span>
              <span className="mx-2">·</span>
              <span>놀면서 자라는 우리 아이</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/40 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-primary/5 text-center">
          <p className="text-xs text-foreground/30">
            © {currentYear} Kiply. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
