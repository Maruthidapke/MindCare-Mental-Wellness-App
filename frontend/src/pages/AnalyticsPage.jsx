import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Smile, 
  BookOpen, 
  Wind, 
  ShieldCheck, 
  Calendar, 
  PieChart as PieIcon,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AnalyticsPage() {
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10b981', '#84cc16', '#64748b', '#3b82f6', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mRes, jRes, analRes, actRes] = await Promise.all([
          api.getMoods(),
          api.getJournals(),
          api.getMoodAnalytics(),
          api.getActivityStats()
        ]);
        if (mRes.success) setMoods(mRes.moods || []);
        if (jRes.success) setJournals(jRes.journals || []);
        if (analRes.success) setAnalytics(analRes);
        if (actRes.success) setActivityStats(actRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            <span>Progress & Emotional Analytics</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual representations of your personal wellness journey and self-care consistency.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-2xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Non-Diagnostic Self-Reflection</span>
        </div>
      </div>

      {/* Mandatory Ethical Notice */}
      <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-3xl text-xs text-purple-900 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Academic & Ethical Standard:</strong> In compliance with university ethics (Case 59 Module 5), these charts summarize your self-reported logs. They do <strong>not</strong> make clinical medical conclusions, diagnose depression or anxiety disorders, or predict psychological pathology.
        </p>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Smile className="w-4 h-4 text-emerald-600" />
            <span>Mood Logs</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{moods.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cumulative check-ins</div>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Journals Written</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{journals.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Reflections recorded</div>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Wind className="w-4 h-4 text-purple-600" />
            <span>Activities</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{activityStats?.totalCompleted || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Breathing & meditations</div>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Mindful Minutes</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{activityStats?.totalMinutes || 0}m</div>
          <div className="text-[11px] text-slate-400 mt-1">Time spent in calmness</div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mood Trajectory Area Chart */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Mood Progression</h3>
              <p className="text-xs text-slate-500">Average score trajectory (1: Anxious to 6: Very Happy)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>

          <div className="h-64 w-full">
            {analytics?.trend && analytics.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trend}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8c55ce" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8c55ce" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[1, 6]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0'
                    }}
                    formatter={(val) => [`Score: ${val}/6`, 'Mood Level']}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#8c55ce"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#areaColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Log moods over multiple days to render your progression.
              </div>
            )}
          </div>
        </div>

        {/* Mood Distribution Donut Chart */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Overall Emotional Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of all recorded emotions</p>
            </div>
            <PieIcon className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {analytics?.distribution && analytics.distribution.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.distribution.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No mood records yet.</div>
            )}
          </div>
        </div>

        {/* Activity Breakdown Bar Chart */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Mindfulness Activity Participation</h3>
              <p className="text-xs text-slate-500">Distribution across breathing, meditation, and sensory grounding</p>
            </div>
            <Wind className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-56 w-full">
            {activityStats?.byType && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityStats.byType}>
                  <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <Bar dataKey="count" fill="#8c55ce" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

