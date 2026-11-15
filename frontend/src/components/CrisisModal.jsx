import React from 'react';
import { Phone, AlertCircle, HeartHandshake, X, ExternalLink } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="p-3 bg-red-50 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Immediate Support & Crisis Helplines</h3>
            <p className="text-xs text-red-600 font-medium">Free, Confidential, 24/7 Professional Help</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          If you or someone you know is going through a difficult time, experiencing thoughts of self-harm, or feeling in immediate crisis, please know you are not alone. Please reach out to these dedicated hotlines right away:
        </p>

        <div className="space-y-3 mb-6">
          <div className="p-3.5 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-sm">Tele-MANAS (India Govt Helpline)</div>
              <div className="text-xs text-slate-500">24/7 Toll-free multi-language mental health service</div>
            </div>
            <a
              href="tel:14416"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call 14416
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-sm">Vandrevala Foundation (India)</div>
              <div className="text-xs text-slate-500">Free, confidential 24/7 counseling helpline</div>
            </div>
            <a
              href="tel:9999666555"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> 9999 666 555
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-sm">988 Suicide & Crisis Lifeline (US & Canada)</div>
              <div className="text-xs text-slate-500">Call or text 988 anytime 24/7</div>
            </div>
            <a
              href="tel:988"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call 988
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-sm">International Directory (100+ Countries)</div>
              <div className="text-xs text-slate-500">Find vetted crisis hotlines in your region</div>
            </div>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            MindCare is an emotional self-care and wellness tool. It is not designed to handle medical crises or replace psychiatric diagnosis and medical care.
          </span>
        </div>
      </div>
    </div>
  );
}

