import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Stressed', 'Anxious'],
    required: true
  },
  score: {
    type: Number,
    min: 1,
    max: 6,
    default: 4
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Mood = mongoose.model('Mood', moodSchema);
export default Mood;

