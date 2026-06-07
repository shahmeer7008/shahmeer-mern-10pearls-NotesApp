export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: {
    id: string;
    email?: string;
  } | null;
}
