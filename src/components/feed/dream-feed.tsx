"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DreamPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  mood: string;
  color: string;
  timestamp: string;
  isPrivate: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: string;
}
interface IconProps extends React.SVGProps<SVGSVGElement> {
    // You can add additional props specific to icons here if needed
  }
  
export default function DreamFeed() {
  // Sample dream posts
  const [dreams, setDreams] = useState<DreamPost[]>([
    {
      id: "1",
      user: {
        name: "Jamie",
        initials: "JD",
      },
      content: "I was flying over a neon desert... The sky was melting into purple waves, and I could feel the warm air rushing through my fingers. Every time I dipped lower, the sand would rise up to meet me like it was breathing.",
      mood: "✨",
      color: "bg-purple-500/5 border-purple-500/10",
      timestamp: "2h ago • Just for me",
      isPrivate: true,
      replies: [],
    },
    {
      id: "2",
      user: {
        name: "Alex",
        initials: "AC",
      },
      content: "Had that recurring ocean dream again. I'm standing on the shore watching enormous waves, taller than skyscrapers, but they never reach me. I feel both terrified and calm at the same time.",
      mood: "🌊",
      color: "bg-blue-500/5 border-blue-500/10",
      timestamp: "Yesterday • Close friends",
      isPrivate: false,
      replies: [
        {
          id: "r1",
          user: {
            name: "Morgan",
            initials: "ML",
          },
          content: "I've had similar dreams about giant waves! I think it represents feeling overwhelmed but also in awe of something powerful.",
          timestamp: "12h ago",
        },
      ],
    },
    {
      id: "3",
      user: {
        name: "You",
        initials: "YO",
      },
      content: "Dreamt I was in my childhood home, but all the rooms were rearranged. I opened a door I'd never seen before and found a garden growing inside, with vines climbing up to a glass ceiling. The light was so golden and warm.",
      mood: "💭",
      color: "bg-amber-500/5 border-amber-500/10",
      timestamp: "2d ago • Close friends",
      isPrivate: false,
      replies: [
        {
          id: "r2",
          user: {
            name: "Jamie",
            initials: "JD",
          },
          content: "This is beautiful. I love the idea of finding unexpected growth in familiar spaces.",
          timestamp: "1d ago",
        },
        {
          id: "r3",
          user: {
            name: "Taylor",
            initials: "TW",
          },
          content: "Your dreams are always so vivid! I wish I could step into them.",
          timestamp: "1d ago",
        },
      ],
    },
  ]);

  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleShowReply = (dreamId: string) => {
    setShowReplyInput(showReplyInput === dreamId ? null : dreamId);
    setReplyText("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Dream Space</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </header>

      <div className="space-y-8">
        {dreams.map((dream) => (
          <div 
            key={dream.id} 
            className={`rounded-xl ${dream.color} border p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md`}
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={dream.user.avatar} />
                <AvatarFallback>{dream.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{dream.user.name}</span>
                  <span className="text-xs">{dream.mood}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dream.timestamp}
                </p>
              </div>
              {dream.isPrivate && (
                <div className="rounded-full bg-background/50 p-1">
                  <LockIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-3 max-w-prose mb-3">
              <p className="italic text-foreground/90 font-light leading-relaxed">
                {dream.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-foreground h-7 px-2.5"
                onClick={() => handleShowReply(dream.id)}
              >
                <MessageCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                {dream.replies.length > 0 ? `Replies (${dream.replies.length})` : "Reply"}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground h-7 px-2.5"
              >
                <HeartIcon className="h-3.5 w-3.5 mr-1.5" />
                Send love
              </Button>
            </div>

            {(dream.replies.length > 0 || showReplyInput === dream.id) && (
              <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                {dream.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={reply.user.avatar} />
                      <AvatarFallback className="text-[10px]">{reply.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-medium text-xs">{reply.user.name}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                        {reply.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {showReplyInput === dream.id && (
                  <div className="flex items-start gap-2 animate-in fade-in duration-200">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/your-avatar.jpg" />
                      <AvatarFallback className="text-[10px]">YO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative">
                      <textarea
                        className="w-full bg-muted rounded-2xl rounded-tl-none p-3 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Share your thoughts..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        className="absolute bottom-2 right-2 h-7 rounded-full" 
                        disabled={!replyText.trim()}
                      >
                        <SendIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full h-12 w-12 shadow-lg">
          <PencilIcon className="h-5 w-5" />
          <span className="sr-only">New dream</span>
        </Button>
      </div>
    </div>
  );
}

// Icons
function PlusIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function LockIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MessageCircleIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function HeartIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function SendIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function PencilIcon(props: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}