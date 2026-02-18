import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Circle, Sparkles, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface TasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const addTask = (title: string, category: Task['category'] = 'work') => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString() + Math.random(),
      title,
      completed: false,
      category,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleBreakdown = async () => {
    if (!newTaskTitle.trim()) return;
    setIsBreakingDown(true);
    
    // Call AI to breakdown
    const subtasks = await geminiService.breakDownTask(newTaskTitle);
    
    if (subtasks && subtasks.length > 0) {
        const newTasks = subtasks.map((st: any) => ({
            id: Date.now().toString() + Math.random(),
            title: st.title,
            category: st.category || 'work',
            completed: false
        }));
        setTasks(prev => [...newTasks, ...prev]);
        setNewTaskTitle(''); // Clear input after successful breakdown
    } else {
        // Fallback if AI fails or returns empty
        addTask(newTaskTitle);
        setNewTaskTitle('');
    }
    
    setIsBreakingDown(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Tasks & Goals</h2>
           <p className="text-slate-400 text-sm">Organize your flow.</p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {tasks.filter(t => t.completed).length} / {tasks.length} Done
        </div>
      </header>

      {/* Input Area */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4 rounded-2xl space-y-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What do you need to accomplish?"
          className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && addTask(newTaskTitle)}
        />
        <div className="flex gap-2">
            <button
                onClick={() => { addTask(newTaskTitle); setNewTaskTitle(''); }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add Task
            </button>
            <button
                onClick={handleBreakdown}
                disabled={isBreakingDown || !newTaskTitle}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isBreakingDown ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                AI Breakdown
            </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
            Tip: Type a big goal (e.g., "Plan a marketing campaign") and click <strong>AI Breakdown</strong> to get sub-tasks automatically.
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                No tasks yet. Start by adding one above!
            </div>
        )}
        {tasks.map(task => (
          <div
            key={task.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
              task.completed 
                ? 'bg-slate-900/30 border-slate-800 opacity-60' 
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-400'}`}
            >
              {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
            </button>
            
            <div className="flex-1">
                <p className={`text-base ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.category === 'work' ? 'bg-blue-500/10 text-blue-400' :
                    task.category === 'personal' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-purple-500/10 text-purple-400'
                }`}>
                    {task.category}
                </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;