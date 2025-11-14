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
const requestFetch = (id) =>
  fetchWithJWT(`${server}/stop?` + new URLSearchParams({ id }));

const updateFetch = (obj) =>
  fetchWithJWT(`${server}/stop`, {
    method: 'PUT',
    body: JSON.stringify(obj),
  });

const servicesFetch = (id) =>
  fetchWithJWT(`${server}/stop/services?` + new URLSearchParams({ id }));

const completeFetch = (id) =>
  fetchWithJWT(`${server}/stop/complete`, {
    method: 'PUT',
    body: JSON.stringify({ stopID: id }),
  });

// ---- Exported async functions ---- //
export const requestStop = async (id) => {
  try {
    const response = await requestFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch stop');
    return data;
  } catch (err) {
    console.error('requestStop error:', err);
    throw err;
  }
};

export const updateStop = async (obj) => {
  try {
    const response = await updateFetch(obj);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update stop');
    return data;
  } catch (err) {
    console.error('updateStop error:', err);
    throw err;
  }
};

export const requestServices = async (id) => {
  try {
    const response = await servicesFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch services');
    return data.list;
  } catch (err) {
    console.error('requestServices error:', err);
    throw err;
  }
};

export const completeStop = async (id) => {
  try {
    const response = await completeFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to complete stop');
    return data;
  } catch (err) {
    console.error('completeStop error:', err);
    throw err;
  }
};
