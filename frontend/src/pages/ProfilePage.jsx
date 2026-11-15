import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  GraduationCap,
  Download,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserState, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dailyReminder, setDailyReminder] = useState(user?.preferences?.dailyReminder ?? true);
  const [soundEnabled, setSoundEnabled] = useState(user?.preferences?.soundEnabled ?? true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await api.updateProfile({
        name,
        bio,
        preferences: {
          dailyReminder,
          soundEnabled
        }
      });
      if (res.success) {
        updateUserState(res.user);
        setProfileMsg({ type: 'success', text: 'Profile preferences updated successfully.' });
        setTimeout(() => setProfileMsg({ type: '', text: '' }), 4000);
      } else {
        setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Network error updating profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMsg({ type: '', text: '' }), 4000);
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Network error changing password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [moodRes, journalRes, actRes] = await Promise.all([
        api.getMoods(),
        api.getJournals(),
        api.getActivities()
      ]);

      const exportObject = {
        app: 'MindCare Mental Wellness Platform',
        case: 'Case 59 – Dayananda Sagar University',
        exportedAt: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
          studentDetails: user?.studentDetails
        },
        moods: moodRes.moods || [],
        journals: journalRes.journals || [],
        activities: actRes.activities || []
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindcare_data_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Data export failed:', e);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-purple-600" />
          <span>User Profile & Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details, notification preferences, and privacy controls.
        </p>
      </div>

      {/* University Viva Project Attribution Card */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-lavender-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
              <GraduationCap className="w-4 h-4" />
              <span>University Mini-Project Attribution</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Case 59: Mental Wellness App</h2>
            <div className="text-xs text-purple-100 space-y-1">
              <div>Student Developer: <strong className="text-white">Maruthi Dapke</strong></div>
              <div>University Seat Number (USN): <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">ENG24CS0127</span></div>
              <div>Institution: <strong>Dayananda Sagar University, School of Engineering, Bengaluru</strong></div>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center text-xs backdrop-blur-xs">
            <span className="text-emerald-300 font-bold block mb-1">Status: Verified</span>
            <span className="text-[11px] text-purple-200">Agile Lean Prototype</span>
          </div>
        </div>
      </div>

      {/* Profile Information & Edit Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Details</h2>
        <p className="text-xs text-slate-500 mb-6">Personal information visible on your dashboard.</p>

        {profileMsg.text && (
          <div className={`mb-4 p-3 rounded-2xl text-xs flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Read Only)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Wellness Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Notification & Sensor Preferences</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700">Receive gentle daily mindfulness reminders</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700">Enable breathing chime cues & audio effects</span>
              </label>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-75"
            >
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          <span>Security & Password</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">Update your account password with salted hashing.</p>

        {passwordMsg.text && (
          <div className={`mb-4 p-3 rounded-2xl text-xs flex items-center gap-2 ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-75"
          >
            {passwordLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Privacy, Export & Logout */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Data Ownership & Privacy</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Export a complete JSON archive of all your private check-ins, journal entries, and activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4 text-purple-600" />
            Export My Data (.JSON)
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

