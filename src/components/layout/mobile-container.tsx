import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-zinc-900 p-0 sm:p-4 md:p-8">
      <div className="w-full max-w-md h-[100vh] sm:h-[844px] overflow-auto bg-background sm:rounded-[40px] sm:shadow-2xl border border-zinc-800 relative">
        {children}
      </div>
    </div>
  );
}