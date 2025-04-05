"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"alarms" | "bedtime">("alarms");
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 pb-20">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="relative">
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
            {/* Placeholder profile image */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-10 w-10 text-muted-foreground"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          
          {/* Camera icon for changing profile pic */}
          <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-3 w-3"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-lg font-medium mt-3">Welcome back, Jamie 👋</h2>
        <p className="text-sm text-muted-foreground">Sleep streak: 7 days</p>
      </div>
      
      {/* Alarm/Bedtime Toggle Section */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-muted p-1 rounded-full flex w-full max-w-xs">
            <button 
              onClick={() => setActiveTab("alarms")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === "alarms" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              }`}
            >
              Alarms
            </button>
            <button 
              onClick={() => setActiveTab("bedtime")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === "bedtime" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              }`}
            >
              Bedtime
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          {activeTab === "alarms" ? (
            <>
              <p className="text-sm text-muted-foreground">No alarms set.</p>
              <Button className="flex items-center" variant="outline">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mr-2"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Add Alarm
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No bedtime reminders yet.</p>
              <Button className="flex items-center" variant="outline">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mr-2"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Add Bedtime Reminder
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Weekly Sleep Progress Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Week of 4/6/2025
        </h3>
        
        <div className="flex justify-between items-end h-44 px-2">
          {/* Sunday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-muted"
                style={{ height: '40%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">S</span>
          </div>
          
          {/* Monday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-yellow-500"
                style={{ height: '70%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">M</span>
          </div>
          
          {/* Tuesday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-green-500"
                style={{ height: '85%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">T</span>
          </div>
          
          {/* Wednesday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-green-500"
                style={{ height: '90%' }}
              ></div>
            </div>
            <span className="text-xs font-medium">W</span>
          </div>
          
          {/* Thursday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-yellow-500"
                style={{ height: '60%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">T</span>
          </div>
          
          {/* Friday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-yellow-500"
                style={{ height: '75%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">F</span>
          </div>
          
          {/* Saturday */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-full flex items-end mb-2">
              <div 
                className="w-2 rounded-full bg-muted"
                style={{ height: '0%' }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">S</span>
          </div>
        </div>
        
        <div className="flex justify-between px-2 text-xs text-muted-foreground mt-2">
          <span>0h</span>
          <span>Goal: 8h</span>
          <span>12h</span>
        </div>
      </div>
      
      {/* Footer Navigation */}
      
      
        
        {/* Placeholder for future nav icons */}
        <div className="w-14 h-14"></div>
        <div className="w-14 h-14"></div>
      
    </div>
  );
}