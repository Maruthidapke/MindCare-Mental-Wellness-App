import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { soundEngine } from '../utils/audio';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  Clock, 
  Heart, 
  Eye, 
  Hand, 
  Ear, 
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MindfulnessPage() {
  const [activeTab, setActiveTab] = useState('breathing'); // breathing | meditation | grounding | tips

  // BREATHING STUDIO STATE
  const [technique, setTechnique] = useState('4-7-8'); // 4-7-8 | box | calm
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completionNotice, setCompletionNotice] = useState('');

  const techniques = {
    '4-7-8': {
      name: '4-7-8 Relaxing Breath',
      desc: 'Rapidly triggers the parasympathetic nervous system to reduce acute stress and promote deep sleep.',
      phases: [
        { name: 'Inhale through nose', duration: 4, action: 'inhale', scale: 'scale-125' },
        { name: 'Hold gently', duration: 7, action: 'hold', scale: 'scale-125' },
        { name: 'Exhale through mouth', duration: 8, action: 'exhale', scale: 'scale-90' },
      ],
      targetCycles: 4
    },
    'box': {
      name: 'Box Breathing (4-4-4-4)',
      desc: 'Used by first-responders and athletes to clear mental static, heighten focus, and regain composure.',
      phases: [
        { name: 'Inhale steadily', duration: 4, action: 'inhale', scale: 'scale-120' },
        { name: 'Hold breath', duration: 4, action: 'hold', scale: 'scale-120' },
        { name: 'Exhale steadily', duration: 4, action: 'exhale', scale: 'scale-95' },
        { name: 'Hold empty', duration: 4, action: 'hold', scale: 'scale-95' },
      ],
      targetCycles: 4
    },
    'calm': {
      name: 'Coherent 5-5 Breath',
      desc: 'Synchronizes heart rate variability (HRV) with respiratory sinus arrhythmia for emotional equilibrium.',
      phases: [
        { name: 'Slow deep Inhale', duration: 5, action: 'inhale', scale: 'scale-125' },
        { name: 'Slow smooth Exhale', duration: 5, action: 'exhale', scale: 'scale-90' },
      ],
      targetCycles: 6
    }
  };

  const currentTech = techniques[technique];
  const currentPhase = currentTech.phases[phaseIndex];

  // Breathing interval timer
  useEffect(() => {
    let timer = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseTimer((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIdx = (phaseIndex + 1) % currentTech.phases.length;
            if (nextIdx === 0) {
              setCycleCount(c => c + 1);
            }
            setPhaseIndex(nextIdx);
            const nextDuration = currentTech.phases[nextIdx].duration;

            if (soundEnabled) {
              soundEngine.playChime(currentTech.phases[nextIdx].action);
            }
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, phaseIndex, technique, soundEnabled]);

  const handleStartBreathing = () => {
    setIsBreathingActive(true);
    if (soundEnabled) {
      soundEngine.playChime('inhale');
    }
  };

  const handlePauseBreathing = () => {
    setIsBreathingActive(false);
  };

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    setPhaseIndex(0);
    setPhaseTimer(currentTech.phases[0].duration);
    setCycleCount(0);
  };

  const handleCompleteSession = async () => {
    setIsBreathingActive(false);
    const durationSeconds = cycleCount * currentTech.phases.reduce((sum, p) => sum + p.duration, 0) || 120;
    try {
      await api.completeActivity({
        name: currentTech.name,
        type: 'breathing',
        duration: durationSeconds
      });
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      setCompletionNotice(`Completed ${cycleCount || 1} rounds of ${currentTech.name}! Saved to your wellness history.`);
      setTimeout(() => setCompletionNotice(''), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  // MEDITATION TIMER STATE
  const [medDuration, setMedDuration] = useState(300); // 5 mins in seconds
  const [medRemaining, setMedRemaining] = useState(300);
  const [medActive, setMedActive] = useState(false);
  const [medSound, setMedSound] = useState('rain');

  useEffect(() => {
    let interval = null;
    if (medActive) {
      interval = setInterval(() => {
        setMedRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setMedActive(false);
            soundEngine.stopAmbient();
            soundEngine.playChime('inhale');
            api.completeActivity({
              name: 'Guided Mindful Meditation',
              type: 'meditation',
              duration: medDuration
            });
            confetti({ particleCount: 60 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [medActive, medDuration]);

  const toggleMeditation = (duration) => {
    if (medActive) {
      setMedActive(false);
      soundEngine.stopAmbient();
    } else {
      setMedDuration(duration);
      setMedRemaining(duration);
      setMedActive(true);
      soundEngine.startAmbient(medSound);
    }
  };

  // GROUNDING 5-4-3-2-1 STATE
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { count: 5, sense: 'SEE', desc: 'Acknowledge 5 things you see around you right now (a book, sunlight on a desk, a plant, a coffee mug, your hands).' },
    { count: 4, sense: 'FEEL', desc: 'Acknowledge 4 things you can physically touch or feel (the fabric of your clothes, feet on the floor, cool breeze, hair on your skin).' },
    { count: 3, sense: 'HEAR', desc: 'Acknowledge 3 distinct sounds around you (birds outside, a fan hum, distant footsteps, clock ticking).' },
    { count: 2, sense: 'SMELL', desc: 'Acknowledge 2 things you can smell (fresh air, coffee, rain, soap). If you cannot smell anything, imagine your favorite aroma.' },
    { count: 1, sense: 'TASTE', desc: 'Acknowledge 1 thing you can taste (a sip of cool water, fresh mint, or simply the presence of your own breath).' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wind className="w-7 h-7 text-purple-600" />
            <span>Mindfulness & Relaxation Studio</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Physiological relaxation techniques, breathing timers, and somatic sensory grounding.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-white border border-purple-100 rounded-2xl shadow-xs">
          {[
            { id: 'breathing', label: 'Breathing' },
            { id: 'meditation', label: 'Meditation' },
            { id: 'grounding', label: '5-4-3-2-1' },
            { id: 'tips', label: 'Tips' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {completionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{completionNotice}</span>
        </div>
      )}

      {/* TAB 1: BREATHING STUDIO */}
      {activeTab === 'breathing' && (
        <div className="space-y-6">
          {/* Technique Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(techniques).map(([key, item]) => {
              const isSelected = technique === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setTechnique(key);
                    handleResetBreathing();
                  }}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-50/80 border-purple-400 shadow-sm ring-2 ring-purple-200'
                      : 'bg-white border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
                    {key.toUpperCase()}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Breathing Canvas */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
            <div className="max-w-md mx-auto space-y-6">
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Rounds Completed: <strong className="text-purple-900">{cycleCount}</strong></span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${
                    soundEnabled ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{soundEnabled ? 'Chimes On' : 'Chimes Muted'}</span>
                </button>
              </div>

              {/* Animated Circle Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-4">
                {/* Visual pulsating aura */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-lavender-300 via-purple-300 to-indigo-200 opacity-60 transition-all duration-1000 ease-in-out ${
                    isBreathingActive ? currentPhase.scale : 'scale-95'
                  }`}
                />

                {/* Inner White Core */}
                <div className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-purple-100">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 mb-1">
                    {isBreathingActive ? currentPhase.name : 'Ready'}
                  </span>
                  <span className="text-5xl font-black text-slate-900 tracking-tight">
                    {isBreathingActive ? phaseTimer : '✦'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-2">
                    {isBreathingActive ? `Phase ${phaseIndex + 1} of ${currentTech.phases.length}` : 'Tap Play Below'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetBreathing}
                  title="Reset"
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {!isBreathingActive ? (
                  <button
                    onClick={handleStartBreathing}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start Breathing Session
                  </button>
                ) : (
                  <button
                    onClick={handlePauseBreathing}
                    className="px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Pause className="w-4 h-4" />
                    Pause Exercise
                  </button>
                )}

                {cycleCount > 0 && (
                  <button
                    onClick={handleCompleteSession}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 italic">
                Inhale quietly through your nose, hold with relaxed shoulders, and release slowly through your mouth.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUIDED MEDITATION */}
      {activeTab === 'meditation' && (
        <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-sm text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">Guided Meditation Timer</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Choose your practice duration. We will blend continuous natural acoustic soundscapes and chime gently when your meditation concludes.
            </p>

            {/* Time selection */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '3 Mins', sec: 180 },
                { label: '5 Mins', sec: 300 },
                { label: '10 Mins', sec: 600 }
              ].map(t => (
                <button
                  key={t.sec}
                  onClick={() => toggleMeditation(t.sec)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    medActive && medDuration === t.sec
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div className="text-lg font-bold">{t.label}</div>
                  <div className={`text-[10px] ${medActive && medDuration === t.sec ? 'text-purple-200' : 'text-slate-400'}`}>
                    {medActive && medDuration === t.sec ? 'Active' : 'Start'}
                  </div>
                </button>
              ))}
            </div>

            {/* Big Countdown Display */}
            {medActive && (
              <div className="p-8 bg-purple-50/60 rounded-3xl border border-purple-200">
                <div className="text-5xl font-black text-purple-950 font-mono tracking-tight">
                  {Math.floor(medRemaining / 60)}:{(medRemaining % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-purple-700 mt-2 font-medium">
                  Close your eyes, breathe naturally, and rest your attention on each inhalation.
                </p>
                <button
                  onClick={() => toggleMeditation(0)}
                  className="mt-4 px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  End Meditation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 5-4-3-2-1 GROUNDING TECHNIQUE */}
      {activeTab === 'grounding' && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">5-4-3-2-1 Somatic Grounding Technique</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bring hyperventilating or anxious minds back into the present physical environment.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Step {groundingStep + 1} of 5
            </span>
          </div>

          <div className="p-8 bg-gradient-to-br from-purple-50/80 to-lavender-50 rounded-3xl border border-purple-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-600 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md">
              {groundingSteps[groundingStep].count}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Things You Can {groundingSteps[groundingStep].sense}
            </div>
            <p className="text-sm sm:text-base text-slate-800 max-w-lg mx-auto leading-relaxed font-medium">
              {groundingSteps[groundingStep].desc}
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                disabled={groundingStep === 0}
                onClick={() => setGroundingStep(s => s - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 disabled:opacity-40"
              >
                Previous
              </button>

              {groundingStep < 4 ? (
                <button
                  onClick={() => setGroundingStep(s => s + 1)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await api.completeActivity({
                      name: '5-4-3-2-1 Sensory Grounding',
                      type: 'relaxation',
                      duration: 300
                    });
                    confetti({ particleCount: 70 });
                    setCompletionNotice('Grounding exercise completed and saved!');
                    setGroundingStep(0);
                    setTimeout(() => setCompletionNotice(''), 4000);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete & Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STRESS TIPS LIBRARY */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'The Physiological Sigh',
              category: 'Neuroscience',
              desc: 'Two quick inhales through the nose followed by one long, slow exhale through the mouth. Two cycles immediately brings your autonomic nervous system back to baseline.'
            },
            {
              title: 'Progressive Muscle Relaxation',
              category: 'Somatic',
              desc: 'Tense your toes for 5 seconds, then release. Move upward to calves, thighs, abdomen, shoulders, and jaw. Notice the stark difference between tension and ease.'
            },
            {
              title: 'Worry Postponement Window',
              category: 'Cognitive',
              desc: 'Allocate a fixed 15-minute slot at 5:00 PM for all your worries. When anxious thoughts intrude at noon, gently tell yourself: "I will address this during my designated worry window."'
            },
            {
              title: 'The 20-20-20 Vision Break',
              category: 'Physical',
              desc: 'Every 20 minutes spent staring at screens, look at an object 20 feet away for 20 seconds. This releases ocular nerve strain, reducing physical tension headaches.'
            }
          ].map((tip, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                {tip.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{tip.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

