import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'focus' ? FOCUS_TIME : BREAK_TIME) - timeLeft) / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
      <div className="relative mb-12">
        {/* Decorative Glow */}
        <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full ${mode === 'focus' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
        
        {/* Timer Circle */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-slate-800 flex items-center justify-center bg-slate-900 shadow-2xl">
           <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
             <circle 
               cx="50" cy="50" r="46" 
               fill="none" 
               stroke={mode === 'focus' ? '#3b82f6' : '#10b981'} 
               strokeWidth="4"
               strokeDasharray="289.02" // 2 * pi * 46
               strokeDashoffset={289.02 * (1 - progress)}
               className="transition-all duration-1000 ease-linear"
               strokeLinecap="round"
             />
           </svg>
           
           <div className="text-center z-10">
              <div className="flex justify-center mb-4 text-slate-400">
                {mode === 'focus' ? <Brain size={24} /> : <Coffee size={24} />}
              </div>
              <div className="text-6xl md:text-8xl font-bold font-mono tracking-tighter text-white">
                {formatTime(timeLeft)}
              </div>
              <p className="text-slate-500 mt-2 uppercase tracking-widest text-sm font-semibold">
                {isActive ? 'Running' : 'Paused'}
              </p>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => switchMode('focus')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'focus' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Deep Focus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'break' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Short Break
        </button>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform shadow-lg shadow-white/10"
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;