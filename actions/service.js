import { getToken as getAuthToken } from './session.js'; // helper to get JWT
const server = process.env.SERVER;

/**
 * Generic fetch wrapper to include JWT
 */
const fetchWithJWT = (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
};

// ---- API calls ---- //
const readyFetch = (id) =>
  fetchWithJWT(`${server}/service/ready`, {
    method: 'PUT',
    body: JSON.stringify({ id }),
  });

const notReadyFetch = (id, reason) =>
  fetchWithJWT(`${server}/service/not-ready`, {
    method: 'PUT',
    body: JSON.stringify({ id, reason }),
  });

// ---- Exported async functions ---- //
export const setAsReady = async (id) => {
  try {
    const response = await readyFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to set service as ready');
    return data;
  } catch (err) {
    console.error('setAsReady error:', err);
    throw err;
  }
};

export const setAsNotReady = async (id, reason) => {
  try {
    const response = await notReadyFetch(id, reason);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to set service as not ready');
    return data;
  } catch (err) {
    console.error('setAsNotReady error:', err);
    throw err;
  }
};
