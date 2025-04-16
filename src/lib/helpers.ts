// src/lib/helpers.ts

import type { User } from '@/types';

/**
 * Returns the initials of a user, based on their name.
 */
export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Dummy current user getter.
 * Replace with real auth logic later.
 */
export function getCurrentUser(): User {
  return {
    id: 'user1',
    name: 'Alex Chen',
    avatar: '/avatars/alex.jpg'
  };
}

/**
 * Maps visibility levels to friendly labels.
 */
export function getVisibilityLabel(visibility: 'public' | 'private' | 'close_friends'): string {
  switch (visibility) {
    case 'public': return 'Everyone';
    case 'private': return 'Just for me';
    case 'close_friends': return 'Close friends';
  }
}

/**
 * Returns tailwind bg + border color classes for a mood
 */
export function getMoodBgClass(mood: string): string {
  switch (mood) {
    case 'peaceful': return 'bg-blue-500/5 border-blue-500/10';
    case 'anxious': return 'bg-red-500/5 border-red-500/10';
    case 'nostalgic': return 'bg-amber-500/5 border-amber-500/10';
    default: return 'bg-purple-500/5 border-purple-500/10';
  }
}
