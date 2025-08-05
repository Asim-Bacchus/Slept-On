'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDreams, getComments, createComment } from '@/lib/db';
import { Dream, Comment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LockIcon, MessageCircleIcon, HeartIcon, PencilIcon, PlusIcon, SendIcon } from '@/components/icons';
import { getUserInitials, getCurrentUser } from '@/lib/helpers';
import { formatDate, getColorClass } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DreamFeed() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  
  const pathname = usePathname();
  const currentUser = getCurrentUser();

  useEffect(() => {
    async function load() {
      const data = await getDreams();
      setDreams(data);
      setLoading(false);
    }
    load();
  }, [pathname]);

  const loadCommentsForDream = async (dreamId: string) => {
    if (comments[dreamId] || loadingComments[dreamId]) return;
    
    setLoadingComments(prev => ({ ...prev, [dreamId]: true }));
    try {
      const dreamComments = await getComments(dreamId);
      setComments(prev => ({ ...prev, [dreamId]: dreamComments }));
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [dreamId]: false }));
    }
  };

  const handleShowReply = async (dreamId: string) => {
    if (showReplyInput === dreamId) {
      setShowReplyInput(null);
      setReplyText('');
    } else {
      setShowReplyInput(dreamId);
      setReplyText('');
      await loadCommentsForDream(dreamId);
    }
  };

  const handleSubmitReply = async (dreamId: string) => {
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const realUserId = 'f9c8b5a2-0d72-4f89-ae03-f91fd3f4b732';
      const newComment = await createComment(dreamId, replyText.trim(), realUserId);
      if (newComment) {
        setComments(prev => ({
          ...prev,
          [dreamId]: [...(prev[dreamId] || []), newComment]
        }));
        setReplyText('');
        setShowReplyInput(null);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto w-full">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-muted/20 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
        <header className="flex items-center justify-between mb-8 max-w-md mx-auto w-full">
          <h1 className="text-xl font-medium text-foreground">Dream Space</h1>
          <Link href="/compose">
            <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center text-center max-w-md mx-auto">
          <div>
            <h2 className="text-lg font-medium mb-2 text-foreground">No dreams yet</h2>
            <p className="text-muted-foreground mb-6">Be the first to share a dream!</p>
            <Link href="/compose">
              <Button className="rounded-full">Share your first dream</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      <header className="flex items-center justify-between mb-8 max-w-md mx-auto w-full">
        <h1 className="text-xl font-medium text-foreground">Dream Space</h1>
        <Link href="/compose">
          <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      <div className="max-w-md mx-auto w-full space-y-6">
        {dreams.map((dream) => {
          const initials = getUserInitials(dream.user?.name || '??');
          const visibilityLabel =
            dream.visibility === 'private'
              ? 'Just for me'
              : dream.visibility === 'close_friends'
              ? 'Close friends'
              : 'Public';

          const dreamComments = comments[dream.id] || [];
          const isLoadingComments = loadingComments[dream.id];

          return (
            <div
              key={dream.id}
              className={`rounded-2xl ${getColorClass(dream.color_key ?? 'gray')} p-5 transition-all duration-200 ease-in-out hover:shadow-md`}
            >
              {/* Header: User info and metadata in one clean line */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={dream.user?.avatar} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
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
              <Link href={`/dream/${dream.id}`}>
                <div className="space-y-2 mb-4 cursor-pointer group">
                  {dream.title && (
                    <h3 className="font-medium text-foreground group-hover:underline">
                      {dream.title}
                    </h3>
                  )}
                  <p className="text-foreground/80 leading-relaxed group-hover:underline">
                    {dream.content}
                  </p>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
                  onClick={() => handleShowReply(dream.id)}
                  disabled={dream.visibility === 'private' && dream.user_id !== currentUser.id}
                >
                  <MessageCircleIcon className="h-4 w-4 mr-1.5" />
                  {dreamComments.length > 0 ? `Reply (${dreamComments.length})` : 'Reply'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
                >
                  <HeartIcon className="h-4 w-4 mr-1.5" />
                  Send love
                </Button>
              </div>

              {/* Comments Section */}
              {(dreamComments.length > 0 || showReplyInput === dream.id) && 
               dream.visibility !== 'private' && (
                <div className="mt-5 space-y-4">
                  {/* Loading State */}
                  {isLoadingComments && (
                    <div className="text-xs text-muted-foreground animate-pulse">
                      Loading comments...
                    </div>
                  )}

                  {/* Existing Comments */}
                  {dreamComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.user?.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {getUserInitials(comment.user?.name || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/50 rounded-2xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs text-foreground">
                              {comment.user?.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Reply Input */}
                  {showReplyInput === dream.id && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {getUserInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 relative">
                        <textarea
                          className="w-full bg-background border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                          placeholder="Share your thoughts..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          disabled={submittingReply}
                          maxLength={500}
                          rows={3}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {replyText.length}/500
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setShowReplyInput(null);
                                setReplyText('');
                              }}
                              disabled={submittingReply}
                              className="text-xs h-7"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs h-7 px-3"
                              disabled={!replyText.trim() || submittingReply}
                              onClick={() => handleSubmitReply(dream.id)}
                            >
                              {submittingReply ? 'Sending...' : 'Send'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Private Dream Notice */}
              {dream.visibility === 'private' && dream.user_id !== currentUser.id && (
                <div className="mt-4 text-xs text-muted-foreground italic">
                  This is a private dream - comments are not available.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href="/compose">
          <Button className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow">
            <PencilIcon className="h-5 w-5" />
            <span className="sr-only">New dream</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}