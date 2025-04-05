'use client';

import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  return (
    <div className="w-full h-16 border-t border-border bg-background flex items-center justify-around">
      <Link href="/home">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHome ? 'bg-primary/20' : ''}`}>
          <HomeIcon className="h-5 w-5 text-primary" />
        </div>
      </Link>
      {/* Future nav buttons here */}
    </div>
  );
}
