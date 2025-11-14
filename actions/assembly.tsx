import { getToken as getAuthToken } from './session.js'; // helper to get JWT
const server = process.env.SERVER;
const office = process.env.OFFICE;

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

const readAssembly = (id) =>
  fetchWithJWT(`${office}/assembly?` + new URLSearchParams({ id }));

const update = (obj) =>
  fetchWithJWT(`${server}/assembly`, {
    method: "PUT",
    body: JSON.stringify({ obj }),
  });

const create = (stopID, addressID) =>
  fetchWithJWT(`${server}/assembly`, {
    method: "POST",
    body: JSON.stringify({ stopID, addressID }),
  });

// ---- Exported async functions ---- //

export const requestAssembly = async (id) => {
  try {
    const response = await readAssembly(id);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to read assembly");
    }
    return data.Assembly?.length ? data.Assembly[0] : {};
  } catch (err) {
    console.error("requestAssembly error:", err);
    throw err;
  }
};

export const updateAssembly = async (obj) => {
  try {
    const response = await update(obj);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update assembly");
    }
    return data;
  } catch (err) {
    console.error("updateAssembly error:", err);
    throw err;
  }
};

export const createAssembly = async (addressID, stopID) => {
  try {
    const response = await create(stopID, addressID);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create assembly");
    }
    return data;
  } catch (err) {
    console.error("createAssembly error:", err);
    throw err;
  }
};
