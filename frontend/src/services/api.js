import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  registerAdmin: (userData) => api.post('/auth/register-admin', userData),
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
  getAllUsers: () => api.get('/users/'),
};

export const taskAPI = {
  getTasks: (params = {}) => api.get('/tasks/', { params }),
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  createTask: (taskData) => api.post('/tasks/', taskData),
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default api;
