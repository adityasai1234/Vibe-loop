// API base URL configuration
// In development, use relative URLs (empty string) - Vite proxy will handle it
// In production, use the provided VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || ''); 