import axios from 'axios';

const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const baseURL = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`)
  : '/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartnotes_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('smartnotes_token');
        localStorage.removeItem('smartnotes_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    return data;
  },
  register: async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    return data;
  },
  getMe: async () => {
    const { data } = await API.get('/auth/me');
    return data;
  },
};

export const noteService = {
  getNotes: async (params = {}) => {
    const { data } = await API.get('/notes', { params });
    return data;
  },
  getNoteById: async (id) => {
    const { data } = await API.get(`/notes/${id}`);
    return data;
  },
  createNote: async (noteData) => {
    const { data } = await API.post('/notes', noteData);
    return data;
  },
  updateNote: async (id, noteData) => {
    const { data } = await API.put(`/notes/${id}`, noteData);
    return data;
  },
  deleteNote: async (id) => {
    const { data } = await API.delete(`/notes/${id}`);
    return data;
  },
  restoreNote: async (id) => {
    const { data } = await API.put(`/notes/${id}/restore`);
    return data;
  },
  permanentDeleteNote: async (id) => {
    const { data } = await API.delete(`/notes/${id}/permanent`);
    return data;
  },
  toggleFavorite: async (id) => {
    const { data } = await API.put(`/notes/${id}/favorite`);
    return data;
  },
  getTrashNotes: async () => {
    const { data } = await API.get('/notes/trash/all');
    return data;
  },
  emptyTrash: async () => {
    const { data } = await API.delete('/notes/trash/empty');
    return data;
  },
  searchNotes: async (query) => {
    const { data } = await API.get('/notes/search', { params: { q: query } });
    return data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const { data } = await API.get('/categories');
    return data;
  },
  createCategory: async (categoryData) => {
    const { data } = await API.post('/categories', categoryData);
    return data;
  },
  updateCategory: async (id, categoryData) => {
    const { data } = await API.put(`/categories/${id}`, categoryData);
    return data;
  },
  deleteCategory: async (id) => {
    const { data } = await API.delete(`/categories/${id}`);
    return data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const { data } = await API.get('/dashboard/stats');
    return data;
  },
};

export const userService = {
  updateProfile: async (userData) => {
    const { data } = await API.put('/users/profile', userData);
    return data;
  },
  changePassword: async (passwordData) => {
    const { data } = await API.put('/users/password', passwordData);
    return data;
  },
  deleteAccount: async () => {
    const { data } = await API.delete('/users/account');
    return data;
  },
};

export default API;
