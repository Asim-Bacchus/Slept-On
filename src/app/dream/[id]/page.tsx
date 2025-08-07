// src/app/dream/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getDreamById, getComments } from '@/lib/db';
import { getUserInitials, getCurrentUser } from '@/lib/helpers';
import { formatDate, getColorClass } from '@/lib/utils';
import BackButton from '@/components/BackButton';
import CommentSection from '@/components/CommentSection';
import { HeartIcon } from '@/components/icons';
import ReactionWheel, { PressAndDrag } from '@/components/ReactionWheel';

export default function DreamPageWrapper() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  return <DreamPage id={id} />;
}

function DreamPage({ id }: { id: string }) {
  const [dream, setDream] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [reactionOpen, setReactionOpen] = useState(false);
  const [reactionCenter, setReactionCenter] = useState<{ x: number; y: number } | undefined>();
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | undefined>();
  const reactionTriggerRef = useRef<HTMLDivElement>(null);

  const fetchDream = async () => {
    const dreamData = await getDreamById(id);
    if (!dreamData) return;

    const currentUser = getCurrentUser();
    const owner = dreamData.user_id === currentUser.id;
    setIsOwner(owner);

    if (dreamData.visibility === 'private' && !owner) return;

    setDream(dreamData);

    if (dreamData.visibility !== 'private') {
      const commentData = await getComments(dreamData.id);
      setComments(commentData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDream();
  }, []);

  const handleReact = useCallback((reactionType: string) => {
    console.log('Reacted with:', reactionType);
    setReactionOpen(false);
    setReactionCenter(undefined);
    setDragPos(undefined);
  }, []);

  const handleStart = useCallback((pos: { x: number; y: number }) => {
    setReactionCenter(pos);
    setDragPos(pos);
    setReactionOpen(true);
  }, []);

  const handleMove = useCallback((pos: { x: number; y: number }) => {
    setDragPos(pos);
  }, []);

  const handleCancel = useCallback(() => {
    setReactionOpen(false);
    setReactionCenter(undefined);
    setDragPos(undefined);
  }, []);

  const handleEnd = useCallback((pos: { x: number; y: number }) => {
    setDragPos(pos);

    if (reactionCenter) {
      const dx = pos.x - reactionCenter.x;
      const dy = pos.y - reactionCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= 30) {
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;

        const REACTIONS = [
          { emoji: '❤️', type: 'heart', label: 'Love' },
          { emoji: '😂', type: 'lol', label: 'Funny' },
          { emoji: '😱', type: 'shocking', label: 'Shocking' },
          { emoji: '🤨', type: 'confusing', label: 'Confusing' },
          { emoji: '🤢', type: 'gross', label: 'Gross' },
          { emoji: '😔', type: 'pensive', label: 'Sad' },
          { emoji: '😎', type: 'cool', label: 'Cool' },
          { emoji: '💀', type: 'dead', label: 'Dead' },
          { emoji: '😰', type: 'anxious', label: 'Anxious' },
        ];

        const sectionAngle = 360 / REACTIONS.length;
        const index = Math.floor(angle / sectionAngle);
        const selected = REACTIONS[index]?.type;

        if (selected) {
          handleReact(selected);
          return;
        }
      }
    }

    // fallback: close the wheel
    handleCancel();
  }, [reactionCenter, handleReact, handleCancel]);
    if (loading || !dream) return null;



  const visibilityLabel = dream.visibility === 'private'
    ? 'Just for me'
    : dream.visibility === 'close_friends'
    ? 'Close friends'
    : 'Public';

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Dream Card */}
        <div className={`rounded-2xl ${getColorClass(dream.color_key ?? 'gray')} p-5 transition-all duration-200 ease-in-out`}>
          {/* User Info */}
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
          </div>

          {/* Dream Title & Content */}
          <div className="space-y-3">
            {dream.title && <h1 className="font-medium text-lg text-foreground">{dream.title}</h1>}
            <p className="text-foreground/80 leading-relaxed">{dream.content}</p>
          </div>

          {/* Reaction Trigger */}
          <div className="mt-4 flex justify-start">
            <PressAndDrag
              onDragStart={handleStart}
              onDragMove={handleMove}
              onDragEnd={handleEnd}
              onCancel={handleCancel}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center"
            >
              <div
                ref={reactionTriggerRef}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md transition hover:bg-muted/10"
              >
                <HeartIcon className="h-4 w-4" />
                <span>Drag to react</span>
              </div>
            </PressAndDrag>
          </div>
        </div>

        {/* Comments */}
        {dream.visibility !== 'private' && (
          <CommentSection
            dreamId={dream.id}
            initialComments={comments}
            accentColor={dream.color_key ?? 'gray'}
          />
        )}

        {/* Private Lock Message */}
        {dream.visibility === 'private' && !isOwner && (
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

      {/* Reaction Wheel */}
      <ReactionWheel
        isOpen={reactionOpen}
        onReact={handleReact}
        onClose={handleCancel}
        triggerRef={reactionTriggerRef}
        centerPosition={reactionCenter}
        dragPosition={dragPos}
      />
    </div>
  );
}

// Place this OUTSIDE all components — at the very bottom of your file
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
