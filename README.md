# 🌿 MindCare – AI-Powered Mental Wellness Web Application
### Case 59: University Mini-Project & Prototype Demonstration

**Student Developer:** Maruthi Dapke  
**USN / Roll Number:** ENG24CS0127  
**Institution:** School of Engineering, Dayananda Sagar University (DSU), Bengaluru  
**Academic Target Scenario:** Start-up offering mood tracking, private journaling, and guided breathing exercises to 20,000 users with strict privacy isolation and non-diagnostic ethical guardrails.

---

## 🌟 Executive Summary & Features

MindCare is a modern, responsive, commercial-grade digital mental wellness platform inspired by Headspace, Calm, and modern SaaS healthcare interfaces. It adheres to **Agile Lean** and the **Prototype Process Model** to deliver a safe, evidence-informed emotional self-care sanctuary.

### Core Modules & Capabilities:
1. **Landing Page (`/`)**:
   - Modern soft lavender & pastel palette (`#FAF9FD`), gentle glassmorphism, and responsive hero.
   - Interactive 1-minute Box Breathing widget right on the homepage.
   - Transparent non-diagnostic disclaimer and 24/7 crisis helpline directory.
2. **User Authentication & Session Security (`/login`, `/register`)**:
   - Salted password hashing via `bcryptjs` and session tokens via `jsonwebtoken`.
   - **1-Click Viva Demo Login**: Instant evaluator authentication pre-seeded with Maruthi Dapke's sample moods, journals, and mindfulness sessions.
3. **Personalized Dashboard (`/dashboard`)**:
   - Real-time time-based greeting, emotional streak counter, and current mood status.
   - Interactive one-tap daily mood check-in.
   - 7-day emotional trajectory mini-trend (Recharts).
   - Wellness shortcuts and recent journal reflections snippet.
4. **Interactive Daily Mood Tracker (`/moods`)**:
   - 6 nuanced mood states: *Very Happy, Happy, Neutral, Sad, Stressed, Anxious*.
   - Factor tags (Academics, Work, Sleep, Exercise, Health, Social).
   - Historical mood list with date filtering and entry deletion.
   - Confetti celebration upon positive mood logging.
5. **Private Digital Journal (`/journal`)**:
   - Private personal sanctuary for thoughts and self-expression.
   - Title, rich content, emotional mood tag, and custom tags.
   - Search, filter by mood tag, and full CRUD operations (Create, Read, Update, Delete).
   - Privacy-focused: Strictly isolated to the authenticated user.
6. **MindCare AI Wellness Companion (`/ai-assistant`)**:
   - Empathetic, supportive conversational guide.
   - Suggests mindfulness exercises, breathing techniques, and positive coping tips.
   - **Emergency Crisis Guardrail**: Automated detection of distress/self-harm keywords triggering immediate 24/7 helplines:
     - **Tele-MANAS (India Govt Helpline):** 14416 / 1800-891-4416
     - **Vandrevala Foundation:** +91 9999 666 555
     - **US/Global Lifeline:** 988 / https://findahelpline.com
   - Non-diagnostic guardrail: Never prescribes medications or claims to replace a clinical therapist.
7. **Mindfulness & Guided Breathing Studio (`/mindfulness`)**:
   - Interactive **4-7-8 Breathing**, **Box Breathing (4-4-4-4)**, and **Coherent (5-5)** exercises.
   - Animated visual breathing aura circle with real-time countdown timer and cycle counter.
   - **In-Browser Web Audio API Chimes**: Tibetan acoustic singing bowl chimes on phase changes with zero external dependencies.
   - Guided Meditation Timer (3m, 5m, 10m) with ambient rain, ocean, and forest soundscapes.
   - 5-4-3-2-1 Sensory Grounding interactive checklist.
8. **Progress & Emotional Analytics (`/analytics`)**:
   - 7-day mood trajectory Area Chart.
   - Mood distribution breakdown Donut Chart.
   - Activity participation Bar Chart.
   - Purely self-reflective, non-diagnostic standard.
9. **User Profile & Data Sovereignity (`/profile`)**:
   - User profile management, password updates, reminder preferences.
   - **1-Click Full JSON Data Export**: Complete data ownership for the user.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, JWT, Bcryptjs, Morgan |
| **Audio Engine** | Web Audio API (In-browser pink/brown noise and frequency synthesis) |
| **Database** | MongoDB with Mongoose + Automatic Zero-Config In-Process Fallback Engine (`backend/data/db.json`) |
| **AI Integration** | Google Gemini 1.5 Flash REST API + Empathetic Rule-Based Safety Engine |

---

## 🚀 Quick Start & Local Execution

### Prerequisites:
- Node.js (v18.x or v20.x or v22.x)
- NPM (v9.x or v10.x+)

### 1. Clone or Open the Project
```bash
cd /Users/maruthidapke/.gemini/antigravity/scratch/mindcare-case59
```

### 2. Install Dependencies
```bash
npm run install:all
```
*(Or run `cd backend && npm install` followed by `cd ../frontend && npm install`)*

### 3. Run Backend & Frontend Concurrently
```bash
npm run dev
```

The application will start:
- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API Server:** [http://localhost:5001](http://localhost:5001)

### 4. Running Backend or Frontend Separately
- **Backend only:** `cd backend && npm run dev`
- **Frontend only:** `cd frontend && npm run dev`

---

## ⚙️ Environment Variables Configuration

### `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/mindcare
JWT_SECRET=mindcare_jwt_super_secret_key_eng24cs0127_dsu
GEMINI_API_KEY=your_optional_gemini_api_key_here
NODE_ENV=development
```

> **Note on Database Portability:** If MongoDB is running on your machine, MindCare automatically connects via Mongoose. If MongoDB is not installed or running, the unified database engine activates a zero-configuration persistent local JSON store (`backend/data/db.json`). This ensures the app works out-of-the-box on any computer during college viva demonstrations without requiring database setup!

---

## 🧪 Testing and Verification

- **API Health Check:** `GET http://localhost:5001/api/health`
- **Demo Login:** `POST http://localhost:5001/api/auth/demo-login`
- **AI Chat & Crisis Guardrail:** `POST http://localhost:5001/api/chat`

---

## 🎓 University Academic Attribution
- **Coursework:** Mini-Project Case 59 – Mental Wellness App
- **Student:** Maruthi Dapke
- **USN:** ENG24CS0127
- **Institution:** Dayananda Sagar University (DSU), Bengaluru

