import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Smile, 
  Wind, 
  BookOpen, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus,
  Flame,
  Volume2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activityStats, setActivityStats] = useState(null);

  // Quick check-in state
  const [quickMood, setQuickMood] = useState(null);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const moodOptions = [
    { label: 'Very Happy', emoji: '😄', score: 6, bg: 'hover:bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Happy', emoji: '😊', score: 5, bg: 'hover:bg-lime-50 text-lime-600 border-lime-200' },
    { label: 'Neutral', emoji: '😐', score: 4, bg: 'hover:bg-slate-50 text-slate-600 border-slate-200' },
    { label: 'Sad', emoji: '😔', score: 2, bg: 'hover:bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Stressed', emoji: '😫', score: 2, bg: 'hover:bg-amber-50 text-amber-600 border-amber-200' },
    { label: 'Anxious', emoji: '😰', score: 1, bg: 'hover:bg-purple-50 text-purple-600 border-purple-200' },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [moodRes, journalRes, analRes, actRes] = await Promise.all([
        api.getMoods(),
        api.getJournals(),
        api.getMoodAnalytics(),
        api.getActivityStats()
      ]);

      if (moodRes.success) setMoods(moodRes.moods || []);
      if (journalRes.success) setJournals(journalRes.journals || []);
      if (analRes.success) setAnalytics(analRes);
      if (actRes.success) setActivityStats(actRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickCheckIn = async (moodItem) => {
    try {
      setQuickSubmitting(true);
      const res = await api.addMood({
        mood: moodItem.label,
        score: moodItem.score,
        notes: 'Quick daily dashboard check-in'
      });

      if (res.success) {
        setQuickMood(moodItem.label);
        setQuickSuccess(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        await loadData();
        setTimeout(() => setQuickSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickSubmitting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const latestMood = moods[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-lavender-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-purple-900/10 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dayananda Sagar University • Case 59</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'} 🌿
            </h1>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl leading-relaxed">
              "Peace comes from within. Do not seek it without." How is your mind and body feeling today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/mindfulness"
              className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Wind className="w-4 h-4 text-purple-600" />
              Mindful Breathing
            </Link>
            <Link
              to="/ai-assistant"
              className="px-5 py-3 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              Talk to AI Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Mood Check-In Widget */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-600" />
              <span>How are you feeling right now?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap an emoji to record your current emotional state instantly.
            </p>
          </div>
          <Link
            to="/moods"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            Detailed Log with Notes →
          </Link>
        </div>

        {quickSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Mood logged successfully! Keep building your mindfulness streak.</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {moodOptions.map((opt) => {
            const isSelected = latestMood?.mood === opt.label;
            return (
              <button
                key={opt.label}
                disabled={quickSubmitting}
                onClick={() => handleQuickCheckIn(opt)}
                className={`p-4 rounded-2xl border text-center transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-purple-100/80 border-purple-400 shadow-sm ring-2 ring-purple-300'
                    : 'bg-white border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-1.5 transform hover:scale-110 transition-transform">
                  {opt.emoji}
                </div>
                <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isSelected ? 'Current Mood' : 'Tap to select'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: 3-Column Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Mood Trends Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-lg">7-Day Emotional Trajectory</h3>
              </div>
              <p className="text-xs text-slate-500">Track how your emotional state evolves over the week</p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800"
            >
              Full Analytics →
            </Link>
          </div>

          <div className="h-56 w-full">
            {analytics?.trend && analytics.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trend}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8c55ce" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#8c55ce" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis domain={[1, 6]} stroke="#94a3b8" fontSize={11} tickLine={false} ticks={[1, 2, 4, 5, 6]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                    }}
                    formatter={(val) => [`Score: ${val}/6`, 'Mood Level']}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#8c55ce"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                <Smile className="w-8 h-8 text-slate-300 mb-2" />
                No mood history recorded yet. Complete your first check-in above!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dominant mood this week: <strong className="text-purple-900">{analytics?.dominantMood || 'Neutral'}</strong></span>
            <span>Total Check-Ins: <strong className="text-purple-900">{moods.length}</strong></span>
          </div>
        </div>

        {/* Right Column: Wellness Quick Stats & Suggestions */}
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="glass-card rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">MindCare Wellness Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-1 text-purple-600 text-xs font-semibold mb-1">
                  <Flame className="w-3.5 h-3.5" /> Total Logs
                </div>
                <div className="text-2xl font-black text-slate-900">{moods.length}</div>
                <div className="text-[10px] text-slate-500">Check-in entries</div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-1 text-indigo-600 text-xs font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5" /> Journals
                </div>
                <div className="text-2xl font-black text-slate-900">{journals.length}</div>
                <div className="text-[10px] text-slate-500">Private reflections</div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-800">Mindfulness Minutes</div>
                    <div className="text-2xl font-black text-slate-900">
                      {activityStats?.totalMinutes || 0} mins
                    </div>
                  </div>
                  <Link
                    to="/mindfulness"
                    className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Wind className="w-4 h-4" />
                  </Link>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {activityStats?.totalCompleted || 0} completed breathing & grounding exercises
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestion Card */}
          <div className="glass-card rounded-3xl p-6 shadow-sm border-l-4 border-l-lavender-500 relative">
            <div className="flex items-center gap-2 text-xs font-bold text-lavender-700 uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>MindCare AI Suggestion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              "Notice when you hold your breath while looking at screens. Take 3 slow, deep diaphragmatic breaths right now to signal safety to your nervous system."
            </p>
            <Link
              to="/ai-assistant"
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              Have a conversation with AI Guide →
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Journals Snippet & Activity Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Journal Entries */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">Recent Journal Reflections</h3>
            </div>
            <Link
              to="/journal"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              Open Journal <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          {journals.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-3">No journal entries written yet.</p>
              <Link
                to="/journal"
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors inline-block"
              >
                Write Your First Entry
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {journals.slice(0, 3).map((j) => (
                <div
                  key={j._id || j.id}
                  onClick={() => navigate('/journal')}
                  className="p-4 rounded-2xl bg-white hover:bg-purple-50/40 border border-slate-200/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{j.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {j.moodTag || 'Thought'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {j.content}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wellness Activity Shortcuts */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-purple-600" />
            <span>Wellness Shortcuts</span>
          </h3>
          
          <div className="space-y-3">
            <Link
              to="/mindfulness"
              className="p-3.5 rounded-2xl bg-white hover:bg-lavender-50 border border-slate-200/80 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                4-7-8
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">4-7-8 Relaxing Breath</div>
                <div className="text-[10px] text-slate-500">Rapid nervous system reset</div>
              </div>
            </Link>

            <Link
              to="/mindfulness"
              className="p-3.5 rounded-2xl bg-white hover:bg-lavender-50 border border-slate-200/80 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                4x4
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Box Breathing Practice</div>
                <div className="text-[10px] text-slate-500">Navy SEAL focus & anxiety control</div>
              </div>
            </Link>

            <Link
              to="/mindfulness"
              className="p-3.5 rounded-2xl bg-white hover:bg-lavender-50 border border-slate-200/80 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                5-4-3
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">5-4-3-2-1 Sensory Grounding</div>
                <div className="text-[10px] text-slate-500">Panic & intrusive thought grounding</div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

