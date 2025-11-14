import { getToken as getAuthToken} from './session.js'; // helper from previous step
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

const request = (date) =>
  fetchWithJWT(`${server}/dispatch?` + new URLSearchParams({ date }));

const bins = (date) =>
  fetchWithJWT(`${server}/dispatch/bins?` + new URLSearchParams({ date }));

export const requestDispatch = async (date) => {
  try {
    const response = await request(date);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dispatch");
    }
    return data.list;
  } catch (err) {
    console.error("requestDispatch error:", err);
    throw err;
  } 
}

export const requestBins = async (date) => {
  try {
    const response = await bins(date);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch bins");
    }
    return data.list;
  } catch (err) {
    console.error("requestBins error:", err);
    throw err;
  } 
}
