// src/types/index.ts
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Dream {
  id: string;
  content: string;
  mood: string;
  visibility: 'public' | 'private' | 'close_friends';
  created_at: string;
  user_id: string;
  user?: User; // For joined queries
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  dream_id: string;
  user_id: string;
  user?: User; // For joined queries
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      dreams: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          mood: string | null;
          visibility: 'public' | 'private' | 'close_friends';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          mood?: string | null;
          visibility: 'public' | 'private' | 'close_friends';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          mood?: string | null;
          visibility?: 'public' | 'private' | 'close_friends';
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          dream_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dream_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dream_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}

export interface DreamWithUser extends Dream {
  user: User;
}
