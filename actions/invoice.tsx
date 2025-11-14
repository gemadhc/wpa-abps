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

const requestInvoiceFetch = (id) =>
  fetchWithJWT(`${server}/invoice?` + new URLSearchParams({ id }));

const requestBillingFetch = (id) =>
  fetchWithJWT(`${server}/invoice/billing?` + new URLSearchParams({ id }));

const requestLineItemsFetch = (id) =>
  fetchWithJWT(`${server}/invoice/lineitems?` + new URLSearchParams({ id }));

const updateLineItemFetch = (id, obj) =>
  fetchWithJWT(`${office}/lineitems`, {
    method: 'PUT',
    body: JSON.stringify({ id, obj }),
  });

const removeLineItemFetch = (id) =>
  fetchWithJWT(`${office}/lineitems`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });

const createLineItemFetch = (invoiceID) =>
  fetchWithJWT(`${office}/lineitems`, {
    method: 'POST',
    body: JSON.stringify({ invoiceID }),
  });

const updateStatusFetch = (id, newStatus) =>
  fetchWithJWT(`${office}/invoices/status`, {
    method: 'PUT',
    body: JSON.stringify({ id, newStatus }),
  });

// ---- Exported async functions ---- //

export const requestBilling = async (id) => {
  try {
    const response = await requestBillingFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch billing");
    return data.Billing?.length ? data.Billing[0] : null;
  } catch (err) {
    console.error("requestBilling error:", err);
    throw err;
  }
};

export const requestInvoice = async (id) => {
  try {
    const response = await requestInvoiceFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch invoice");
    return data.invoice;
  } catch (err) {
    console.error("requestInvoice error:", err);
    throw err;
  }
};

export const requestItems = async (id) => {
  try {
    const response = await requestLineItemsFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch line items");
    return data.list;
  } catch (err) {
    console.error("requestItems error:", err);
    throw err;
  }
};

export const updateItem = async (id, obj) => {
  try {
    const response = await updateLineItemFetch(id, obj);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update line item");
    return data;
  } catch (err) {
    console.error("updateItem error:", err);
    throw err;
  }
};

export const removeItem = async (id) => {
  try {
    const response = await removeLineItemFetch(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to remove line item");
    return data;
  } catch (err) {
    console.error("removeItem error:", err);
    throw err;
  }
};

export const createItem = async (invoiceID) => {
  try {
    const response = await createLineItemFetch(invoiceID);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create line item");
    return data;
  } catch (err) {
    console.error("createItem error:", err);
    throw err;
  }
};

export const updateStatus = async (id, newStatus) => {
  try {
    const response = await updateStatusFetch(id, newStatus);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update invoice status");
    return data;
  } catch (err) {
    console.error("updateStatus error:", err);
    throw err;
  }
};
