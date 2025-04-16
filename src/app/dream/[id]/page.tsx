import { notFound } from 'next/navigation';
import { Dream, Comment } from '@/types';
import { getMoodColor, getMoodIcon, formatDate } from '@/lib/utils';
import {
  getUserInitials,
  getCurrentUser,
  getVisibilityLabel,
  getMoodBgClass,
} from '@/lib/helpers';
import BackButton from '@/components/BackButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CommentCard from '@/components/comment-card';
import CommentForm from '@/components/comment-form';
import { LockIcon } from '@/components/icons';

// Mock data fetching functions
async function fetchDreamById(id: string): Promise<Dream | null> {
  const dreams: Dream[] = [
    {
      id: '1',
      content: 'I was flying over mountains, feeling completely free...',
      mood: 'peaceful',
      createdAt: '2025-04-10T08:30:00Z',
      visibility: 'public',
      user: {
        id: 'user1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
      },
    },
    {
      id: '2',
      content: 'Dreamt I was being chased through a maze by shadowy figures...',
      mood: 'anxious',
      createdAt: '2025-04-11T03:15:00Z',
      visibility: 'private',
      user: {
        id: 'user2',
        name: 'Jordan Lee',
      },
    },
    {
      id: '3',
      content:
        'Had a dream about my childhood home, but all the rooms were different...',
      mood: 'nostalgic',
      createdAt: '2025-04-09T22:45:00Z',
      visibility: 'close_friends',
      user: {
        id: 'user3',
        name: 'Sam Taylor',
        avatar: '/avatars/sam.jpg',
      },
    },
  ];

  await new Promise(resolve => setTimeout(resolve, 500));
  return dreams.find(dream => dream.id === id) || null;
}

async function fetchComments(dreamId: string): Promise<Comment[]> {
  const comments: Comment[] = [
    {
      id: 'c1',
      content: 'Wow, that sounds amazing! I wish I had dreams like this.',
      createdAt: '2025-04-10T10:15:00Z',
      user: {
        id: 'user4',
        name: 'Taylor Kim',
        avatar: '/avatars/taylor.jpg',
      },
    },
    {
      id: 'c2',
      content: 'This reminds me of a similar dream I had last week.',
      createdAt: '2025-04-10T14:22:00Z',
      user: {
        id: 'user5',
        name: 'Riley Smith',
      },
    },
    {
      id: 'c3',
      content: 'Dreams about flying usually represent freedom...',
      createdAt: '2025-04-11T09:05:00Z',
      user: {
        id: 'user6',
        name: 'Morgan Davis',
        avatar: '/avatars/morgan.jpg',
      },
    },
  ];

  if (dreamId === '1' || dreamId === '3') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return comments;
  }
  return [];
}

export default async function DreamPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const dream = await fetchDreamById(id);
  if (!dream) notFound();

  const currentUser = getCurrentUser();
  const isOwner = dream.user.id === currentUser.id;
  if (dream.visibility === 'private' && !isOwner) notFound();

  const comments = dream.visibility !== 'private' ? await fetchComments(dream.id) : [];
  const moodIcon = getMoodIcon(dream.mood);
  const visibilityText = getVisibilityLabel(dream.visibility);
  const bgColorClass = getMoodBgClass(dream.mood);

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-6 pb-16">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className={`rounded-xl ${bgColorClass} border p-5 shadow-sm transition-all duration-300 ease-in-out`}>
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

          <div className="space-y-4 max-w-prose">
            <p className="italic text-foreground/90 font-light leading-relaxed">
              {dream.content}
            </p>
          </div>
        </div>

        {dream.visibility !== 'private' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                {comments.length > 0 ? `Replies (${comments.length})` : 'Replies'}
              </h3>
            </div>

            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map(comment => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic mb-4">
                No replies yet. Be the first to share your thoughts.
              </p>
            )}

            <CommentForm dreamId={dream.id} />
          </div>
        )}
      </div>
    </div>
  );
}
