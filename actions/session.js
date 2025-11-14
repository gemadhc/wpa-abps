const server = process.env.SERVER;
const office = process.env.OFFICE;

// Helper to get JWT from localStorage
export const getToken = () => localStorage.getItem('jwtToken');

// Fetch wrappers with JWT
const request = (id) =>
  fetch(`${server}/session/addresses?` + new URLSearchParams({ id }), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

const updateDefault = (newDefault) =>
  fetch(`${server}/session/addresses`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify({ newDefault })
  });

const create = (obj) =>
  fetch(`${server}/session/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify({ obj })
  });

// Login requests from the same endpoint but store JWT
const requestLogin = (obj) =>
  fetch(`${office}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });

// Logout removes JWT from storage
const requestLogout = () =>
  fetch(`${office}/session`, { method: "DELETE" });

const requestSessionCheck = () =>
  fetch(`${office}/session`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

// ---- Exported Actions ---- //

export const requestAddresses = async () => {
  try {
    const response = await request(25);
    const data = await response.json();
    return data.list;
  } catch (err) {
    return err;
  }
};

export const changeDefaultAddress = async (newDefault) => {
  try {
    const response = await updateDefault(newDefault);
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const createAddress = async (addrObj) => {
  try {
    const response = await create(addrObj);
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const checkSession = async () => {
  try {
    const response = await requestSessionCheck();
    const data = await response.json();
    return data.active || false;
  } catch (err) {
    return false;
  }
};

export const login = async (credentials) => {
  try {
    const response = await requestLogin(credentials);
    const data = await response.json();

    if (data.success && data.token) {
      // Store JWT in localStorage
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } else {
      console.log("Login failed...");
      return false;
    }
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
};

export const logout = async () => {
  try {
    await requestLogout();
  } catch (err) {
    console.warn("Logout request failed:", err);
  } finally {
    // Remove JWT and user info from storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  }
};
