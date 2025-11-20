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

// ---- API endpoints ---- //
const readReportFetch = (id) => fetchWithJWT(`${office}/report?` + new URLSearchParams({ id }));

const updateFetch = (obj) =>
  fetchWithJWT(`${server}/report`, {
    method: 'PUT',
    body: JSON.stringify({ obj }),
  });

const approvedFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/approved`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const assemblyFetch = (obj, id) =>
  fetchWithJWT(`${server}/assembly`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const finalDCFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/finalDC`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const finalRPFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/finalRP`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const finalSystemFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/finalSystem`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const finalXVBFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/finalXVB`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const agFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/ag`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const initialDCFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/initialDC`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const initialRPFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/initialRP`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const initialXVBFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/initialXVB`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const partsFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/parts`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const remarksFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/remarks`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const systemFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/system`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const removedFetch = (obj, id) =>
  fetchWithJWT(`${server}/report/removed`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const statusFetch = (id, newStatus) =>
  fetchWithJWT(`${server}/report/removed`, {
    method: 'PUT',
    body: JSON.stringify({ id, newStatus }),
  });

// ---- Exported async functions ---- //
export const requestReport = async (id) => {
  try {
    const res = await readReportFetch(id);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to read report');
    return data.Report?.length ? data.Report[0] : {};
  } catch (err) {
    console.error('requestReport error:', err);
    throw err;
  }
};

export const updateReport = async (obj) => {
  try {
    const res = await updateFetch(obj);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update report');
    return data;
  } catch (err) {
    console.error('updateReport error:', err);
    throw err;
  }
};

// Helper to generate all PUT updaters
const createUpdater = (fetchFn) => async (obj, id) => {
  try {
    const res = await fetchFn(obj, id);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update report');
    return data;
  } catch (err) {
    console.error('update error:', err);
    throw err;
  }
};

export const updateApproved = createUpdater(approvedFetch);
export const updateAssembly = createUpdater(assemblyFetch);
export const updateFinalDC = createUpdater(finalDCFetch);
export const updateFinalRP = createUpdater(finalRPFetch);
export const updateFinalSystem = createUpdater(finalSystemFetch);
export const updateFinalXVB = createUpdater(finalXVBFetch);
export const updateAG = createUpdater(agFetch);
export const updateInitialDC = createUpdater(initialDCFetch);
export const updateInitialRP = createUpdater(initialRPFetch);
export const updateInitialXVB = createUpdater(initialXVBFetch);
export const updateParts = createUpdater(partsFetch);
export const updateRemarks = createUpdater(remarksFetch);
export const updateSystem = createUpdater(systemFetch);
export const updateRemoved = createUpdater(removedFetch);
export const updateStatus = createUpdater(statusFetch);
