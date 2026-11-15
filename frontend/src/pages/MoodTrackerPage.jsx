import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Smile, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Tag, 
  TrendingUp, 
  PieChart as PieIcon, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import confetti from 'canvas-confetti';

export default function MoodTrackerPage() {
  const [moods, setMoods] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form state
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Academics']);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter state
  const [filterMood, setFilterMood] = useState('ALL');

  const moodOptions = [
    { label: 'Very Happy', emoji: '😄', score: 6, color: '#10b981', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    { label: 'Happy', emoji: '😊', score: 5, color: '#84cc16', border: 'border-lime-200', bg: 'bg-lime-50' },
    { label: 'Neutral', emoji: '😐', score: 4, color: '#64748b', border: 'border-slate-200', bg: 'bg-slate-50' },
    { label: 'Sad', emoji: '😔', score: 2, color: '#3b82f6', border: 'border-blue-200', bg: 'bg-blue-50' },
    { label: 'Stressed', emoji: '😫', score: 2, color: '#f59e0b', border: 'border-amber-200', bg: 'bg-amber-50' },
    { label: 'Anxious', emoji: '😰', score: 1, color: '#8b5cf6', border: 'border-purple-200', bg: 'bg-purple-50' },
  ];

  const availableTags = [
    'Academics', 'Work', 'Family', 'Friends', 'Sleep', 'Exercise', 'Health', 'Social', 'Weather', 'Project'
  ];

  const COLORS = ['#10b981', '#84cc16', '#64748b', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [moodRes, analRes] = await Promise.all([
        api.getMoods(),
        api.getMoodAnalytics()
      ]);
      if (moodRes.success) setMoods(moodRes.moods || []);
      if (analRes.success) setAnalytics(analRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const moodObj = moodOptions.find(m => m.label === selectedMood);
    const score = moodObj ? moodObj.score : 4;

    try {
      setSubmitting(true);
      const res = await api.addMood({
        mood: selectedMood,
        score,
        notes: notes.trim(),
        tags: selectedTags,
        timestamp: new Date(selectedDate)
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Mood recorded successfully!' });
        setNotes('');
        if (score >= 5) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        await loadData();
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to save mood.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error saving mood.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mood check-in?')) return;
    try {
      const res = await api.deleteMood(id);
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMoods = filterMood === 'ALL'
    ? moods
    : moods.filter(m => m.mood === filterMood);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Smile className="w-7 h-7 text-purple-600" />
            <span>Daily Mood Tracker</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Capture emotional nuance, discover personal patterns, and track well-being over time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 text-purple-800 text-xs font-semibold px-4 py-2 rounded-2xl border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Case 59 Module 1 Prototype Verified</span>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Check-in Form + Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form: New Mood Check-In */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">How Are You Feeling?</h2>
          <p className="text-xs text-slate-500 mb-6">Select your emotional state and optional reflection tags.</p>

          <form onSubmit={handleSaveMood} className="space-y-5">
            {/* Mood Emojis selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Mood</label>
              <div className="grid grid-cols-3 gap-2.5">
                {moodOptions.map((opt) => {
                  const selected = selectedMood === opt.label;
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setSelectedMood(opt.label)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selected
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 shadow-xs'
                          : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.emoji}</div>
                      <div className="text-[11px] font-bold text-slate-800">{opt.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date of Check-In</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>

            {/* Factor Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>What's impacting your mood? (Tags)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleTagToggle(t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        active
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-purple-100/60 text-slate-600'
                      }`}
                    >
                      {active ? `✓ ${t}` : `+ ${t}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reflection Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What contributed to this mood? How did you respond?"
                className="w-full p-3 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-xs transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {submitting ? 'Saving Check-In...' : 'Save Mood Check-In'}
            </button>
          </form>
        </div>

        {/* Analytics & Charts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Trend Area Chart */}
          <div className="glass-card rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Emotional Progression</h3>
              </div>
              <span className="text-[11px] text-slate-500">Scale: 1 (Anxious) to 6 (Very Happy)</span>
            </div>

            <div className="h-56 w-full">
              {analytics?.trend && analytics.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trend}>
                    <defs>
                      <linearGradient id="moodColor" x1="0" y1="0" x2="0" y2="1">
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
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                      }}
                      formatter={(val) => [`Score: ${val}/6`, 'Mood']}
                    />
                    <Area
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#8c55ce"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#moodColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No chart data available yet.
                </div>
              )}
            </div>
          </div>

          {/* Mood Distribution Donut Chart */}
          <div className="glass-card rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Mood Distribution Breakdown</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-44 w-full flex items-center justify-center">
                {analytics?.distribution && analytics.distribution.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.distribution.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analytics.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-400">No mood entries yet.</div>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                {moodOptions.map((opt, i) => {
                  const item = analytics?.distribution?.find(d => d.name === opt.label);
                  const count = item ? item.value : 0;
                  return (
                    <div key={opt.label} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-slate-700">{opt.emoji} {opt.label}</span>
                      </div>
                      <span className="font-bold text-slate-900">{count} logs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mood History List */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Recorded Mood History</h3>
            <p className="text-xs text-slate-500">All previous logs displayed in chronological order</p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
            >
              <option value="ALL">All Moods ({moods.length})</option>
              {moodOptions.map(m => (
                <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredMoods.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Smile className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No mood entries found matching this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMoods.map((entry) => {
              const moodDef = moodOptions.find(m => m.label === entry.mood) || { emoji: '✨', color: '#8c55ce' };
              return (
                <div key={entry._id || entry.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-purple-50/30 px-3 rounded-2xl transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl shrink-0 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      {moodDef.emoji}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{entry.mood}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          Score {entry.score || 4}/6
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                          "{entry.notes}"
                        </p>
                      )}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {entry.tags.map(t => (
                            <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMood(entry._id || entry.id)}
                      title="Delete Entry"
                      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

