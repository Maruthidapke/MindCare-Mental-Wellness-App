import { isMongo, getLocalDB, saveLocalDB } from '../config/db.js';
import User from '../models/User.js';
import Mood from '../models/Mood.js';
import Journal from '../models/Journal.js';
import Activity from '../models/Activity.js';
import crypto from 'crypto';

const genId = () => crypto.randomBytes(12).toString('hex');

export const store = {
  // USER METHODS
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongo()) {
      return await User.findOne({ email: cleanEmail });
    }
    const db = getLocalDB();
    return db.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isMongo()) {
      return await User.findById(id).select('-password');
    }
    const db = getLocalDB();
    const user = db.users.find(u => (u._id || u.id) === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    if (isMongo()) {
      const newUser = new User(userData);
      return await newUser.save();
    }
    const db = getLocalDB();
    const newUser = {
      _id: genId(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveLocalDB(db);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (isMongo()) {
      return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
    }
    const db = getLocalDB();
    const index = db.users.findIndex(u => (u._id || u.id) === id);
    if (index === -1) return null;
    db.users[index] = {
      ...db.users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveLocalDB(db);
    const { password, ...safeUser } = db.users[index];
    return safeUser;
  },

  // MOOD METHODS
  async getUserMoods(userId, limit = 50) {
    if (isMongo()) {
      return await Mood.find({ userId }).sort({ timestamp: -1 }).limit(limit);
    }
    const db = getLocalDB();
    return db.moods
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  async createMood(userId, { mood, notes = '', tags = [], score, timestamp }) {
    const moodScoreMap = {
      'Very Happy': 6,
      'Happy': 5,
      'Neutral': 4,
      'Sad': 2,
      'Stressed': 2,
      'Anxious': 1
    };
    const finalScore = score || moodScoreMap[mood] || 4;
    const finalTimestamp = timestamp ? new Date(timestamp) : new Date();

    if (isMongo()) {
      const entry = new Mood({
        userId,
        mood,
        score: finalScore,
        notes,
        tags,
        timestamp: finalTimestamp
      });
      return await entry.save();
    }
    const db = getLocalDB();
    const newEntry = {
      _id: genId(),
      userId,
      mood,
      score: finalScore,
      notes,
      tags,
      timestamp: finalTimestamp.toISOString()
    };
    db.moods.push(newEntry);
    saveLocalDB(db);
    return newEntry;
  },

  async deleteMood(userId, moodId) {
    if (isMongo()) {
      return await Mood.findOneAndDelete({ _id: moodId, userId });
    }
    const db = getLocalDB();
    const initialLen = db.moods.length;
    db.moods = db.moods.filter(m => !((m._id || m.id) === moodId && m.userId === userId));
    saveLocalDB(db);
    return db.moods.length < initialLen;
  },

  // JOURNAL METHODS
  async getUserJournals(userId) {
    if (isMongo()) {
      return await Journal.find({ userId }).sort({ createdAt: -1 });
    }
    const db = getLocalDB();
    return db.journals
      .filter(j => j.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getJournalById(userId, journalId) {
    if (isMongo()) {
      return await Journal.findOne({ _id: journalId, userId });
    }
    const db = getLocalDB();
    return db.journals.find(j => (j._id || j.id) === journalId && j.userId === userId) || null;
  },

  async createJournal(userId, { title, content, moodTag = 'Neutral', tags = [] }) {
    if (isMongo()) {
      const entry = new Journal({
        userId,
        title,
        content,
        moodTag,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return await entry.save();
    }
    const db = getLocalDB();
    const newEntry = {
      _id: genId(),
      userId,
      title,
      content,
      moodTag,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.journals.push(newEntry);
    saveLocalDB(db);
    return newEntry;
  },

  async updateJournal(userId, journalId, { title, content, moodTag, tags }) {
    if (isMongo()) {
      return await Journal.findOneAndUpdate(
        { _id: journalId, userId },
        {
          $set: {
            title,
            content,
            moodTag,
            tags,
            updatedAt: new Date()
          }
        },
        { new: true }
      );
    }
    const db = getLocalDB();
    const index = db.journals.findIndex(j => (j._id || j.id) === journalId && j.userId === userId);
    if (index === -1) return null;
    db.journals[index] = {
      ...db.journals[index],
      title: title !== undefined ? title : db.journals[index].title,
      content: content !== undefined ? content : db.journals[index].content,
      moodTag: moodTag !== undefined ? moodTag : db.journals[index].moodTag,
      tags: tags !== undefined ? tags : db.journals[index].tags,
      updatedAt: new Date().toISOString()
    };
    saveLocalDB(db);
    return db.journals[index];
  },

  async deleteJournal(userId, journalId) {
    if (isMongo()) {
      return await Journal.findOneAndDelete({ _id: journalId, userId });
    }
    const db = getLocalDB();
    const initialLen = db.journals.length;
    db.journals = db.journals.filter(j => !((j._id || j.id) === journalId && j.userId === userId));
    saveLocalDB(db);
    return db.journals.length < initialLen;
  },

  // WELLNESS ACTIVITIES METHODS
  async getUserActivities(userId, limit = 50) {
    if (isMongo()) {
      return await Activity.find({ userId }).sort({ completedAt: -1 }).limit(limit);
    }
    const db = getLocalDB();
    return db.activities
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit);
  },

  async createActivity(userId, { name, type, duration, completed = true }) {
    if (isMongo()) {
      const entry = new Activity({
        userId,
        name,
        type,
        duration,
        completed,
        completedAt: new Date()
      });
      return await entry.save();
    }
    const db = getLocalDB();
    const newEntry = {
      _id: genId(),
      userId,
      name,
      type,
      duration,
      completed,
      completedAt: new Date().toISOString()
    };
    db.activities.push(newEntry);
    saveLocalDB(db);
    return newEntry;
  }
};

