
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Heart,
  PhoneCall,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Wind,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **MindCare AI**, your gentle wellness companion. 🌿

I am here to offer a calm, non-judgmental space to listen, suggest breathing exercises, guide you through grounding techniques, and help unpack daily stress.

*Please note: I am an AI companion for emotional well-being and mindfulness. I cannot provide medical diagnosis, prescribe treatments, or substitute for a licensed mental health professional.*

How is your heart and mind feeling today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const promptStarters = [
    "I'm feeling overwhelmed with college exams and projects.",
    "Can you guide me through a calming breathing exercise?",
    "I'm having trouble sleeping tonight because my mind is racing.",
    "I'm feeling a bit lonely and just need someone to talk with.",
    "I accomplished a personal goal today and feel really proud!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.sendMessage(userMsg.content, history);

      if (res.success && res.reply) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.reply,
          isCrisis: res.isCrisis,
          actionSuggestions: res.actionSuggestions,
          suggestedActivity: res.suggestedActivity,
          source: res.source,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I apologize, I'm having a brief connection pause. Please take a mindful breath and try messaging me again.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting to the wellness engine right now. Please verify that the backend server is running.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-7 h-7 text-lavender-600" />
            <span>MindCare AI Wellness Guide</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empathetic, non-judgmental guidance with built-in crisis safeguards and mindfulness support.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-2xl border border-purple-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Case 59 Ethical Guardrails Active</span>
        </div>
      </div>

      {/* Medical Safety Disclaimer Pill */}
      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Ethical & Safety Notice:</strong> This AI companion is designed for mindfulness coaching and emotional encouragement. It never diagnoses mental illnesses, does not prescribe medication, and is not a clinical therapist. In any emergency, call Tele-MANAS (14416) or 988.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-card rounded-3xl shadow-md border border-purple-100 flex flex-col h-[650px] overflow-hidden">

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-lavender-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${isUser
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm rounded-tr-sm'
                    : m.isCrisis
                      ? 'bg-red-50 border-2 border-red-300 text-slate-800 shadow-md rounded-tl-sm'
                      : 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs rounded-tl-sm'
                  }`}>

                  {m.isCrisis && (
                    <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                      <PhoneCall className="w-4 h-4" />
                      <span>Crisis Support Safety Guardrail Triggered</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">
                    {m.content}
                  </div>

                  {/* Crisis Action Hotline Buttons */}
                  {m.actionSuggestions && (
                    <div className="mt-4 pt-3 border-t border-red-200 flex flex-wrap gap-2">
                      {m.actionSuggestions.map((act, i) => (
                        <a
                          key={i}
                          href={act.action}
                          target={act.action.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          {act.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested Activity Link */}
                  {m.suggestedActivity && !m.isCrisis && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5" /> Recommended: {m.suggestedActivity}
                      </span>
                      <Link
                        to="/mindfulness"
                        className="text-[11px] font-bold text-purple-900 underline hover:text-purple-700"
                      >
                        Try Now →
                      </Link>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 flex items-center justify-between ${isUser ? 'text-purple-200' : 'text-slate-400'
                    }`}>
                    <span>{m.source || (isUser ? 'You' : 'MindCare AI')}</span>
                    <span>{m.time}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs animate-pulse">
              <div className="w-8 h-8 rounded-2xl bg-lavender-100 text-purple-700 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                MindCare AI is listening mindfully...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt starter chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex gap-2 no-scrollbar">
            {promptStarters.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleSend(starter)}
                className="text-[11px] bg-white hover:bg-lavender-50 text-slate-700 hover:text-purple-800 px-3 py-1.5 rounded-full border border-slate-200/80 whitespace-nowrap transition-colors shadow-2xs"
              >
                ✦ {starter}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-purple-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Express what is on your mind (e.g. stress, anxiety, joy)..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

