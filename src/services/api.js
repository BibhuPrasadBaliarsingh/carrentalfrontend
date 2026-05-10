import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('speedtoyz_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || ''
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/me')
      localStorage.removeItem('speedtoyz_token')
      localStorage.removeItem('speedtoyz_user')
      if (!isAuthEndpoint) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// ── Cars ──────────────────────────────────────────────────────────────────────
export const carsAPI = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/cars/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/cars/${id}`),
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  myBookings: () => api.get('/bookings/my'),
  getAll: (params) => api.get('/bookings', { params }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  ban: (id) => api.put(`/users/${id}/ban`),
  delete: (id) => api.delete(`/users/${id}`),
}

export default api
