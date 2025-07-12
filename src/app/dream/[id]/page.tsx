// src/app/dream/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getDreamById, getComments } from '@/lib/db';
import { getMoodIcon, formatDate } from '@/lib/utils';
import {
  getUserInitials,
  getCurrentUser,
  getVisibilityLabel,
  getMoodBgClass,
} from '@/lib/helpers';
import BackButton from '@/components/BackButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LockIcon } from '@/components/icons';
import CommentCard from '@/components/comment-card';
import CommentForm from '@/components/comment-form';

export default async function DreamPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const dream = await getDreamById(id);
  if (!dream) return notFound();

  const currentUser = getCurrentUser(); // Still mock
  const isOwner = dream.user?.id === currentUser.id;

  // Handle private dream access
  if (dream.visibility === 'private' && !isOwner) return notFound();

  // Fetch comments only if visible
  const comments = dream.visibility !== 'private'
    ? await getComments(dream.id)
    : [];

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
              <AvatarImage src={dream.user?.avatar} />
              <AvatarFallback>
                {getUserInitials(dream.user?.name || '??')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{dream.user?.name}</span>
                <span className="text-sm">{moodIcon}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(dream.created_at)} • {visibilityText}
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
