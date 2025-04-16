import { Comment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const initials = comment.user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={comment.user.avatar} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-medium text-xs">{comment.user.name}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 ml-1">
          {formatDate(comment.createdAt)}
        </p>
      </div>
    </div>
  );
}
