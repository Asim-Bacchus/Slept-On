// src/lib/db.ts
import { supabase } from './supabase';
import type { Dream, Comment } from '@/types';

// Mock user data - replace with real auth later
const mockUsers: Record<string, { name: string; avatar?: string }> = {
  'user1': { name: 'Asim Bacchus', avatar: '/avatars/alex.jpg' },
  'user2': { name: 'Jordan Lee' },
  'user3': { name: 'Sam Taylor', avatar: '/avatars/sam.jpg' },
  'user4': { name: 'Taylor Kim', avatar: '/avatars/taylor.jpg' },
  'user5': { name: 'Riley Smith' },
  'user6': { name: 'Morgan Davis', avatar: '/avatars/morgan.jpg' },
};

function getUserData(userId: string) {
  return mockUsers[userId] || { name: 'Unknown User' };
}

export async function getDreams(limit = 10, offset = 0): Promise<Dream[]> {
  const { data, error } = await supabase
    .from('dreams')
    .select('id, title, content, emoji, color_key, visibility, created_at, user_id')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching dreams:', error);
    return [];
  }

  return data.map(dream => ({
    ...dream,
    user: getUserData(dream.user_id)
  }));
}

export async function getDreamById(id: string): Promise<Dream | null> {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching dream:', error);
    return null;
  }

  return {
    ...data,
    user: getUserData(data.user_id)
  };
}

export async function getComments(dreamId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('dream_id', dreamId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data.map(comment => ({
    ...comment,
    user: getUserData(comment.user_id)
  }));
}

export async function createComment(dreamId: string, content: string, userId: string): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      dream_id: dreamId,
      content,
      user_id: userId
    })
    .select()
    .single();

    if (error) {
    console.error('❌ Supabase insert error:', error.message, error.details, error.hint);
    return null;
  }


  return {
    ...data,
    user: getUserData(data.user_id)
  };
}

export async function createDream(
  title: string,
  content: string,
  emoji: string,
  colorKey: string,
  visibility: 'public' | 'private' | 'close_friends',
  userId: string
): Promise<Dream | null> {
  const { data, error } = await supabase
    .from('dreams')
    .insert({
      title,
      content,
      emoji,
      color_key: colorKey,
      visibility,
      user_id: userId
    })
    .select()
    .single();


  if (error) {
    console.error('❌ Supabase insert error:', error.message, error.details, error.hint);
    return null;
  }

  return {
    ...data,
    user: getUserData(data.user_id)
  };
}
