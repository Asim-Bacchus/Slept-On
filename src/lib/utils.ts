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

export function getMoodBgClass(mood: string): string {
  const match = moodOptions.find((m) => m.value === mood);
  return match ? `${match.bgClass} ${match.borderColor}` : "bg-gray-400/10 border-gray-400/30";
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
