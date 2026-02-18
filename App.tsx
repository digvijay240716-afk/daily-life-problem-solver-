import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from './constants';
import { NavView, Task, Habit, UserStats } from './types';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import Tasks from './components/Tasks';
import HabitTracker from './components/HabitTracker';
import FocusTimer from './components/FocusTimer';
import Notes from './components/Notes';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  
  // App State (In a real app, this would be in Context or Redux)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  
  // Derived Stats for Dashboard
  const [stats, setStats] = useState<UserStats>({
    lifeScore: 78,
    focusMinutes: 125,
    tasksCompleted: 0,
    habitConsistency: 85
  });

  // Calculate stats whenever tasks/habits change
  useEffect(() => {
    const completed = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length || 1; // avoid divide by zero
    
    // Simple mock calculation logic
    const taskScore = (completed / totalTasks) * 40;
    const habitScore = 40; // Static for demo
    const baseScore = 20;

    setStats(prev => ({
        ...prev,
        tasksCompleted: completed,
        lifeScore: Math.round(taskScore + habitScore + baseScore)
    }));
  }, [tasks, habits]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'coach': return <AICoach />;
      case 'tasks': return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'habits': return <HabitTracker habits={habits} setHabits={setHabits} />;
      case 'focus': return <FocusTimer />;
      case 'notes': return <Notes />;
      default: return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20">
              F
            </div>
            <span className="ml-3 font-bold text-xl hidden lg:block tracking-tight">FCM</span>
          </div>

          <nav className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
                <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
                {currentView === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
            <LogOut size={20} />
            <span className="ml-3 font-medium hidden lg:block">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
         <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default App;