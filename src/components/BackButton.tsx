'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 mr-1" />
      <span>Back</span>
    </button>
  );
}
