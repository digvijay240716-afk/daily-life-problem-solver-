import { NavView } from './types';
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  Activity, 
  Timer, 
  StickyNote 
} from 'lucide-react';

export const NAV_ITEMS: { id: NavView; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'coach', label: 'AI Coach', icon: Bot },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'habits', label: 'Habits', icon: Activity },
  { id: 'focus', label: 'Focus Timer', icon: Timer },
  { id: 'notes', label: 'Offline Notes', icon: StickyNote },
];

export const SYSTEM_INSTRUCTION_COACH = `
Act as a supportive productivity coach. 
Your goal is to analyze user input and provide practical, emotionally intelligent advice with actionable steps.
Be concise, encouraging, and empathetic. 
If the user seems stressed, prioritize mental well-being before productivity.
`;

export const SYSTEM_INSTRUCTION_TASK_BREAKDOWN = `
Convert the user's unstructured text into a JSON array of specific, actionable sub-tasks.
Return ONLY raw JSON. No markdown formatting.
Example output format:
[
  { "title": "Research competitors", "category": "work" },
  { "title": "Draft outline", "category": "work" }
]
`;

export const SYSTEM_INSTRUCTION_HABIT_ANALYSIS = `
Analyze the provided habit data and suggest improvements. 
Be brief and motivational. Focus on consistency and "small wins".
`;
