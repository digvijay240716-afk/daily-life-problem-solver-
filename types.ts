export type NavView = 'dashboard' | 'coach' | 'tasks' | 'habits' | 'focus' | 'notes';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'work' | 'personal' | 'growth';
  dueDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  frequency: 'daily' | 'weekly';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserStats {
  lifeScore: number;
  focusMinutes: number;
  tasksCompleted: number;
  habitConsistency: number; // percentage
}