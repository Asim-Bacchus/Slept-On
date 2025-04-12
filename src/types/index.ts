export interface User {
    id: string;
    name: string;
    avatar?: string;
  }
  
  export interface Dream {
    id: string;
    content: string;
    mood: string;
    createdAt: string;
    visibility: 'private' | 'public' | 'close_friends';
    user: User;
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
  }
  