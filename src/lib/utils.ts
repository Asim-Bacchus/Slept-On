import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🎨 Mood color mapping (Tailwind-compatible)
const moodColors: Record<string, string> = {
  calm: 'blue-500',
  surreal: 'purple-500',
  ocean: 'blue-600',
  nostalgic: 'amber-500',
};

export function getMoodColor(mood: string): string {
  return moodColors[mood] ?? 'gray-400';
}

// ✨ Mood icon mapping
const moodIcons: Record<string, string> = {
  calm: '🌙',
  surreal: '✨',
  ocean: '🌊',
  nostalgic: '💭',
};

export function getMoodIcon(mood: string): string {
  return moodIcons[mood] ?? '🛌';
}

// 📆 Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
