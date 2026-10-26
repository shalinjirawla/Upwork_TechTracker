import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('techpulse_token');
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const api = {
  // Upwork Connection & Status
  getUpworkStatus: async () => {
    const res = await apiClient.get('/api/upwork/status/');
    return res.data;
  },

  connectUpwork: async (payload) => {
    const res = await apiClient.post('/api/upwork/connect/', payload);
    return res.data;
  },

  syncUpworkJobs: async () => {
    const res = await apiClient.post('/api/upwork/sync/');
    return res.data;
  },

  disconnectUpwork: async () => {
    const res = await apiClient.post('/api/upwork/disconnect/');
    return res.data;
  },

  // Upwork Trends
  getUpworkTrends: async (params) => {
    const res = await apiClient.get('/api/upwork/trends/', { params });
    return res.data;
  },

  // Analyzed Upwork Jobs Feed
  getUpworkJobs: async (params) => {
    const res = await apiClient.get('/api/upwork/jobs/', { params });
    return res.data;
  },

  // Real Authentication & Upwork OAuth2 SSO
  getUpworkOAuthUrl: async () => {
    const res = await apiClient.get('/api/auth/upwork/url/');
    return res.data;
  },

  loginWithUpwork: async (payload) => {
    const res = await apiClient.post('/api/auth/upwork/callback/', payload);
    if (res.data.token) {
      localStorage.setItem('techpulse_token', res.data.token);
      localStorage.setItem('techpulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  signUp: async (payload) => {
    const res = await apiClient.post('/api/auth/signup/', payload);
    if (res.data.token) {
      localStorage.setItem('techpulse_token', res.data.token);
      localStorage.setItem('techpulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  login: async (email, password) => {
    const res = await apiClient.post('/api/auth/login/', { email, password });
    if (res.data.token) {
      localStorage.setItem('techpulse_token', res.data.token);
      localStorage.setItem('techpulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/api/auth/me/');
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout/');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('techpulse_token');
      localStorage.removeItem('techpulse_user');
    }
  },
};
