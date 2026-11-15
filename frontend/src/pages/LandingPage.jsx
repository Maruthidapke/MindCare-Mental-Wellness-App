import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Heart, 
  Smile, 
  BookOpen, 
  Bot, 
  Wind, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Pause, 
  RefreshCw,
  Lock,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  // Interactive Mini-Breathing Preview on Landing Page
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState('Inhale'); // Inhale (4s), Hold (4s), Exhale (4s)
  const [breatheTimer, setBreatheTimer] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreatheTimer((prev) => {
          if (prev <= 1) {
            if (breathePhase === 'Inhale') {
              setBreathePhase('Hold');
              return 4;
            } else if (breathePhase === 'Hold') {
              setBreathePhase('Exhale');
              return 4;
            } else {
              setBreathePhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathePhase('Inhale');
      setBreatheTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathePhase]);

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      const res = await api.demoLogin();
      if (res.success && res.token) {
        login(res.token, res.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  const features = [
    {
      title: 'Daily Mood Tracking',
      desc: 'Check in with your feelings in seconds. Log moods from Very Happy to Anxious with intuitive tags and reflection notes.',
      icon: Smile,
      badge: 'Visual Tracking',
      color: 'from-amber-400 to-orange-500'
    },
    {
      title: 'Private Digital Journal',
      desc: 'A secure, serene digital space to express thoughts, untangle worries, and celebrate personal daily breakthroughs.',
      icon: BookOpen,
      badge: 'Confidential & Private',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'AI Wellness Guide',
      desc: 'A supportive, non-diagnostic AI companion offering gentle empathy, mindfulness prompts, and emergency helpline routing.',
      icon: Bot,
      badge: 'Gemini AI Guardrails',
      color: 'from-purple-500 to-lavender-700'
    },
    {
      title: 'Mindfulness & Breathing Studio',
      desc: 'Guided 4-7-8 and Box breathing exercises with animated visual pacing and healing acoustic chimes.',
      icon: Wind,
      badge: 'Calm Nervous System',
      color: 'from-emerald-400 to-teal-600'
    },
    {
      title: 'Progress & Emotional Trends',
      desc: 'Understand your emotional trajectories through beautiful interactive Recharts with zero stigmatizing medical claims.',
      icon: BarChart3,
      badge: 'Self-Awareness',
      color: 'from-rose-400 to-pink-600'
    },
    {
      title: 'Ambient Acoustic Soundscapes',
      desc: 'Pure in-browser synthesized gentle rain, rolling ocean surf, and forest winds to soothe stress and aid sleep.',
      icon: Sparkles,
      badge: 'Zero Network Audio',
      color: 'from-indigo-400 to-lavender-600'
    }
  ];

  return (
    <div className="space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-100/90 border border-purple-200/80 text-purple-900 text-xs sm:text-sm font-semibold shadow-2xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>MindCare • Case 59 AI Mental Wellness Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Mental Wellness <br />
              <span className="bg-gradient-to-r from-purple-700 via-lavender-600 to-indigo-600 bg-clip-text text-transparent">
                Matters Every Day.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Cultivate daily emotional balance with evidence-backed mood tracking, guided breathing exercises, private journaling, and a supportive AI wellness companion built with safety-first guardrails.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleDemoLogin}
                    disabled={demoLoading}
                    className="px-6 py-3.5 rounded-2xl bg-white hover:bg-lavender-50 border border-purple-200 text-purple-900 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    {demoLoading ? 'Loading Demo...' : '1-Click Student Demo'}
                  </button>
                </>
              )}

              <a
                href="#features"
                className="px-5 py-3.5 rounded-2xl text-slate-600 hover:text-purple-700 text-sm font-semibold transition-colors"
              >
                Explore Features ↓
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-100 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-purple-900">20,000+</div>
                <div className="text-xs text-slate-500 font-medium">Target Case Scale</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-purple-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Private & Isolated</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-purple-900">24/7</div>
                <div className="text-xs text-slate-500 font-medium">Crisis Safety Net</div>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Guided Breathing Preview */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-500/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-lavender-100 rounded-xl text-purple-700">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Quick Mindful Reset</h3>
                    <p className="text-xs text-slate-500">Box Breathing Practice (4-4-4)</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Interactive
                </span>
              </div>

              {/* Breathing Circle Widget */}
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                  {/* Outer animated aura */}
                  <div 
                    className={`absolute inset-0 rounded-full bg-gradient-to-tr from-lavender-300 via-purple-300 to-indigo-200 opacity-60 transition-transform duration-1000 ease-in-out ${
                      isBreathing
                        ? breathePhase === 'Inhale' 
                          ? 'scale-110' 
                          : breathePhase === 'Hold' 
                          ? 'scale-110 animate-pulse' 
                          : 'scale-90'
                        : 'scale-95'
                    }`}
                  />
                  {/* Inner breathing circle */}
                  <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-purple-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
                      {isBreathing ? breathePhase : 'Ready'}
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {isBreathing ? breatheTimer : '✦'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {isBreathing ? 'Follow the circle' : 'Click start below'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-lavender-600 hover:bg-lavender-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
                  >
                    {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    {isBreathing ? 'Pause Breathing' : 'Start 1-Min Breath'}
                  </button>

                  <Link
                    to="/mindfulness"
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-purple-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Full Studio →
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-100 text-center text-xs text-slate-500">
                Regular box breathing stimulates the vagus nerve and lowers salivary cortisol in under 2 minutes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Engineered For Emotional Health
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Digital Tools for Inner Well-Being
          </h2>
          <p className="text-base text-slate-600">
            A cohesive suite designed with evidence-based cognitive and mindfulness patterns, ensuring complete user privacy and compassionate interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-hover rounded-3xl p-7 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/50">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{feat.desc}</p>
                </div>
                <div className="flex items-center text-xs font-semibold text-purple-700 hover:text-purple-800">
                  <span>Explore in app</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-lavender-100/70 via-white to-pastel-blue/60 rounded-3xl p-8 sm:p-12 border border-purple-200/70 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 shadow-2xs">
              Simple 3-Step Journey
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">How MindCare Works</h2>
            <p className="text-sm text-slate-600 mt-2">No complicated setup. Just simple, compassionate daily self-care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 p-6 rounded-3xl border border-purple-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Check In Daily</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take 30 seconds to tap your current mood, select emotional tags, and write brief thoughts to ground yourself.
              </p>
            </div>

            <div className="bg-white/90 p-6 rounded-3xl border border-purple-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Engage With Mindfulness</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use guided 4-7-8 breathing, sensory grounding exercises, or converse with the AI Guide to unpack feelings.
              </p>
            </div>

            <div className="bg-white/90 p-6 rounded-3xl border border-purple-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-lavender-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Notice Trends & Grow</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review your 7-day and 30-day emotional trajectories, notice personal triggers, and cultivate lasting resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Attribution & Case 59 Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>Academic Mini-Project Showcase • Viva Ready</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Case 59: AI-Powered Mental Wellness Web Application
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Developed as a prototype for university evaluation, addressing a startup scenario offering mood tracking and guided breathing exercises to 20,000 users. Engineered using Agile Lean principles, Prototype SDLC, secure JWT authentication, and strict AI crisis safety guardrails.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs text-slate-500 font-medium">Student Name & USN</div>
                  <div className="text-base font-bold text-slate-900">Maruthi Dapke</div>
                  <div className="text-xs font-mono text-purple-700">ENG24CS0127</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs text-slate-500 font-medium">Institution & Department</div>
                  <div className="text-base font-bold text-slate-900">Dayananda Sagar University</div>
                  <div className="text-xs text-slate-600">School of Engineering, Bengaluru</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-tr from-purple-50 to-lavender-50 p-6 rounded-3xl border border-purple-200 text-center space-y-4">
              <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Viva Demonstration</h4>
              <p className="text-xs text-slate-600">
                Pre-seeded with realistic moods, journals, and activities for effortless presentation.
              </p>
              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {demoLoading ? 'Authenticating...' : 'Launch Demo Session'}
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

