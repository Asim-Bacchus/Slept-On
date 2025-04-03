import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi, Jamie 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
        Here&apos;s your sleep summary.
        </p>
      </div>
      
      <div className="grid gap-3">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between items-center">
              <span>Last Night</span>
              <span className="text-primary">Good</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-2xl font-bold">8h 0m</div>
            <p className="text-xs text-muted-foreground">
              22:30 - 06:30
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Week Avg
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">7h 37m</div>
              <p className="text-xs text-muted-foreground">
                +23m from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Sleep Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">82/100</div>
              <p className="text-xs text-muted-foreground">
                +4 from last week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-3">Weekly Overview</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-end h-40 mb-2">
              <div className="flex flex-col items-center">
                <div className="h-16 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Mon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-20 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Tue</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-32 w-5 bg-primary rounded-t-sm"></div>
                <span className="text-xs mt-2">Wed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-14 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Thu</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Fri</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-28 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Sat</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-28 w-5 bg-primary/30 rounded-t-sm"></div>
                <span className="text-xs mt-2">Sun</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Sleep Tips</h2>
          <Button variant="ghost" size="sm" className="text-xs">View All</Button>
        </div>
        <Card className="bg-blue-950/30 border-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-500/20 p-2 mt-0.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-blue-400"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">Consistent Bedtime</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Try to go to bed within 30 minutes of your target time (10:30 PM).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
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
                  <p className="text-sm font-medium">Added sleep log</p>
                  <p className="text-xs text-muted-foreground">
                    You slept for 8h 0m (22:30 - 06:30)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today at 7:14 AM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/10 p-2 mt-0.5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4 text-green-500"
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
                  <p className="text-sm font-medium">Earned achievement</p>
                  <p className="text-xs text-muted-foreground">
                    7-Day Streak: Track your sleep for 7 consecutive days
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today at 7:14 AM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}