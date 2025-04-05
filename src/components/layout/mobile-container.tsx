import React from 'react';
import { BottomNav } from './bottom-nav';

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-zinc-900 p-0 sm:p-4 md:p-8">
      <div className="w-full sm:max-w-md md:max-w-md sm:h-[844px] bg-background sm:rounded-[40px] sm:shadow-2xl border border-zinc-800 relative flex flex-col">
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Sticky footer */}
        <div className="shrink-0">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
