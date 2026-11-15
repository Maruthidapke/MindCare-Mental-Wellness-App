import express from 'express';
import { store } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get all journals for the logged-in user
router.get('/', async (req, res) => {
  try {
    const journals = await store.getUserJournals(req.user._id);
    return res.json({ success: true, count: journals.length, journals });
  } catch (error) {
    console.error('Fetch Journals Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve journal entries.' });
  }
});

// Get single journal by ID
router.get('/:id', async (req, res) => {
  try {
    const journal = await store.getJournalById(req.user._id, req.params.id);
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal entry not found.' });
    }
    return res.json({ success: true, journal });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve journal entry.' });
  }
});

// Create new journal entry
router.post('/', async (req, res) => {
  try {
    const { title, content, moodTag, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an entry title.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide entry content/thoughts.' });
    }

    const journal = await store.createJournal(req.user._id, {
      title: title.trim(),
      content: content.trim(),
      moodTag: moodTag || 'Neutral',
      tags: Array.isArray(tags) ? tags : []
    });

    return res.status(201).json({
      success: true,
      message: 'Journal entry saved successfully!',
      journal
    });
  } catch (error) {
    console.error('Create Journal Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save journal entry.' });
  }
});

// Update journal entry
router.put('/:id', async (req, res) => {
  try {
    const { title, content, moodTag, tags } = req.body;

    const updated = await store.updateJournal(req.user._id, req.params.id, {
      title: title ? title.trim() : undefined,
      content: content ? content.trim() : undefined,
      moodTag,
      tags
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Journal entry not found.' });
    }

    return res.json({
      success: true,
      message: 'Journal entry updated successfully!',
      journal: updated
    });
  } catch (error) {
    console.error('Update Journal Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update journal entry.' });
  }
});

// Delete journal entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await store.deleteJournal(req.user._id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Journal entry not found.' });
    }
    return res.json({ success: true, message: 'Journal entry deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete journal entry.' });
  }
});

export default router;

