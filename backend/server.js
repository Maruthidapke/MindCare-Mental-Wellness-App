import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database (Mongo or local JSON fallback)
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/chat', chatRoutes);

// Health & Project Details endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'MindCare - AI-Powered Mental Wellness App',
    case: 'Case 59 – Mental Wellness App',
    student: 'Maruthi Dapke',
    usn: 'ENG24CS0127',
    institution: 'Dayananda Sagar University, School of Engineering, Bengaluru',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`\n\x1b[35m✨ MindCare Backend Server running on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m🎓 Case 59: Mental Wellness App | Maruthi Dapke (ENG24CS0127)\x1b[0m\n`);
});

