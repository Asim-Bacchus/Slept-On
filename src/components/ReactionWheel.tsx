// components/ReactionWheel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface ReactionWheelProps {
  isOpen: boolean;
  onReact: (type: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const REACTIONS = [
  { emoji: '❤️', type: 'heart', label: 'Love' },
  { emoji: '😂', type: 'lol', label: 'Funny' },
  { emoji: '😱', type: 'shocking', label: 'Shocking' },
  { emoji: '🤨', type: 'confusing', label: 'Confusing' },
  { emoji: '🤢', type: 'gross', label: 'Gross' },
  { emoji: '😔', type: 'pensive', label: 'Sad' },
  { emoji: '😎', type: 'cool', label: 'Cool' },
  { emoji: '💀', type: 'dead', label: 'Dead' },
  { emoji: '😰', type: 'anxious', label: 'Anxious' },
];

export default function ReactionWheel({ isOpen, onReact, onClose, triggerRef }: ReactionWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate position relative to trigger button
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const wheelWidth = 280; // Approximate wheel width
      const wheelHeight = 280; // Approximate wheel height
      
      // Position wheel above and centered on trigger
      const x = triggerRect.left + (triggerRect.width / 2) - (wheelWidth / 2);
      const y = triggerRect.top - wheelHeight - 10; // 10px gap above trigger
      
      setPosition({ x, y });
    }
  }, [isOpen, triggerRef]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wheelRef.current && !wheelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ 
        left: position.x, 
        top: position.y,
        width: 280,
        height: 280
      }}
    >
      <div
        ref={wheelRef}
        className={`
          relative w-70 h-70 pointer-events-auto
          transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        {/* Background circle */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-full shadow-xl border border-white/10" />
        
        {/* Reaction buttons arranged in circle */}
        {REACTIONS.map((reaction, index) => {
          // Calculate angle for each reaction (360° / 9 reactions)
          const angle = (index * 360) / REACTIONS.length;
          const radian = (angle * Math.PI) / 180;
          
          // Radius from center (adjust for comfortable spacing)
          const radius = 90;
          
          // Calculate x,y position for each button
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          
          return (
            <button
              key={reaction.type}
              onClick={() => onReact(reaction.type)}
              className={`
                absolute w-12 h-12 rounded-full 
                bg-white/10 hover:bg-white/20 backdrop-blur-sm
                border border-white/20 hover:border-white/30
                flex items-center justify-center
                transform transition-all duration-200 ease-out
                hover:scale-110 hover:shadow-lg
                group
              `}
              style={{
                // Center the button and apply calculated offset
                left: `calc(50% + ${x}px - 24px)`, // 24px = half button width
                top: `calc(50% + ${y}px - 24px)`,  // 24px = half button height
                // Stagger animation delay based on index
                animationDelay: `${index * 50}ms`,
              }}
              title={reaction.label}
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                {reaction.emoji}
              </span>
            </button>
          );
        })}
        
        {/* Center indicator dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

// Usage example component
export function ReactionWheelDemo() {
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleReact = (type: string) => {
    console.log('Reaction selected:', type);
    setIsWheelOpen(false);
    // Here you would typically send the reaction to your backend
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-2xl max-w-md">
        <h3 className="text-white mb-4">Sample Dream Post</h3>
        <p className="text-gray-300 mb-4">
          I dreamt I was flying over a magical forest filled with glowing butterflies...
        </p>
        
        <div className="flex gap-4">
          <button
            ref={triggerRef}
            onClick={() => setIsWheelOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
          >
            ❤️ React
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm">
            💬 Reply
          </button>
        </div>
      </div>

      <ReactionWheel
        isOpen={isWheelOpen}
        onReact={handleReact}
        onClose={() => setIsWheelOpen(false)}
        triggerRef={triggerRef}
      />
    </div>
  );
}