'use client';

import { useEffect, ReactNode } from 'react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const { settings, _hasHydrated } = useAccessibilityStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    const body = document.body;

    // High contrast mode
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Large text mode
    if (settings.largeText) {
      body.classList.add('large-text');
    } else {
      body.classList.remove('large-text');
    }

    // Reduced motion mode
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }, [settings, _hasHydrated]);

  return <>{children}</>;
}
