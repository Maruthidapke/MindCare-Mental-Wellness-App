import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let isConnectedToMongo = false;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial in-memory/file fallback database structure
const defaultData = {
  users: [],
  moods: [],
  journals: [],
  activities: []
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcare';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Quick 3s timeout if mongo is not running
    });
    isConnectedToMongo = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    isConnectedToMongo = false;
    console.log('\x1b[33m⚠ MongoDB is not running locally. Initializing built-in file store fallback (data/db.json)...\x1b[0m');
    console.log('\x1b[32m✔ MindCare Unified Database Engine ready with zero configuration needed.\x1b[0m');
  }
};

export const isMongo = () => isConnectedToMongo;

// Fallback DB Helper methods
export const getLocalDB = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultData;
  }
};

export const saveLocalDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

