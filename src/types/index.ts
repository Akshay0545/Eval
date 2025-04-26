
export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: Task[];
}
