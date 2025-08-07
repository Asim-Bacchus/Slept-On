// components/ReactionWheel.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ReactionWheelProps {
  isOpen: boolean;
  onReact: (type: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  centerPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
}

interface PressAndDragProps {
  onDragStart: (startPos: { x: number; y: number }) => void;
  onDragMove: (pos: { x: number; y: number }) => void;
  onDragEnd: (endPos: { x: number; y: number }) => void;
  onCancel: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
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

// Custom hook for press and drag functionality
export function usePressAndDrag(
  onDragStart: (pos: { x: number; y: number }) => void,
  onDragMove: (pos: { x: number; y: number }) => void,
  onDragEnd: (pos: { x: number; y: number }) => void,
  onCancel: () => void,
  delay: number = 50 // Much faster delay for better responsiveness
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);

  const getEventPosition = (e: TouchEvent | MouseEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const start = (e: TouchEvent | MouseEvent) => {
    const pos = getEventPosition(e);
    
    timeoutRef.current = setTimeout(() => {
      isDragging.current = true;
      onDragStart(pos);
    }, delay);
  };

  const move = (e: TouchEvent | MouseEvent) => {
    if (isDragging.current) {
      const pos = getEventPosition(e);
      onDragMove(pos);
    }
  };

  const end = (e: TouchEvent | MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isDragging.current) {
      const pos = getEventPosition(e);
      onDragEnd(pos);
      isDragging.current = false;
    } else {
      onCancel();
    }
  };

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (isDragging.current) {
      isDragging.current = false;
    }
    onCancel();
  };

  return { start, move, end, cancel };
}

