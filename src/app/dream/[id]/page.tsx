import { notFound } from 'next/navigation';
import { Dream, Comment } from '../../../types';
import { getMoodColor, getMoodIcon, formatDate } from '@/lib/utils';
import BackButton from '@/components/BackButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mock data fetching functions
async function fetchDreamById(id: string): Promise<Dream | null> {
  // This would be replaced with a real API call
  const dreams: Dream[] = [
    {
      id: '1',
      content: 'I was flying over mountains, feeling completely free. The wind was rushing through my hair and I could see for miles. The sky was impossibly blue, and I could feel the warmth of the sun on my skin despite the cool air rushing past me. Below, the mountains were covered in pine forests that seemed to stretch endlessly.',
      mood: 'peaceful',
      createdAt: '2025-04-10T08:30:00Z',
      visibility: 'public',
      user: {
        id: 'user1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg'
      }
    },
    {
      id: '2',
      content: 'Dreamt I was being chased through a maze by shadowy figures. Every turn led to another dead end. The walls kept shifting when I wasn\'t looking, and the ceiling seemed to get lower with each minute. I could hear whispers just beyond the walls but couldn\'t make out what they were saying.',
      mood: 'anxious',
      createdAt: '2025-04-11T03:15:00Z',
      visibility: 'private',
      user: {
        id: 'user2',
        name: 'Jordan Lee',
      }
    },
    {
      id: '3',
      content: 'Had a dream about my childhood home, but all the rooms were different. My family was there, but they looked slightly off. The kitchen had expanded into an enormous space with windows overlooking an ocean that shouldn\'t have been there. In the living room, the furniture floated a few inches off the ground, but everyone acted like this was normal.',
      mood: 'nostalgic',
      createdAt: '2025-04-09T22:45:00Z',
      visibility: 'close_friends',
      user: {
        id: 'user3',
        name: 'Sam Taylor',
        avatar: '/avatars/sam.jpg'
      }
    }
  ];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dreams.find(dream => dream.id === id) || null;
}

async function fetchComments(dreamId: string): Promise<Comment[]> {
  // This would be replaced with a real API call
  const comments: Comment[] = [
    {
      id: 'c1',
      content: 'Wow, that sounds amazing! I wish I had dreams like this. When I fly in dreams, I always end up hitting power lines or getting stuck.',
      createdAt: '2025-04-10T10:15:00Z',
      user: {
        id: 'user4',
        name: 'Taylor Kim',
        avatar: '/avatars/taylor.jpg'
      }
    },
    {
      id: 'c2',
      content: 'This reminds me of a similar dream I had last week. Did you notice any specific details about the mountains? Were they familiar or somewhere you\'ve never been?',
      createdAt: '2025-04-10T14:22:00Z',
      user: {
        id: 'user5',
        name: 'Riley Smith',
      }
    },
    {
      id: 'c3',
      content: 'Dreams about flying usually represent freedom and breaking free from constraints. Have you been feeling trapped lately? Or maybe you just made a big decision that\'s giving you a sense of relief?',
      createdAt: '2025-04-11T09:05:00Z',
      user: {
        id: 'user6',
        name: 'Morgan Davis',
        avatar: '/avatars/morgan.jpg'
      }
    }
  ];

  // Only return comments for dream ID 1 (public) and 3 (close_friends)
  if (dreamId === '1' || dreamId === '3') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return comments;
  }
  
  return [];
}

// This would be replaced with actual auth logic
function getCurrentUserId(): string {
  return 'user1'; // For demo, let's assume we're logged in as user1
}

// Helper to get user initials
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function CommentForm({ dreamId }: { dreamId: string }) {
  return (
    <div className="flex items-start gap-2 animate-in fade-in duration-200 mt-4">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src="/avatars/alex.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <textarea
          className="w-full bg-muted rounded-2xl rounded-tl-none p-3 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Share your thoughts..."
        />
        <Button 
          size="sm" 
          className="absolute bottom-2 right-2 h-7 rounded-full" 
        >
          <SendIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}

export default async function DreamPage({ params }: { params: { id: string } }) {
  // Access id synchronously as you mentioned
  const { id } = params;
  
  const dream = await fetchDreamById(id);
  
  if (!dream) {
    notFound();
  }
  
  const currentUserId = getCurrentUserId();
  const isOwner = dream.user.id === currentUserId;
  
  // If this is a private dream and the current user is not the owner, show 404
  if (dream.visibility === 'private' && !isOwner) {
    notFound();
  }
  
  const canViewComments = dream.visibility !== 'private';
  
  // Get comments only if they should be visible
  const comments = canViewComments ? await fetchComments(dream.id) : [];
  
  // Get mood color and icon for styling
  const moodColor = getMoodColor(dream.mood);
  const moodIcon = getMoodIcon(dream.mood);
  
  // Map visibility to more user-friendly text
  const visibilityText = {
    'private': 'Just for me',
    'close_friends': 'Close friends',
    'public': 'Everyone'
  }[dream.visibility];
  
  // Get background color class based on mood
  const getBgColorClass = () => {
    switch(dream.mood) {
      case 'peaceful': return 'bg-blue-500/5 border-blue-500/10';
      case 'anxious': return 'bg-red-500/5 border-red-500/10';
      case 'nostalgic': return 'bg-amber-500/5 border-amber-500/10';
      default: return 'bg-purple-500/5 border-purple-500/10';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-6 pb-16">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Dream Card */}
        <div 
          className={`rounded-xl ${getBgColorClass()} border p-5 shadow-sm transition-all duration-300 ease-in-out`}
        >
          {/* Header with user info */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={dream.user.avatar} />
              <AvatarFallback>{getUserInitials(dream.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{dream.user.name}</span>
                <span className="text-sm">{moodIcon}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(dream.createdAt)} • {visibilityText}
              </p>
            </div>
            {dream.visibility === 'private' && (
              <div className="rounded-full bg-background/50 p-1">
                <LockIcon className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Dream content */}
          <div className="space-y-4 max-w-prose">
            <p className="italic text-foreground/90 font-light leading-relaxed">
              {dream.content}
            </p>
          </div>
        </div>
        
        {/* Comments section */}
        {canViewComments && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                {comments.length > 0 ? `Replies (${comments.length})` : "Replies"}
              </h3>
            </div>
            
            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback className="text-xs">{getUserInitials(comment.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-medium text-xs">{comment.user.name}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic mb-4">No replies yet. Be the first to share your thoughts.</p>
            )}
            
            <CommentForm dreamId={dream.id} />
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
  // You can add additional props specific to icons here if needed
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