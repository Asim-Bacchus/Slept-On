//src/components/feed/dream-feed.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDreams } from '@/lib/db';
import { Dream } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LockIcon, MessageCircleIcon, HeartIcon, PencilIcon, PlusIcon } from '@/components/icons';
import { getUserInitials } from '@/lib/helpers';
import { formatDate, getMoodBgClass, getMoodIcon } from '@/lib/utils';
import { usePathname } from 'next/navigation';



export default function DreamFeed() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    async function load() {
      const data = await getDreams();
      setDreams(data);
      setLoading(false);
    }
    load();
  }, [pathname]); // reruns when user returns to the feed

  if (loading) {
    return <p className="text-center mt-10 text-muted-foreground">Loading dreams...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Dream Space</h1>
        <Link href="/compose">
          <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      <div className="space-y-8">
        {dreams.map((dream) => {
          const moodIcon = getMoodIcon(dream.mood);
          const moodColor = getMoodBgClass(dream.mood);
          const initials = getUserInitials(dream.user?.name || '??');
          const visibilityLabel = dream.visibility === 'private' ? 'Just for me' : dream.visibility === 'close_friends' ? 'Close friends' : 'Public';

          return (
            <div
              key={dream.id}
              className={`rounded-xl ${moodColor} border p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={dream.user?.avatar} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{dream.user?.name}</span>
                    <span className="text-xs">{moodIcon}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(dream.created_at)} • {visibilityLabel}
                  </p>
                </div>
                {dream.visibility === 'private' && (
                  <div className="rounded-full bg-background/50 p-1">
                    <LockIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>

              <Link href={`/dream/${dream.id}`}>
                <div className="space-y-3 max-w-prose mb-3 cursor-pointer">
                  <p className="italic text-foreground/90 font-light leading-relaxed hover:underline">
                    {dream.content}
                  </p>
                </div>
              </Link>

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-7 px-2.5"
                >
                  <MessageCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                  Reply
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7 px-2.5"
                >
                  <HeartIcon className="h-3.5 w-3.5 mr-1.5" />
                  Send love
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full h-12 w-12 shadow-lg">
          <PencilIcon className="h-5 w-5" />
          <span className="sr-only">New dream</span>
        </Button>
      </div>
    </div>
  );
}
