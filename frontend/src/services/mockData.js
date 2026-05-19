import axios from 'axios';

// We replaced the old mock data logic with real Axios requests to our Express backend!
// Using 127.0.0.1 instead of localhost for better cross-platform compatibility
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api' 
});

// Add token to requests
API.interceptors.request.use((req) => {
  const userStr = localStorage.getItem('smartLibUser');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      req.headers.Authorization = user.token;
    }
  }
  return req;
});

// Log responses for debugging
API.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.url}]:`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error [${error.config?.url}]:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Book API
export const bookApi = {
  getAll: async () => {
    const { data } = await API.get('/books');
    return data;
  },

  create: async (bookData) => {
    const { data } = await API.post('/books', bookData);
    return data;
  }
};

// User API
export const userApi = {
  getAll: async () => {
    const { data } = await API.get('/users');
    return data;
  },

  create: async (userData) => {
    const { data } = await API.post('/users', userData);
    return data;
  },

  updateRole: async (userId, role) => {
    const { data } = await API.patch(`/users/${userId}/role`, { role });
    return data;
  },

  delete: async (userId) => {
    const { data } = await API.delete(`/users/${userId}`);
    return data;
  }
};

// Transaction API
export const transactionApi = {
  getAll: async () => {
    const { data } = await API.get('/transactions');
    return data;
  },

  borrow: async (userId, bookId, quantity = 1) => {
    const { data } = await API.post('/transactions/borrow', { userId, bookId, quantity });
    return data;
  },

  return: async (transactionId) => {
    const { data } = await API.post(`/transactions/return/${transactionId}`);
    return data;
  },

  payFine: async (transactionId) => {
    const { data } = await API.post(`/transactions/pay/${transactionId}`);
    return data;
  }
};

// Auth API 
export const authApi = {
  login: async (username, password) => {
    const { data } = await API.post('/auth/login', { username, password });
    // The backend returns { message, token, user }
    return { ...data.user, token: data.token };
  },

  signup: async (userData) => {
    const { data } = await API.post('/auth/signup', userData);
    return data;
  },

  resetPassword: async (username, email, newPassword) => {
    const { data } = await API.post('/auth/reset-password', { username, email, newPassword });
    return data;
  }
};

export default {
  bookApi,
  userApi,
  transactionApi,
  authApi
};
