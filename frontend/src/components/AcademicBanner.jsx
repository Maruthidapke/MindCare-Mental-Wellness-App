import React from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';

export default function AcademicBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-lavender-700 text-white text-xs py-2 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full font-medium text-[11px] backdrop-blur-xs">
            <GraduationCap className="w-3.5 h-3.5" /> Case 59: Mental Wellness App
          </span>
          <span className="hidden sm:inline text-purple-200">|</span>
          <span className="font-semibold text-white">Student: Maruthi Dapke</span>
          <span className="hidden md:inline text-purple-200 font-mono">(USN: ENG24CS0127)</span>
        </div>
        <div className="flex items-center gap-3 text-purple-100 text-[11px]">
          <span className="hidden lg:inline">Dayananda Sagar University, School of Engineering, Bengaluru</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30 font-medium">
            Verified Prototype v1.0
          </span>
        </div>
      </div>
    </div>
  );
}

