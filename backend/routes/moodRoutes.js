import express from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth to all mood routes
router.use(authenticateToken);

// Get all mood entries for the logged-in user
router.get('/', async (req, res) => {
  try {
    const moods = await store.getUserMoods(req.user._id);
    return res.json({ success: true, count: moods.length, moods });
  } catch (error) {
    console.error('Fetch Moods Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve mood entries.' });
  }
});

// Create new mood entry
router.post('/', async (req, res) => {
  try {
    const { mood, notes, tags, score, timestamp } = req.body;

    const validMoods = ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Stressed', 'Anxious'];
    if (!mood || !validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: `Please select a valid mood from: ${validMoods.join(', ')}`
      });
    }

    const newMood = await store.createMood(req.user._id, {
      mood,
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : [],
      score: Number(score) || undefined,
      timestamp: timestamp || new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Mood check-in saved successfully!',
      mood: newMood
    });
  } catch (error) {
    console.error('Create Mood Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record mood entry.' });
  }
});

// Delete a mood entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await store.deleteMood(req.user._id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Mood entry not found.' });
    }
    return res.json({ success: true, message: 'Mood entry deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete mood entry.' });
  }
});

// Mood Analytics & Summary
router.get('/analytics', async (req, res) => {
  try {
    const moods = await store.getUserMoods(req.user._id, 100);

    // Distribution
    const distribution = {
      'Very Happy': 0,
      'Happy': 0,
      'Neutral': 0,
      'Sad': 0,
      'Stressed': 0,
      'Anxious': 0
    };

    moods.forEach(m => {
      if (distribution[m.mood] !== undefined) {
        distribution[m.mood] += 1;
      }
    });

    // Recent 7 days timeline
    const daysMap = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysMap[key] = { date: key, day: dayName, score: 0, count: 0, mood: null };
    }

    moods.forEach(m => {
      const key = new Date(m.timestamp).toISOString().split('T')[0];
      if (daysMap[key]) {
        daysMap[key].score += m.score || 4;
        daysMap[key].count += 1;
        daysMap[key].mood = m.mood;
      }
    });

    const trend = Object.values(daysMap).map(day => ({
      date: day.date,
      day: day.day,
      averageScore: day.count > 0 ? Number((day.score / day.count).toFixed(1)) : 0,
      checkIns: day.count,
      primaryMood: day.mood || 'None'
    }));

    // Most common mood
    let dominantMood = 'Neutral';
    let maxCount = -1;
    for (const [m, count] of Object.entries(distribution)) {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = m;
      }
    }

    return res.json({
      success: true,
      totalEntries: moods.length,
      distribution: Object.entries(distribution).map(([name, value]) => ({ name, value })),
      trend,
      dominantMood: moods.length > 0 ? dominantMood : 'No check-ins yet'
    });
  } catch (error) {
    console.error('Mood Analytics Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute mood analytics.' });
  }
});

export default router;

