import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Lock,
  Sparkles
} from 'lucide-react';

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('ALL');

  // Modal / Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('Thoughtful');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Read Modal
  const [activeReadingJournal, setActiveReadingJournal] = useState(null);

  const moodTagOptions = [
    'Thoughtful', 'Grateful', 'Calm', 'Stressed', 'Optimistic', 'Reflective', 'Vulnerable'
  ];

  const loadJournals = async () => {
    try {
      setLoading(true);
      const res = await api.getJournals();
      if (res.success) {
        setJournals(res.journals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const openNewEntryModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setMoodTag('Thoughtful');
    setTagsInput('');
    setIsEditorOpen(true);
  };

  const openEditModal = (journal) => {
    setEditingId(journal._id || journal.id);
    setTitle(journal.title);
    setContent(journal.content);
    setMoodTag(journal.moodTag || 'Thoughtful');
    setTagsInput(journal.tags ? journal.tags.join(', ') : '');
    setIsEditorOpen(true);
  };

  const handleSaveJournal = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setNotification({ type: 'error', message: 'Title and content are required.' });
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      setSubmitting(true);
      if (editingId) {
        const res = await api.updateJournal(editingId, {
          title: title.trim(),
          content: content.trim(),
          moodTag,
          tags: tagsArray
        });
        if (res.success) {
          setNotification({ type: 'success', message: 'Journal entry updated successfully.' });
          setIsEditorOpen(false);
          await loadJournals();
        }
      } else {
        const res = await api.addJournal({
          title: title.trim(),
          content: content.trim(),
          moodTag,
          tags: tagsArray
        });
        if (res.success) {
          setNotification({ type: 'success', message: 'Journal entry saved to your private sanctuary.' });
          setIsEditorOpen(false);
          await loadJournals();
        }
      }
      setTimeout(() => setNotification({ type: '', message: '' }), 3500);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to save entry.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJournal = async (id) => {
    if (!window.confirm('Delete this journal entry? This action is permanent.')) return;
    try {
      const res = await api.deleteJournal(id);
      if (res.success) {
        if (activeReadingJournal && (activeReadingJournal._id === id || activeReadingJournal.id === id)) {
          setActiveReadingJournal(null);
        }
        await loadJournals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJournals = journals.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMoodFilter === 'ALL' || j.moodTag === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <span>Private Personal Journal</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Your thoughts are private, securely stored, and isolated to your account.</span>
          </p>
        </div>

        <button
          onClick={openNewEntryModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Write New Entry
        </button>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by title or words..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:border-purple-500 text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Mood Tag:</span>
          <select
            value={selectedMoodFilter}
            onChange={(e) => setSelectedMoodFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Mood Tags ({journals.length})</option>
            {moodTagOptions.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal Entries List */}
      {filteredJournals.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Your Journal is Quiet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            There are no entries matching your current view. Taking 3 minutes to write whatever is on your mind helps clear mental fog.
          </p>
          <button
            onClick={openNewEntryModal}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Write First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.map((journal) => (
            <div
              key={journal._id || journal.id}
              className="glass-card glass-card-hover rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {journal.moodTag || 'Thought'}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <h3
                  onClick={() => setActiveReadingJournal(journal)}
                  className="text-base font-bold text-slate-900 mb-2 cursor-pointer hover:text-purple-700 transition-colors line-clamp-1"
                >
                  {journal.title}
                </h3>

                <p
                  onClick={() => setActiveReadingJournal(journal)}
                  className="text-xs text-slate-600 leading-relaxed line-clamp-4 cursor-pointer hover:text-slate-800 mb-4"
                >
                  {journal.content}
                </p>

                {journal.tags && journal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {journal.tags.map(t => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveReadingJournal(journal)}
                  className="text-xs font-semibold text-purple-700 hover:underline"
                >
                  Read Full Entry →
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(journal)}
                    title="Edit Entry"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJournal(journal._id || journal.id)}
                    title="Delete Entry"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write / Edit Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Edit Journal Entry' : 'New Journal Reflection'}
                </h3>
                <p className="text-xs text-slate-500">Express yourself freely in your encrypted space</p>
              </div>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Finding calm amidst mid-term pressure"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emotional Mood Tag</label>
                  <select
                    value={moodTag}
                    onChange={(e) => setMoodTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs font-medium"
                  >
                    {moodTagOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Mindfulness, Exam, Health"
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thoughts & Feelings</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Pour your thoughts here without self-judgment. What went well today? What caused worry? How can you show yourself kindness?"
                  required
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-xs sm:text-sm leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-75"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expanded Read Modal */}
      {activeReadingJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative max-h-[85vh] flex flex-col justify-between">
            <div>
              <button
                onClick={() => setActiveReadingJournal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {activeReadingJournal.moodTag || 'Thought'}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(activeReadingJournal.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {activeReadingJournal.title}
              </h2>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line max-h-[45vh] overflow-y-auto pr-2">
                {activeReadingJournal.content}
              </div>

              {activeReadingJournal.tags && activeReadingJournal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-100">
                  {activeReadingJournal.tags.map(t => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const toEdit = activeReadingJournal;
                  setActiveReadingJournal(null);
                  openEditModal(toEdit);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => setActiveReadingJournal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

