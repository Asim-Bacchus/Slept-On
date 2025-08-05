import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🧠 Master mood config – update once, used everywhere
export const moodOptions: {
  label: string;
  value: string;
  emoji: string;
  bgClass: string;
  borderColor: string;
}[] = [
  {
    label: "Happy",
    value: "happy",
    emoji: "😌",
    bgClass: "bg-yellow-300/20",
    borderColor: "border-yellow-400/50",
  },
  {
    label: "Anxious",
    value: "anxious",
    emoji: "😰",
    bgClass: "bg-red-600/20",
    borderColor: "border-red-500/50",
  },
  {
    label: "Nostalgic",
    value: "nostalgic",
    emoji: "💭",
    bgClass: "bg-amber-600/20",
    borderColor: "border-amber-500/50",
  },
  {
    label: "Surreal",
    value: "surreal",
    emoji: "✨",
    bgClass: "bg-fuchsia-600/15",
    borderColor: "border-fuchsia-500/40",
  },
  {
    label: "Calm",
    value: "calm",
    emoji: "🌙",
    bgClass: "bg-sky-300/15",
    borderColor: "border-sky-300/50",
  },
  {
    label: "Sad",
    value: "sad",
    emoji: "😢",
    bgClass: "bg-blue-900/20",
    borderColor: "border-blue-700/40",
  },
  {
    label: "Weird",
    value: "weird",
    emoji: "🐸",
    bgClass: "bg-lime-500/15",
    borderColor: "border-lime-500/40",
  },
  {
    label: "Excited",
    value: "excited",
    emoji: "🤩",
    bgClass: "bg-pink-400/15",
    borderColor: "border-pink-400/40",
  },
];

// 🎨 Mood lookup functions
export function getMoodColor(mood: string): string {
  return (
    moodOptions.find((m) => m.value === mood)?.borderColor || "border-gray-400/40"
  );
}

export function getMoodIcon(mood: string): string {
  return moodOptions.find((m) => m.value === mood)?.emoji || "🛌";
}

// 🎨 FIXED: Subtle accent colors only - consistent background with colored left border
export function getColorClass(colorKey: string): string {
  const COLORS: Record<string, string> = {
    red: "bg-background border-l-4 border-l-red-400 border border-muted",
    orange: "bg-background border-l-4 border-l-orange-400 border border-muted",
    yellow: "bg-background border-l-4 border-l-yellow-400 border border-muted",
    green: "bg-background border-l-4 border-l-emerald-400 border border-muted",
    blue: "bg-background border-l-4 border-l-blue-400 border border-muted",
    purple: "bg-background border-l-4 border-l-purple-400 border border-muted",
    pink: "bg-background border-l-4 border-l-pink-400 border border-muted",
    black: "bg-background border-l-4 border-l-gray-800 border border-muted",
    gray: "bg-background border-l-4 border-l-gray-500 border border-muted",
    white: "bg-background border-l-4 border-l-gray-200 border border-muted",
  };
  return COLORS[colorKey] || "bg-background border-l-4 border-l-gray-400 border border-muted";
}

// 📆 Date formatting with relative time
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}