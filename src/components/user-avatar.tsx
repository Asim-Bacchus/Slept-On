// src/components/user-avatar.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface User {
    id?: string; 
    name: string;
    avatar?: string;
  }
  
export default function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
