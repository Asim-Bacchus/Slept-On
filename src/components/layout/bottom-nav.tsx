'use client';

import { HomeIcon, MoonIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const isDreams = pathname === '/dreams';
  const isFeed = pathname === '/feed';

  return (
    <div className="w-full h-16 border-t border-border bg-background flex items-center justify-around">
      <Link href="/home" className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHome ? 'bg-primary/20' : ''}`}>
          <HomeIcon className={`h-5 w-5 ${isHome ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <span className={`text-xs mt-0.5 ${isHome ? 'text-primary' : 'text-muted-foreground'}`}>Home</span>
      </Link>
      
      <Link href="/feed" className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFeed ? 'bg-primary/20' : ''}`}>
          <UsersIcon className={`h-5 w-5 ${isFeed ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <span className={`text-xs mt-0.5 ${isFeed ? 'text-primary' : 'text-muted-foreground'}`}>Feed</span>
      </Link>
      
      <Link href="/dreams" className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDreams ? 'bg-primary/20' : ''}`}>
          <MoonIcon className={`h-5 w-5 ${isDreams ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <span className={`text-xs mt-0.5 ${isDreams ? 'text-primary' : 'text-muted-foreground'}`}>Dreams</span>
      </Link>
      
      {/* Future nav buttons here */}
    </div>
  );
}