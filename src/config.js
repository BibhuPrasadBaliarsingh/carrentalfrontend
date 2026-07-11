// Centralized configuration for the frontend
export const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') // Strip trailing /api if it exists to get the base
  : 'http://localhost:5000';

export const API_BASE = `${API_URL}/api`;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL is missing in production! Falling back to localhost, which will break for users.');
}
