// app/compose/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createDream } from '@/lib/db';
import { getCurrentUser, getUserInitials } from '@/lib/helpers';
import { getColorClass } from '@/lib/utils';

const COLOR_OPTIONS = [
  { label: 'Red', value: 'red', color: 'bg-red-400' },
  { label: 'Orange', value: 'orange', color: 'bg-orange-400' },
  { label: 'Yellow', value: 'yellow', color: 'bg-yellow-400' },
  { label: 'Green', value: 'green', color: 'bg-emerald-400' },
  { label: 'Blue', value: 'blue', color: 'bg-blue-400' },
  { label: 'Purple', value: 'purple', color: 'bg-purple-400' },
  { label: 'Pink', value: 'pink', color: 'bg-pink-400' },
  { label: 'Black', value: 'black', color: 'bg-gray-800' },
  { label: 'Gray', value: 'gray', color: 'bg-gray-500' },
  { label: 'White', value: 'white', color: 'bg-gray-200 border border-gray-300' },
] as const;

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customEmoji, setCustomEmoji] = useState('💭');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'close_friends'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  
  const currentUser = getCurrentUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const dream = await createDream(
        title.trim() || '',
        content.trim(),
        customEmoji || '💭',
        selectedColor,
        visibility,
        currentUser.id
      );
      
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
  const cardColorClass = getColorClass(selectedColor);

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
        <div className={`rounded-xl ${cardColorClass} p-4 shadow-sm transition-all duration-300 ease-in-out`}>
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{getUserInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm">{currentUser.name}</span>
                <span className="text-lg">{customEmoji}</span>
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
            {/* Title Input */}
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none placeholder:text-muted-foreground/60 font-semibold text-lg"
              placeholder="Dream title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            
            {/* Content Textarea */}
            <textarea
              className="w-full bg-transparent resize-none border-none outline-none placeholder:italic placeholder:text-muted-foreground/60 italic text-foreground/90 font-light leading-relaxed"
              placeholder="I dreamt that I was floating through a garden of stars..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={1000}
            />
          </div>
          
          {(content || title) && (
            <div className="flex justify-between items-center mt-2">
              {title && (
                <span className="text-xs text-muted-foreground">
                  Title: {title.length}/100
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {content.length}/1000
              </span>
            </div>
          )}
        </div>

        {/* Title Input Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Dream title (optional)
          </label>
          <input
            type="text"
            className="w-full p-3 bg-background border border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
            placeholder="Give your dream a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Custom Emoji Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Dream emoji
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 bg-background border border-muted rounded-xl focus:border-primary focus:outline-none transition-colors text-center text-xl"
              placeholder="💭"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setCustomEmoji('💭')}
              className="px-4 rounded-xl"
            >
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose an emoji that represents your dream
          </p>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Accent color
          </label>
          <div className="grid grid-cols-5 gap-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`h-10 w-full rounded-lg ${color.color} border-2 transition-all ${
                  selectedColor === color.value 
                    ? 'border-primary scale-105' 
                    : 'border-transparent hover:scale-105'
                }`}
                title={color.label}
              >
                {selectedColor === color.value && (
                  <CheckIcon className={`h-4 w-4 mx-auto ${
                    color.value === 'white' || color.value === 'yellow' 
                      ? 'text-gray-700' 
                      : 'text-white'
                  } drop-shadow-sm`} />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Choose a subtle accent color for your dream card border
          </p>
        </div>

        {/* Visibility Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Who can see this?
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
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

      {/* Click outside to close dropdown */}
      {showVisibilityDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowVisibilityDropdown(false)}
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 6 9 17l-5-5" />
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