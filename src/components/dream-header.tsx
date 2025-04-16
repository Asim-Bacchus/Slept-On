import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LockIcon } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import { Dream } from '@/types';

interface DreamHeaderProps {
  dream: Dream;
  moodIcon: string;
  visibilityText: string;
}

export default function DreamHeader({ dream, moodIcon, visibilityText }: DreamHeaderProps) {
  const initials = dream.user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={dream.user.avatar} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{dream.user.name}</span>
          <span className="text-sm">{moodIcon}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(dream.createdAt)} • {visibilityText}
        </p>
      </div>
      {dream.visibility === 'private' && (
        <div className="rounded-full bg-background/50 p-1">
          <LockIcon className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
