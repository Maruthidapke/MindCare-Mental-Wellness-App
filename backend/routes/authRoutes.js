import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindcare_jwt_super_secret_key_eng24cs0127_dsu';

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await store.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      bio: 'MindCare Member exploring emotional balance.',
      studentDetails: {
        name: 'Maruthi Dapke',
        usn: 'ENG24CS0127',
        institution: 'Dayananda Sagar University',
        projectCase: 'Case 59 – Mental Wellness App'
      },
      preferences: {
        dailyReminder: true,
        soundEnabled: true,
        privacyMode: false
      }
    });

    const token = generateToken(user._id || user.id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to MindCare.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        preferences: user.preferences,
        studentDetails: user.studentDetails
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id || user.id);

    return res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        preferences: user.preferences,
        studentDetails: user.studentDetails
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Demo login for quick university viva presentation
router.post('/demo-login', async (req, res) => {
  try {
    const demoEmail = 'maruthi.demo@mindcare.edu';
    let demoUser = await store.findUserByEmail(demoEmail);

    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('mindcare2026', salt);
      demoUser = await store.createUser({
        name: 'Maruthi Dapke (Student Demo)',
        email: demoEmail,
        password: hashedPassword,
        bio: 'Computer Science & Engineering student at Dayananda Sagar University focusing on AI for mental health.',
        studentDetails: {
          name: 'Maruthi Dapke',
          usn: 'ENG24CS0127',
          institution: 'Dayananda Sagar University',
          projectCase: 'Case 59 – Mental Wellness App'
        },
        preferences: {
          dailyReminder: true,
          soundEnabled: true,
          privacyMode: false
        }
      });

      const demoUserId = demoUser._id || demoUser.id;
      // Pre-seed some realistic mood and journal entries for demo showcase!
      const sampleMoods = [
        { mood: 'Happy', notes: 'Finished the SDLC Prototype module presentation with the team.', score: 5, tags: ['Academics', 'Social'], daysAgo: 0 },
        { mood: 'Very Happy', notes: 'Great workout and productive coding session on the wellness app.', score: 6, tags: ['Health', 'Productivity'], daysAgo: 1 },
        { mood: 'Neutral', notes: 'Quiet mid-week study session in the library.', score: 4, tags: ['Study'], daysAgo: 2 },
        { mood: 'Stressed', notes: 'Exam preparation and upcoming project deadlines.', score: 2, tags: ['Academics', 'Sleep'], daysAgo: 3 },
        { mood: 'Happy', notes: 'Relaxing weekend with friends and family.', score: 5, tags: ['Family', 'Social'], daysAgo: 4 },
        { mood: 'Very Happy', notes: 'Completed the guided box breathing exercise, feeling serene.', score: 6, tags: ['Mindfulness'], daysAgo: 5 },
        { mood: 'Neutral', notes: 'Starting the week with a positive mindset.', score: 4, tags: ['General'], daysAgo: 6 }
      ];

      for (const m of sampleMoods) {
        const date = new Date();
        date.setDate(date.getDate() - m.daysAgo);
        await store.createMood(demoUserId, {
          mood: m.mood,
          notes: m.notes,
          score: m.score,
          tags: m.tags,
          timestamp: date
        });
      }

      // Pre-seed sample journals
      await store.createJournal(demoUserId, {
        title: 'Reflections on Mindful Living and Balance',
        content: 'Today was a reminder that small moments of calm during a busy university schedule make all the difference. Taking 5 minutes for box breathing helped lower stress before my lab review.',
        moodTag: 'Happy',
        tags: ['Mindfulness', 'Academics']
      });

      await store.createJournal(demoUserId, {
        title: 'Setting Healthy Boundaries for Technology',
        content: 'Noticed how constant screen notifications affect my sleep quality. Decided to shut down devices an hour before bed and do light reading instead.',
        moodTag: 'Neutral',
        tags: ['Sleep', 'Habits']
      });

      // Pre-seed sample activity
      await store.createActivity(demoUserId, {
        name: '4-7-8 Relaxing Breath',
        type: 'breathing',
        duration: 240,
        completed: true
      });
      await store.createActivity(demoUserId, {
        name: '5-4-3-2-1 Sensory Grounding',
        type: 'grounding',
        duration: 300,
        completed: true
      });
    }

    const token = generateToken(demoUser._id || demoUser.id);
    return res.json({
      success: true,
      message: 'Demo session authenticated successfully!',
      token,
      user: {
        id: demoUser._id || demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        bio: demoUser.bio,
        preferences: demoUser.preferences,
        studentDetails: demoUser.studentDetails
      }
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize demo login.' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await store.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, preferences } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    const updatedUser = await store.updateUser(req.user._id, updateData);
    return res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// Change Password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    // Need raw user with password
    const user = await (async () => {
      if (isMongo()) {
        const User = (await import('../models/User.js')).default;
        return await User.findById(req.user._id);
      }
      const { getLocalDB } = await import('../config/db.js');
      return getLocalDB().users.find(u => (u._id || u.id) === req.user._id);
    })();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await store.updateUser(req.user._id, { password: hashedPassword });
    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

export default router;

