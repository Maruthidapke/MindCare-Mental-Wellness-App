import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Wind } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function SoundBar({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');

  const sounds = [
    { id: 'rain', name: 'Gentle Rain', icon: CloudRain, desc: 'Soft pink noise drops' },
    { id: 'ocean', name: 'Ocean Waves', icon: Waves, desc: 'Rolling brown tidal flow' },
    { id: 'forest', name: 'Forest Breeze', icon: Wind, desc: 'Calming wind frequency' },
  ];

  const handlePlayToggle = (soundId) => {
    if (isPlaying && currentSound === soundId) {
      soundEngine.stopAmbient();
      setIsPlaying(false);
    } else {
      soundEngine.startAmbient(soundId);
      setCurrentSound(soundId);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      // Keep playing across pages or stop on unmount if needed
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 sm:right-8 z-40 bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 w-80 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-lavender-100 rounded-xl text-lavender-700">
            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Calming Soundscapes</h4>
            <p className="text-[11px] text-slate-500">Synthesized pure ambient frequencies</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {sounds.map(s => {
          const Icon = s.icon;
          const active = isPlaying && currentSound === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handlePlayToggle(s.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                active
                  ? 'bg-gradient-to-r from-lavender-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-50 hover:bg-lavender-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl ${active ? 'bg-white/20' : 'bg-white text-lavender-600 shadow-xs'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{s.name}</div>
                  <div className={`text-[10px] ${active ? 'text-purple-100' : 'text-slate-400'}`}>{s.desc}</div>
                </div>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                active ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
              }`}>
                {active ? 'Playing' : 'Play'}
              </span>
            </button>
          );
        })}
      </div>

      {isPlaying && (
        <button
          onClick={() => {
            soundEngine.stopAmbient();
            setIsPlaying(false);
          }}
          className="w-full mt-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-center"
        >
          Stop Ambient Audio
        </button>
      )}
    </div>
  );
}

