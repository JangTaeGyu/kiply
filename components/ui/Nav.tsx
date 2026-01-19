'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Nav() {
  const pathname = usePathname();

  // Don't show nav on game play pages
  const isGamePage = pathname?.startsWith('/games/') && pathname !== '/games';

  if (isGamePage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/mascot.svg"
              alt="Kiply"
              width={32}
              height={32}
              className="drop-shadow-sm"
            />
            <span className="font-bold text-lg text-primary">Kiply</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
