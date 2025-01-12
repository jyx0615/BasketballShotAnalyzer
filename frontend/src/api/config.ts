const API_BASE_URL = 'http://127.0.0.1:5000/api/';

export const API_ENDPOINTS = {
  analyze: {
    comparison: `${API_BASE_URL}analyze/comparison`,
    individual: `${API_BASE_URL}analyze/individual`,
  },
  image: {
    release: `${API_BASE_URL}image/release`,
    lowest: `${API_BASE_URL}image/lowest`,
    path: `${API_BASE_URL}image/path`
  },
  video: {
    compare: `${API_BASE_URL}video/compare`,
    path: `${API_BASE_URL}video/path`
  },
  tutorial: `${API_BASE_URL}tutorial`,
} as const;