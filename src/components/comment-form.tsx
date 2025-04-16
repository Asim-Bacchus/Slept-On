import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SendIcon } from '@/components/icons';

interface CommentFormProps {
  dreamId: string;
}

export default function CommentForm({ dreamId }: CommentFormProps) {
  return (
    <div className="flex items-start gap-2 animate-in fade-in duration-200 mt-4">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src="/avatars/alex.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <textarea
          className="w-full bg-muted rounded-2xl rounded-tl-none p-3 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Share your thoughts..."
        />
        <Button size="sm" className="absolute bottom-2 right-2 h-7 rounded-full">
          <SendIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
