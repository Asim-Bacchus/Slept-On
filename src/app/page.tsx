import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="px-4 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-5 w-5 text-primary"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <span className="font-bold text-lg">SLEPT ON</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-8 flex-1 flex flex-col justify-center bg-gradient-to-t from-card to-background">
        <div className="px-4 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-24 w-24 text-primary opacity-90"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <h1 className="text-4xl font-bold tracking-tight">
              SLEPT ON
            </h1>
            <p className="text-lg text-muted-foreground">
              Track, share, and improve your sleep habits
            </p>
          </div>
          
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/register" className="w-full">
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/home" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Simple for mobile */}
      <section className="w-full py-8 px-4">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">
            Why use SLEPT ON?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Track Your Sleep</h3>
                <p className="text-sm text-muted-foreground">Log your sleep patterns and get insights on quality and duration.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Connect with Friends</h3>
                <p className="text-sm text-muted-foreground">Share your sleep achievements and see how friends are sleeping.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-primary"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Earn Achievements</h3>
                <p className="text-sm text-muted-foreground">Get rewarded for establishing healthy sleep habits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simple version */}
      <footer className="py-4 px-4 text-center text-xs text-muted-foreground">
        © 2025 SLEPT ON. All rights reserved.
      </footer>
    </div>
  );
}