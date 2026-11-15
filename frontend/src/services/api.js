const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('mindcare_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // AUTH
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async changePassword(data) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // MOODS
  async getMoods() {
    const res = await fetch(`${API_BASE}/moods`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async addMood(data) {
    const res = await fetch(`${API_BASE}/moods`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMood(id) {
    const res = await fetch(`${API_BASE}/moods/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  async getMoodAnalytics() {
    const res = await fetch(`${API_BASE}/moods/analytics`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // JOURNALS
  async getJournals() {
    const res = await fetch(`${API_BASE}/journals`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async addJournal(data) {
    const res = await fetch(`${API_BASE}/journals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateJournal(id, data) {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteJournal(id) {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // ACTIVITIES
  async getActivities() {
    const res = await fetch(`${API_BASE}/activities`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async completeActivity(data) {
    const res = await fetch(`${API_BASE}/activities/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getActivityStats() {
    const res = await fetch(`${API_BASE}/activities/stats`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // CHAT (AI ASSISTANT)
  async sendMessage(message, history = []) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, conversationHistory: history })
    });
    return res.json();
  }
};

