// features/actions/employee.js

import { getToken as getAuthToken } from './session.js'; 
const server = process.env.OFFICE;



const fetchWithJWT = (url, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
};

// ---- Requests ----

const newPassword = (newpassword) =>
  fetchWithJWT(`${server}/employee/password`, {
    method: "PUT",
    body: JSON.stringify({ newpassword }),
    credentials: "include",
  });

const isActivated = () =>
  fetchWithJWT(`${server}/employee/isActivated`, {
    method: "GET",
    credentials: "include",
  });

// GET all employees
const requestAll = () =>
  fetchWithJWT(`${server}/employee/list`, {
    method: "GET",
  });

const getCerts = (id) =>
  fetchWithJWT(
    `${server}/employee/certification?${new URLSearchParams({ id })}`,
    {
      method: "GET",
    }
  );

const updateCert = (obj) =>
  fetchWithJWT(`${server}/employee/certification`, {
    method: "PUT",
    body: JSON.stringify(obj),
  });

const createCert = (obj) =>
  fetchWithJWT(`${server}/employee/certification`, {
    method: "POST",
    body: JSON.stringify(obj),
  });

const removeCert = (id) =>
  fetchWithJWT(`${server}/employee/certification`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

// GET single employee
const requestOne = (id) =>
  fetchWithJWT(`${server}/employee?${new URLSearchParams({ id })}`, {
    method: "GET",
  });

// PUT update employee
const updateReq = (id, obj) =>
  fetchWithJWT(`${server}/employee`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ id, obj }),
  });

// DELETE employee
const deleteReq = (id) =>
  fetchWithJWT(`${server}/employee?${new URLSearchParams({ id })}`, {
    method: "DELETE",
    credentials: "include",
  });

// POST create employee
const createNew = (obj) =>
  fetchWithJWT(`${server}/employee`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ obj }),
  });

const deactivate = (id) =>
  fetchWithJWT(`${server}/employee/deactivate`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ id }),
  });

const activate = (id) =>
  fetchWithJWT(`${server}/employee/activate`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ id }),
  });

const reset = (id) =>
  fetchWithJWT(`${server}/employee/reset`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
// ---- Action Functions ----


// Fetch all employees
export const fetchEmployeesAPI = async () => {
  try {
    const response = await requestAll();
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch employees");
    return data;
  } catch (err) {
    throw err;
  }
};

// Fetch by ID
export const fetchEmployeeByIdAPI = async (id) => {
  try {
    const response = await requestOne(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch employee");
    return data;
  } catch (err) {
    throw err;
  }
};

// Update
export const updateEmployeeAPI = async (id, obj) => {
  try {
    const response = await updateReq(id, obj);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update employee");
    return data;
  } catch (err) {
    throw err;
  }
};

// Delete
export const deleteEmployeeAPI = async (id) => {
  try {
    const response = await deleteReq(id);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete employee");
    return data;
  } catch (err) {
    throw err;
  }
};

export const createNewEmployee = async (obj) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await createNew(obj);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data.id) ;
    } catch (err) {
      throw err;
    }
  }) 
}
export const deactivateMe = (id) =>{
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await deactivate(id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}
export const activateMe = (id) =>{
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await activate(id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}
export const resetEmployeePassword = (id)=> {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await reset(id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 

}

export const requestCerts = (id) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await getCerts(id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data.list) ;
    } catch (err) {
      throw err;
    }
  }) 
}

export const updateCertification = (obj) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await updateCert(obj);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}

export const createCertification = (obj) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await createCert(obj);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}

export const removeCertification = (id) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await removeCert(id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}

export const updatePassword = (newpassword) => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await newPassword(newpassword);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}

export const requestIfActivated = () => {
  return new Promise(async( resolve, reject) =>{
    try {
      const response = await isActivated();
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");
      resolve( data) ;
    } catch (err) {
      throw err;
    }
  }) 
}





