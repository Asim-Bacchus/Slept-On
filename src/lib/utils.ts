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

export function getMoodBgClass(mood: string): string {
  switch (mood) {
    case 'calm':
      return 'bg-blue-500/5 border-blue-500/10';
    case 'surreal':
      return 'bg-purple-500/5 border-purple-500/10';
    case 'ocean':
      return 'bg-blue-600/5 border-blue-600/10';
    case 'nostalgic':
      return 'bg-amber-500/5 border-amber-500/10';
    default:
      return 'bg-gray-400/5 border-gray-400/10';
  }
}
