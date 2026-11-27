// Web version of the app's src/config.js (react-native-config → Vite env vars).
// Set VITE_API_BASE_URL in .env to point at another backend.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://exam-master-backend.onrender.com';
export const IS_PRODUCTION = import.meta.env.PROD;
