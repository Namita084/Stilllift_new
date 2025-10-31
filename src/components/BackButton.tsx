'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || pathname === '/') return null;

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="control-btn glass-control"
    >
      <ArrowLeft className="control-icon" size={18} />
    </button>
  );
}


