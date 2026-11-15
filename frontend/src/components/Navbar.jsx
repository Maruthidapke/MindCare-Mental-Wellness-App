import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Home, 
  Smile, 
  BookOpen, 
  Bot, 
  Wind, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Volume2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import SoundBar from './SoundBar';
import CrisisModal from './CrisisModal';
import { api } from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, logout, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Mood Tracker', path: '/moods', icon: Smile },
        { name: 'Journal', path: '/journal', icon: BookOpen },
        { name: 'AI Guide', path: '/ai-assistant', icon: Bot },
        { name: 'Mindfulness', path: '/mindfulness', icon: Wind },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    : [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Features', path: '/#features', icon: Sparkles },
        { name: 'Mindfulness', path: '/mindfulness', icon: Wind },
        { name: 'About Case 59', path: '/#about', icon: Heart },
      ];

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      const res = await api.demoLogin();
      if (res.success && res.token) {
        login(res.token, res.user);
        navigate('/dashboard');
      }
    } catch (e) {
      console.error('Demo login failed:', e);
    } finally {
      setDemoLoading(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lavender-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-900 via-indigo-900 to-lavender-700 bg-clip-text text-transparent">
                  MindCare
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                  Case 59
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-lavender-100/80 text-purple-800 shadow-xs'
                        : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-slate-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Soundscapes Quick Toggle */}
              <button
                onClick={() => setSoundModalOpen(!soundModalOpen)}
                title="Ambient Soundscapes"
                className="p-2.5 rounded-2xl text-slate-600 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 transition-colors relative"
              >
                <Volume2 className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
              </button>

              {/* Crisis Helpline SOS Button */}
              <button
                onClick={() => setCrisisModalOpen(true)}
                title="Immediate Crisis & Helpline Directory"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/70 transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Help & Crisis</span>
              </button>

              {/* Soundbar popover */}
              <SoundBar isOpen={soundModalOpen} onClose={() => setSoundModalOpen(false)} />

              {/* User menu or Login/Register buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-lavender-50 transition-colors border border-transparent hover:border-purple-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-lavender-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>

                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2.5 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Quick Viva Demo Login Button */}
                  <button
                    onClick={handleDemoLogin}
                    disabled={demoLoading}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm shadow-purple-500/20 active:scale-95 disabled:opacity-75"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {demoLoading ? 'Authenticating...' : '1-Click Demo Login'}
                  </button>

                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-lavender-600 hover:bg-lavender-700 transition-all shadow-sm shadow-lavender-500/25 active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-purple-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-lavender-100 text-purple-800'
                      : 'text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-purple-600" />
                  {link.name}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  {demoLoading ? 'Authenticating...' : '1-Click Student Demo Login'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-2xl text-center text-sm font-semibold border border-purple-200 text-purple-700 bg-purple-50/50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-2xl text-center text-sm font-semibold bg-lavender-600 text-white shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Crisis Helpline Modal */}
      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </>
  );
}

