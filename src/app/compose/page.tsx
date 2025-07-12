// app/compose/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createDream } from '@/lib/db';
import { getCurrentUser, getUserInitials } from '@/lib/helpers';

const MOODS = [
  { value: 'nostalgic', label: 'Nostalgic', icon: '💭', bgClass: 'bg-amber-500/5 border-amber-500/10' },
  { value: 'peaceful', label: 'Peaceful', icon: '🌙', bgClass: 'bg-blue-500/5 border-blue-500/10' },
  { value: 'emotional', label: 'Emotional', icon: '🌊', bgClass: 'bg-cyan-500/5 border-cyan-500/10' },
  { value: 'magical', label: 'Magical', icon: '✨', bgClass: 'bg-purple-500/5 border-purple-500/10' },
  { value: 'anxious', label: 'Anxious', icon: '😰', bgClass: 'bg-red-500/5 border-red-500/10' },
  { value: 'happy', label: 'Happy', icon: '😊', bgClass: 'bg-green-500/5 border-green-500/10' },
];

const VISIBILITY_OPTIONS = [
  { 
    value: 'public', 
    label: 'Everyone', 
    icon: '🌍', 
    description: 'Anyone can see this dream' 
  },
  { 
    value: 'close_friends', 
    label: 'Close friends', 
    icon: '👥', 
    description: 'Only close friends can see this' 
  },
  { 
    value: 'private', 
    label: 'Just for me', 
    icon: '🔒', 
    description: 'Only you can see this dream' 
  },
] as const;

export default function ComposePage() {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'close_friends'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  
  const currentUser = getCurrentUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const dream = await createDream(content.trim(), selectedMood.value, visibility, currentUser.id);
      if (dream) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating dream:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedVisibility = VISIBILITY_OPTIONS.find(v => v.value === visibility) || VISIBILITY_OPTIONS[0];

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="rounded-full w-8 h-8 p-0"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-medium">New Dream</h1>
        <div className="w-8" /> {/* Spacer */}
      </header>

      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Dream Preview Card */}
        <div className={`rounded-xl ${selectedMood.bgClass} border p-4 shadow-sm transition-all duration-300 ease-in-out`}>
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{getUserInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm">{currentUser.name}</span>
                <span className="text-xs">{selectedMood.icon}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Now • {selectedVisibility.label}
                {visibility === 'private' && (
                  <span className="ml-1">
                    <LockIcon className="inline h-3 w-3" />
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-3 max-w-prose">
            <textarea
              className="w-full bg-transparent resize-none border-none outline-none placeholder:italic placeholder:text-muted-foreground/60 italic text-foreground/90 font-light leading-relaxed"
              placeholder="I dreamt that I was floating through a garden of stars..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={1000}
            />
          </div>
          
          {content && (
            <div className="flex justify-end mt-2">
              <span className="text-xs text-muted-foreground">
                {content.length}/1000
              </span>
            </div>
          )}
        </div>

        {/* Mood Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Dream mood
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMoodDropdown(!showMoodDropdown);
                setShowVisibilityDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-background border border-muted rounded-xl hover:border-muted-foreground/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedMood.icon}</span>
                <span className="text-sm font-medium">{selectedMood.label}</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-muted-foreground transition-transform ${showMoodDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showMoodDropdown && (
              <div className="absolute top-full mt-1 w-full bg-background border border-muted rounded-xl shadow-lg z-10 py-1">
                {MOODS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => {
                      setSelectedMood(mood);
                      setShowMoodDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-lg">{mood.icon}</span>
                    <span className="text-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visibility Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Who can see this?
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowVisibilityDropdown(!showVisibilityDropdown);
                setShowMoodDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-background border border-muted rounded-xl hover:border-muted-foreground/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedVisibility.icon}</span>
                <span className="text-sm font-medium">{selectedVisibility.label}</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-muted-foreground transition-transform ${showVisibilityDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showVisibilityDropdown && (
              <div className="absolute top-full mt-1 w-full bg-background border border-muted rounded-xl shadow-lg z-10 py-1">
                {VISIBILITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setVisibility(option.value);
                      setShowVisibilityDropdown(false);
                    }}
                    className="w-full text-left px-3 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Private Dream Helper */}
          {visibility === 'private' && (
            <div className="bg-muted/30 border border-muted rounded-xl p-3">
              <div className="flex items-start gap-2">
                <LockIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Private dream</p>
                  <p className="text-xs text-muted-foreground">
                    This dream will only be visible to you. Perfect for personal reflection and keeping special moments private.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="flex-1 rounded-xl"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4" />
                Sharing...
              </div>
            ) : (
              'Share Dream'
            )}
          </Button>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showMoodDropdown || showVisibilityDropdown) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowMoodDropdown(false);
            setShowVisibilityDropdown(false);
          }}
        />
      )}
    </div>
  );
}

// Icons
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
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

function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="animate-spin"
      {...props}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}