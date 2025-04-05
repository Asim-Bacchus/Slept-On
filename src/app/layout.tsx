import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { MobileContainer } from '@/components/layout/mobile-container';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SLEPT ON - Track, Share, Improve Your Sleep',
  description: 'A social app for tracking sleep patterns, connecting with friends, and improving sleep habits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <MobileContainer>
          {children}
        </MobileContainer>
        <Toaster />
      </body>
    </html>
  );
}