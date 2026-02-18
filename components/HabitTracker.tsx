import React, { useState } from 'react';
import { Habit } from '../types';
import { Plus, Flame, Check, BarChart2, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitName,
      streak: 0,
      completedDates: [],
      frequency: 'daily'
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
  };

  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      
      const isCompletedToday = h.completedDates.includes(today);
      if (isCompletedToday) {
        return {
          ...h,
          completedDates: h.completedDates.filter(d => d !== today),
          streak: Math.max(0, h.streak - 1)
        };
      } else {
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: h.streak + 1
        };
      }
    }));
  };

  const analyzeHabits = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    const habitSummary = habits.map(h => `${h.title}: ${h.streak} day streak`).join(', ');
    const result = await geminiService.analyzeHabits(habitSummary);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Habit Builder</h2>
        <button 
            onClick={analyzeHabits}
            disabled={isAnalyzing || habits.length === 0}
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all disabled:opacity-50"
        >
            {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <BarChart2 size={16} />}
            Analyze Progress
        </button>
      </header>

      {/* Analysis Result */}
      {analysis && (
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-indigo-500/30 p-4 rounded-xl animate-fade-in text-indigo-100 text-sm leading-relaxed">
              <span className="font-semibold block mb-1 text-indigo-300">Coach Insight:</span>
              {analysis}
          </div>
      )}

      {/* Add New */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          placeholder="New habit (e.g., Read 10 pages)"
          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={addHabit}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
           const today = new Date().toISOString().split('T')[0];
           const isDone = habit.completedDates.includes(today);

           return (
            <div key={habit.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between group">
              <div>
                <h3 className="text-lg font-medium text-slate-200">{habit.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                   <Flame size={14} className={habit.streak > 0 ? "text-orange-500" : "text-slate-600"} fill={habit.streak > 0 ? "currentColor" : "none"} />
                   <span>{habit.streak} day streak</span>
                </div>
              </div>

              <button
                onClick={() => toggleHabitToday(habit.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                }`}
              >
                <Check size={24} strokeWidth={3} />
              </button>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;