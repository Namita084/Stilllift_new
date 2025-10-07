'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollRestorationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams?.toString();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, searchString]);

  return null;
}




