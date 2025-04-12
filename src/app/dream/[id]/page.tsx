import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserAvatar from '@/components/user-avatar';
import { Dream, Comment } from '../../../types';
import { getMoodColor, getMoodIcon, formatDate } from '@/lib/utils';
import BackButton from '@/components/BackButton';

// Mock data fetching functions
async function fetchDreamById(id: string): Promise<Dream | null> {
  // This would be replaced with a real API call
  const dreams: Dream[] = [
    {
      id: '1',
      content: 'I was flying over mountains, feeling completely free. The wind was rushing through my hair and I could see for miles.',
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
      content: 'Dreamt I was being chased through a maze by shadowy figures. Every turn led to another dead end.',
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
      content: 'Had a dream about my childhood home, but all the rooms were different. My family was there, but they looked slightly off.',
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
      content: 'Wow, that sounds amazing! I wish I had dreams like this.',
      createdAt: '2025-04-10T10:15:00Z',
      user: {
        id: 'user4',
        name: 'Taylor Kim',
        avatar: '/avatars/taylor.jpg'
      }
    },
    {
      id: 'c2',
      content: 'This reminds me of a similar dream I had last week. Did you notice any specific details about the mountains?',
      createdAt: '2025-04-10T14:22:00Z',
      user: {
        id: 'user5',
        name: 'Riley Smith',
      }
    },
    {
      id: 'c3',
      content: 'Dreams about flying usually represent freedom and breaking free from constraints. Have you been feeling trapped lately?',
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


function CommentForm({ dreamId }: { dreamId: string }) {
  return (
    <form className="mt-6">
      <div className="flex gap-3">
        <UserAvatar 
          user={{ 
            id: getCurrentUserId(), 
            name: 'Alex Chen', 
            avatar: '/avatars/alex.jpg' 
          }} 
          className="w-8 h-8" 
        />
        <div className="flex-1">
          <textarea 
            placeholder="Add a comment..." 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default async function DreamPage({ params }: { params: { id: string } }) {
  const dream = await fetchDreamById(params.id);
  
  if (!dream) {
    notFound();
  }
  
  const currentUserId = getCurrentUserId();
  const isOwner = dream.user.id === currentUserId;
  const canViewContent = isOwner || dream.visibility !== 'private';
  const canViewComments = canViewContent && dream.visibility !== 'private';
  
  // Get comments only if they should be visible
  const comments = canViewComments ? await fetchComments(dream.id) : [];
  
  // Get mood color for styling
  const moodColor = getMoodColor(dream.mood);
  const MoodIcon = getMoodIcon(dream.mood);
  
  return (
    <div 
      className={`min-h-screen px-4 py-6 ${canViewContent ? `bg-${moodColor}-50` : 'bg-gray-50'}`}
      style={{ 
        background: canViewContent 
          ? `linear-gradient(to bottom, ${moodColor}10, ${moodColor}05)` 
          : undefined 
      }}
    >
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Dream Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header with user info */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar user={dream.user} className="w-10 h-10" />
              <div>
                <h2 className="font-medium text-gray-900">{dream.user.name}</h2>
                <p className="text-sm text-gray-500">{formatDate(dream.createdAt)}</p>
              </div>
            </div>
            {MoodIcon && (
              <div className={`p-2 rounded-full text-${moodColor}-700`}>
                <span className="text-2xl">{MoodIcon}</span>
              </div>
            )}
          </div>
          
          {/* Dream content */}
          {canViewContent ? (
            <div className="p-6">
              <p className="text-lg whitespace-pre-wrap leading-relaxed text-gray-800">
                {dream.content}
              </p>
              
              {/* Visibility indicator */}
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                {dream.visibility === 'private' && (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Private
                  </>
                )}
                {dream.visibility === 'close_friends' && (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Close Friends
                  </>
                )}
                {dream.visibility === 'public' && (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Public
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">This dream is private</h3>
              <p className="mt-2 text-gray-500">Only the author can view this dream.</p>
            </div>
          )}
        </div>
        
        {/* Comments section */}
        {canViewComments && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>
            
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <UserAvatar user={comment.user} className="w-8 h-8" />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
            
            <CommentForm dreamId={dream.id} />
          </div>
        )}
      </div>
    </div>
  );
}