// Press and drag wrapper component
export function PressAndDrag({ 
  onDragStart, 
  onDragMove, 
  onDragEnd, 
  onCancel,
  children, 
  className = '',
  disabled = false 
}: PressAndDragProps) {
  const { start, move, end, cancel } = usePressAndDrag(onDragStart, onDragMove, onDragEnd, onCancel, 50);

  // Touch events with immediate response
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    start(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    move(e.nativeEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    end(e.nativeEvent);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    cancel();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    start(e.nativeEvent);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      move(e);
    };
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      end(e);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
  };

  return (
    <div
      className={`${className} select-none`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      style={{ 
        touchAction: 'none', 
        userSelect: 'none',
        ['WebkitUserSelect' as any]: 'none',
        ['WebkitTouchCallout' as any]: 'none',
        ['WebkitTapHighlightColor' as any]: 'transparent'
      }}
    >
      {children}
    </div>
  );
}

export default function ReactionWheel({ isOpen, onReact, onClose, triggerRef, centerPosition, dragPosition }: ReactionWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  // Calculate center position from trigger button (fix infinite render)
  useEffect(() => {
    if (!isOpen) return;

    if (centerPosition) {
      setCenter((prev) =>
        prev.x !== centerPosition.x || prev.y !== centerPosition.y
          ? centerPosition
          : prev
      );
    } else if (triggerRef.current) {
      const { left, top, width, height } = triggerRef.current.getBoundingClientRect();
      const newX = left + width / 2;
      const newY = top + height / 2;

      setCenter((prev) =>
        prev.x !== newX || prev.y !== newY
          ? { x: newX, y: newY }
          : prev
      );
    }
  }, [isOpen, centerPosition?.x, centerPosition?.y]);


  // Prevent body scroll when wheel is open
  useEffect(() => {
    if (isOpen) {
      const body = document.body;
      const bodyStyle = body.style as any;
      
      const originalOverflow = bodyStyle.overflow;
      const originalTouchAction = bodyStyle.touchAction;
      const originalUserSelect = bodyStyle.userSelect;
      
      bodyStyle.overflow = 'hidden';
      bodyStyle.touchAction = 'none';
      bodyStyle.userSelect = 'none';
      bodyStyle.webkitUserSelect = 'none';
      bodyStyle.webkitTouchCallout = 'none';
      
      return () => {
        bodyStyle.overflow = originalOverflow;
        bodyStyle.touchAction = originalTouchAction;
        bodyStyle.userSelect = originalUserSelect;
        bodyStyle.webkitUserSelect = '';
        bodyStyle.webkitTouchCallout = '';
      };
    }
  }, [isOpen]);

  // Calculate which reaction is being hovered based on drag position
  const calculateHoveredReaction = useCallback((dragPos: { x: number; y: number }) => {
    const dx = dragPos.x - center.x;
    const dy = dragPos.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Reduced minimum distance for easier selection
    if (distance < 30) {
      return null;
    }

    // Calculate angle from center
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize to 0-360 and adjust so 0° is at top
    angle = (angle + 90 + 360) % 360;
    
    // Each reaction covers 40° (360° / 9)
    const sectionAngle = 360 / REACTIONS.length;
    const reactionIndex = Math.floor(angle / sectionAngle);
    
    return REACTIONS[reactionIndex]?.type || null;
  }, [center.x, center.y]);

  // Calculate hovered reaction whenever dragPosition changes (fix infinite render)
  useEffect(() => {
    if (dragPosition && center.x && center.y) {
      const hoveredType = calculateHoveredReaction(dragPosition);
      
      if (hoveredType !== hoveredReaction) {
        setHoveredReaction(hoveredType);
        
        if (hoveredType && 'vibrate' in navigator) {
          navigator.vibrate(5);
        }
      }
    }
  }, [dragPosition, center.x, center.y, calculateHoveredReaction]); // Removed hoveredReaction from deps

  // Handle drag end - select reaction if hovering over one
  const handleDragEnd = useCallback((pos: { x: number; y: number }) => {
    const selectedReaction = calculateHoveredReaction(pos);
    if (selectedReaction) {
      onReact(selectedReaction);
    }
    onClose();
  }, [calculateHoveredReaction, onReact, onClose]);

  if (!isOpen) return null;

  const wheelSize = 200; // Much smaller, back to reasonable size
  const radius = 70; // Reduced radius for better proportions

  return (
    <>
      {/* Full screen overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
        onClick={onClose}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          ['WebkitUserSelect' as any]: 'none',
          ['WebkitTouchCallout' as any]: 'none'
        }}
      />
      
      {/* Reaction wheel positioned at center point */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{ 
          left: center.x - wheelSize / 2, 
          top: center.y - wheelSize / 2,
          width: wheelSize,
          height: wheelSize,
        }}
      >
        <div
          ref={wheelRef}
          className={`
            relative w-full h-full pointer-events-auto
            transition-all duration-300 ease-out transform-origin-center
            ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          `}
        >
          {/* Soft radial glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-[0_0_30px_rgba(255,255,255,0.3)] dark:shadow-[0_0_30px_rgba(59,130,246,0.2)] blur-[0.5px]" />
          
          {/* Bubbly background with gradient - no solid outline */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-900/90 dark:via-gray-800/70 dark:to-gray-700/50 shadow-2xl backdrop-blur-xl" />
          
          {/* Center dot with pulse effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-400 rounded-full shadow-inner"></div>
            <div className="absolute inset-0 w-8 h-8 bg-blue-400/20 rounded-full animate-ping transform -translate-x-2 -translate-y-2"></div>
          </div>
          
          {/* Discoverable tooltip when no hover - with soft glow */}
          {!hoveredReaction && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 px-3 py-1.5 text-xs text-muted-foreground bg-white/95 dark:bg-gray-800/95 rounded-full shadow-lg shadow-[0_0_20px_rgba(255,255,255,0.4)] dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] border-0 animate-pulse whitespace-nowrap backdrop-blur-sm">
              Drag to react!
            </div>
          )}
          
          {/* Reaction buttons with bubbly appearance */}
          {REACTIONS.map((reaction, index) => {
            // Calculate angle for each reaction (start from top, go clockwise)
            const angle = (index * 360) / REACTIONS.length - 90; // -90 to start from top
            const radian = (angle * Math.PI) / 180;
            
            // Calculate x,y position for each button
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            const isHovered = hoveredReaction === reaction.type;
            
            return (
              <div
                key={reaction.type}
                className={`
                  absolute w-11 h-11 rounded-full 
                  flex items-center justify-center
                  shadow-md backdrop-blur-md
                  transition-all duration-150 ease-out transform
                  pointer-events-none
                  ${isHovered 
                    ? 'scale-[1.4] bg-blue-500 text-white shadow-xl ring-2 ring-blue-300/60 z-10' 
                    : 'scale-100 bg-white/85 dark:bg-gray-800/85 border border-white/30 dark:border-gray-600/30'
                  }
                `}
                style={{
                  left: `calc(50% + ${x}px - 22px)`, // 22px = half button width (11*2/2)
                  top: `calc(50% + ${y}px - 22px)`,   // 22px = half button height
                  animationDelay: `${index * 40}ms`,
                  animation: `float-bubble ${300 + index * 40}ms ease-out forwards`,
                }}
              >
                <span className={`text-lg select-none transition-all duration-150 ${isHovered ? 'scale-110' : ''}`}>
                  {reaction.emoji}
                </span>
                
                {/* Hover glow effect */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-full bg-blue-400/15 animate-pulse"></div>
                )}
              </div>
            );
          })}
          
          {/* Selection line with gradient - stabilized */}
          {hoveredReaction && dragPosition && center.x && center.y && (
            <div
              className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-blue-400 rounded-full transition-none"
              style={{
                width: Math.max(0, Math.sqrt(
                  Math.pow(dragPosition.x - center.x, 2) + 
                  Math.pow(dragPosition.y - center.y, 2)
                ) - 20), // Subtract 20px to not overlap center
                transform: `rotate(${Math.atan2(
                  dragPosition.y - center.y,
                  dragPosition.x - center.x
                )}rad)`,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// Usage example component with press and drag
export function ReactionWheelDemo() {
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [centerPos, setCenterPos] = useState<{ x: number; y: number } | undefined>();
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleReact = (type: string) => {
    setSelectedReaction(type);
    setIsWheelOpen(false);
    // Reset after animation
    setTimeout(() => setSelectedReaction(null), 2000);
  };

  const handleDragStart = (startPos: { x: number; y: number }) => {
    setCenterPos(startPos);
    setIsWheelOpen(true);
  };

  const handleDragMove = (pos: { x: number; y: number }) => {
    // Handle drag movement if needed
  };

  const handleDragEnd = (endPos: { x: number; y: number }) => {
    // Wheel handles reaction selection
  };

  const handleCancel = () => {
    setIsWheelOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white mb-4 font-medium">Sample Dream Post</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          I dreamt I was flying over a magical forest filled with glowing butterflies. 
          The trees whispered secrets as I soared through the moonlit sky...
        </p>
        
        <div className="flex gap-4">
          <PressAndDrag
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onCancel={handleCancel}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium cursor-pointer
              ${selectedReaction 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <div ref={triggerRef} className="flex items-center gap-2">
              {selectedReaction ? '🎉' : '❤️'} 
              {selectedReaction ? 'Reacted!' : 'Press & Drag to React'}
            </div>
          </PressAndDrag>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium">
            💬 Reply
          </button>
        </div>
      </div>

      <ReactionWheel
        isOpen={isWheelOpen}
        onReact={handleReact}
        onClose={() => setIsWheelOpen(false)}
        triggerRef={triggerRef}
        centerPosition={centerPos}
      />
    </div>
  );
}