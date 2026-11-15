import React from 'react';
import { Link } from 'lucide-react';
import { Heart, Shield, Phone, Sparkles, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-lavender-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MindCare</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An evidence-informed digital mental wellness platform helping individuals nurture emotional balance, log daily moods, practice guided mindfulness, and reflect in private journals.
            </p>
            <div className="flex items-center gap-2 text-xs text-lavender-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Tracking Privacy Guarantee</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/moods" className="hover:text-lavender-300 transition-colors">Daily Mood Check-In</a></li>
              <li><a href="/journal" className="hover:text-lavender-300 transition-colors">Private Digital Journal</a></li>
              <li><a href="/mindfulness" className="hover:text-lavender-300 transition-colors">4-7-8 & Box Breathing</a></li>
              <li><a href="/ai-assistant" className="hover:text-lavender-300 transition-colors">MindCare AI Wellness Companion</a></li>
              <li><a href="/analytics" className="hover:text-lavender-300 transition-colors">Emotional Progress Trends</a></li>
            </ul>
          </div>

          {/* Crisis & Medical Disclaimer */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 text-red-400">
              <Phone className="w-4 h-4" /> 24/7 Crisis Support
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              If you are in distress or experiencing thoughts of self-harm, free confidential professional help is available 24/7:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">Tele-MANAS (India):</span>
                <a href="tel:14416" className="text-red-400 font-mono font-semibold hover:underline">14416</a>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">Vandrevala Foundation:</span>
                <a href="tel:9999666555" className="text-red-400 font-mono font-semibold hover:underline">9999 666 555</a>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">US & Canada Lifeline:</span>
                <a href="tel:988" className="text-red-400 font-mono font-semibold hover:underline">988</a>
              </li>
            </ul>
          </div>

          {/* Academic Attribution */}
          <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/70">
            <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" /> University Mini-Project
            </div>
            <h5 className="text-sm font-bold text-white">Case 59 – Mental Wellness App</h5>
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
              <div><span className="text-slate-500">Developer:</span> <span className="text-white font-medium">Maruthi Dapke</span></div>
              <div><span className="text-slate-500">USN:</span> <span className="font-mono text-purple-300">ENG24CS0127</span></div>
              <div className="text-[11px] text-slate-400 pt-1 leading-normal">
                Dayananda Sagar University, School of Engineering, Bengaluru.
              </div>
            </div>
          </div>
        </div>

        {/* Ethical disclaimer bar */}
        <div className="pt-8 border-t border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Important Medical Disclaimer:</strong> MindCare is designed solely for personal emotional awareness, relaxation, and self-reflection. It is NOT a diagnostic tool, medical device, or licensed therapeutic service. If you are experiencing symptoms of clinical anxiety, major depression, or any psychological disorder, please consult a qualified healthcare professional.
          </p>
          <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-4 pt-2">
            <span>© 2026 MindCare. All rights reserved.</span>
            <span>•</span>
            <span>Case 59 Prototype Verification</span>
            <span>•</span>
            <span>Built with React, Tailwind CSS, Node.js & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

