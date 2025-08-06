// src/app/dream/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getDreamById, getComments } from '@/lib/db';
import { formatDate, getColorClass } from '@/lib/utils';
import {
  getUserInitials,
  getCurrentUser,
} from '@/lib/helpers';
import BackButton from '@/components/BackButton';
import CommentSection from '@/components/CommentSection';

export default async function DreamPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const dream = await getDreamById(id);
  if (!dream) return notFound();

  const currentUser = getCurrentUser();
  const isOwner = dream.user_id === currentUser.id;

  // Handle private dream access
  if (dream.visibility === 'private' && !isOwner) return notFound();

  // Fetch comments only if visible
  const comments = dream.visibility !== 'private'
    ? await getComments(dream.id)
    : [];

  const visibilityLabel =
    dream.visibility === 'private'
      ? 'Just for me'
      : dream.visibility === 'close_friends'
      ? 'Close friends'
      : 'Public';

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Dream Card - matching feed design */}
        <div className={`rounded-2xl ${getColorClass(dream.color_key ?? 'gray')} p-5 transition-all duration-200 ease-in-out`}>
          {/* Header: User info and metadata in one clean line */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">
                {getUserInitials(dream.user?.name || '??')}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">{dream.user?.name}</span>
              {dream.emoji && <span className="text-sm">{dream.emoji}</span>}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formatDate(dream.created_at)}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{visibilityLabel}</span>
            </div>
            {dream.visibility === 'private' && (
              <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            {dream.title && (
              <h1 className="font-medium text-lg text-foreground">
                {dream.title}
              </h1>
            )}
            <p className="text-foreground/80 leading-relaxed">
              {dream.content}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        {dream.visibility !== 'private' && (
          <CommentSection 
            dreamId={dream.id} 
            initialComments={comments} 
            accentColor={dream.color_key ?? 'gray'} 
          />
        )}

        {/* Private Dream Notice */}
        {dream.visibility === 'private' && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
              <LockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                This is a private dream - only you can see it
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
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