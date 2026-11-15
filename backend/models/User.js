import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: 'MindCare Member prioritizing mental wellness.'
  },
  studentDetails: {
    name: { type: String, default: 'Maruthi Dapke' },
    usn: { type: String, default: 'ENG24CS0127' },
    institution: { type: String, default: 'Dayananda Sagar University' },
    projectCase: { type: String, default: 'Case 59 – Mental Wellness App' }
  },
  preferences: {
    dailyReminder: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
    privacyMode: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;

