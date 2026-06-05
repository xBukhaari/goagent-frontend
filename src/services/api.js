import axios from 'axios';


const api = axios.create({
  baseURL: 'https://miniature-funicular-xqqvp4x4qjq2696p-8000.app.github.dev/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

export const getJobs = () => api.get('/jobs');
export const createJob = (data) => api.post('/jobs', data);
export const getJob = (id) => api.get(`/jobs/${id}`);
export const updateJob = (id, data) => api.patch(`/jobs/${id}`, data);

export const submitBid = (jobId, data) => api.post(`/jobs/${jobId}/bids`, data);
export const getJobBids = (jobId) => api.get(`/jobs/${jobId}/bids`);
export const acceptBid = (bidId) => api.patch(`/bids/${bidId}/accept`);

export default api;