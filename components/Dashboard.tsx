import React from 'react';
import { UserStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Activity, Trophy, Zap, Clock } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

// Mock historical data for the chart
const mockWeeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 88 },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Life Score Dashboard
        </h2>
        <p className="text-slate-400 mt-1">Your weekly clarity and momentum report.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Life Score</p>
            <p className="text-2xl font-bold text-white">{stats.lifeScore}/100</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Focus Time</p>
            <p className="text-2xl font-bold text-white">{stats.focusMinutes}m</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Tasks Done</p>
            <p className="text-2xl font-bold text-white">{stats.tasksCompleted}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Habit Streak</p>
            <p className="text-2xl font-bold text-white">{stats.habitConsistency}%</p>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Momentum Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Momentum</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWeeklyData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Life Balance Pie */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Focus Areas</h3>
          <div className="h-64 w-full flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Work', value: 40 },
                      { name: 'Growth', value: 30 },
                      { name: 'Health', value: 20 },
                      { name: 'Social', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockWeeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-slate-400 mt-4">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet-500"></div> Work</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Growth</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Health</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;