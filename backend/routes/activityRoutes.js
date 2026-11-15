import express from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get user activity history
router.get('/', async (req, res) => {
  try {
    const activities = await store.getUserActivities(req.user._id);
    return res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    console.error('Fetch Activities Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve activity history.' });
  }
});

// Record a completed activity
router.post('/complete', async (req, res) => {
  try {
    const { name, type, duration } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Activity name and type are required.' });
    }

    const activity = await store.createActivity(req.user._id, {
      name,
      type,
      duration: Number(duration) || 180,
      completed: true
    });

    return res.status(201).json({
      success: true,
      message: 'Great job completing your mindfulness activity!',
      activity
    });
  } catch (error) {
    console.error('Record Activity Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record activity completion.' });
  }
});

// Activity statistics
router.get('/stats', async (req, res) => {
  try {
    const activities = await store.getUserActivities(req.user._id, 100);

    const totalCompleted = activities.length;
    const totalMinutes = Math.round(activities.reduce((acc, a) => acc + (a.duration || 0), 0) / 60);

    const byType = {
      breathing: 0,
      meditation: 0,
      relaxation: 0,
      mindfulness: 0
    };

    activities.forEach(a => {
      if (byType[a.type] !== undefined) {
        byType[a.type] += 1;
      } else {
        byType.mindfulness += 1;
      }
    });

    return res.json({
      success: true,
      totalCompleted,
      totalMinutes,
      byType: Object.entries(byType).map(([type, count]) => ({ type, count }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to calculate activity stats.' });
  }
});

export default router;

