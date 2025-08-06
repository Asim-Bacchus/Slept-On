// components/CommentSection.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createComment } from '@/lib/db';
import { getCurrentUser, getUserInitials } from '@/lib/helpers';
import { formatDate } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentSectionProps {
  dreamId: string;
  initialComments: Comment[];
  accentColor: string;
}

// Function to get the accent color for comment bubbles
function getCommentBubbleColor(accentColor: string): string {
  const COLORS: Record<string, string> = {
    red: "bg-red-500/20 border border-red-400/30",
    orange: "bg-orange-500/20 border border-orange-400/30",
    yellow: "bg-yellow-500/20 border border-yellow-400/30",
    green: "bg-emerald-500/20 border border-emerald-400/30",
    blue: "bg-blue-500/20 border border-blue-400/30",
    purple: "bg-purple-500/20 border border-purple-400/30",
    pink: "bg-pink-500/20 border border-pink-400/30",
    black: "bg-gray-800/40 border border-gray-700/50",
    gray: "bg-gray-500/20 border border-gray-400/30",
    white: "bg-gray-200/30 border border-gray-300/40",
  };
  return COLORS[accentColor] || "bg-gray-500/20 border border-gray-400/30";
}

export default function CommentSection({ dreamId, initialComments, accentColor }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  
  const currentUser = getCurrentUser();
  const bubbleColorClass = getCommentBubbleColor(accentColor);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const newComment = await createComment(dreamId, replyText.trim(), currentUser.id);
      if (newComment) {
        setComments(prev => [...prev, newComment]);
        setReplyText('');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">
          {comments.length > 0 ? `Replies (${comments.length})` : 'Replies'}
        </h3>
      </div>

      {/* Existing Comments */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">
                  {getUserInitials(comment.user?.name || 'Unknown')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`rounded-2xl px-4 py-3 ${bubbleColorClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-foreground">
                      {comment.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No replies yet. Be the first to share your thoughts.
          </p>
        </div>
      )}

      {/* Reply Input */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Add a reply</h4>
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">
              {getUserInitials(currentUser.name)}
            </span>
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              className="w-full bg-background border border-muted/50 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary transition-colors min-h-[100px]"
              placeholder="Share your thoughts about this dream..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={submittingReply}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {replyText.length}/500
              </span>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setReplyText('')}
                  disabled={submittingReply || !replyText.trim()}
                  className="text-sm"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || submittingReply}
                  className="text-sm px-6"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}