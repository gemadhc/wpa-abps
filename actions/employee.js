// features/actions/employee.js
const server = process.env.OFFICE;

// ---- Requests ----

const newPassword = (newpassword) =>
  fetch(`${server}/employee/password`, {
    method: "PUT",
    body: JSON.stringify({ newpassword: newpassword }),
    headers: { 
        "Content-Type": "application/json"
    },
    credentials: 'include'
  });

const isActivated = () =>
  fetch(`${server}/employee/isActivated` , {
    method: "GET",
    headers: { 
        "Content-Type": "application/json", 
        
      },
      credentials: 'include'
  });

// GET all employees
const requestAll = () =>
  fetch(`${server}/employee/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

const getCerts = (id) =>
  fetch(`${server}/employee/certification?` + new URLSearchParams({ id }), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
});

const updateCert = (obj) =>
  fetch(`${server}/employee/certification`, {
    method: "PUT",
    body: JSON.stringify(obj), 
    headers: { "Content-Type": "application/json" },
});

const createCert = (obj) =>
  fetch(`${server}/employee/certification`, {
    method: "POST",
    body: JSON.stringify(obj), 
    headers: { "Content-Type": "application/json" },
});

const removeCert = (id) =>
  fetch(`${server}/employee/certification`, {
    method: "DELETE",
    body: JSON.stringify({id}), 
    headers: { "Content-Type": "application/json" },
});

// GET single employee by ID
const requestOne = (id) =>
  fetch(`${server}/employee?` + new URLSearchParams({ id }), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

// PUT update employee
const updateReq = (id, obj) =>
  fetch(`${server}/employee`, {
    method: "PUT",
    credentials: 'include',
    body: JSON.stringify({ id: id, obj: obj }),
    headers: { "Content-Type": "application/json" },
  });

// DELETE employee
const deleteReq = (id) =>
  fetch(`${server}/employee?` + new URLSearchParams({ id }), {
    method: "DELETE",
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
  });

const createNew = (obj) => 
 fetch(`${server}/employee`, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify({obj}),
    headers: { "Content-Type": "application/json" },

  });

const deactivate = (id) => 
  fetch(`${server}/employee/deactivate`, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify({id: id}),
    headers: { "Content-Type": "application/json" },

});
const activate = (id) => 
  fetch(`${server}/employee/activate`, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify({id: id}),
    headers: { "Content-Type": "application/json" },

});
const reset = (id) => 
  fetch(`${server}/employee/reset`, {
    method: "POST",
    body: JSON.stringify({id: id}),
    headers: { "Content-Type": "application/json" },

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





