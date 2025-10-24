const server = process.env.SERVER;

const approved = (obj, id)=> 
	fetch(`${server}/report/approved`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const assembly = (obj, id) =>
	fetch(`${server}/report/assembly`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const finalDC = (obj, id) => 
	fetch(`${server}/report/finalDC`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const finalRP = (obj, id) =>
	fetch(`${server}/report/finalRP`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const finalSystem = (obj, id) =>
	fetch(`${server}/report/finalSystem`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const finalXVB = (obj, id) =>
	fetch(`${server}/report/finalXVB`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const ag = (obj, id) =>
	fetch(`${server}/report/ag`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const initialDC = (obj, id) => 
	fetch(`${server}/report/initialDC`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const initialRP = (obj, id) =>
	fetch(`${server}/report/initialRP`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const initialXVB = (obj, id) =>
	fetch(`${server}/report/initialXVB`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const parts = (obj, id) =>
	fetch(`${server}/report/parts`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const remarks = (obj, id) =>
	fetch(`${server}/report/remarks`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const system = (obj, id) =>
	fetch(`${server}/report/system`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const removed = (obj, id) => 
	fetch(`${server}/report/removed`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj}),
    	credentials: "include"
    
 	});
const status = (id, newStatus) => 
	fetch(`${server}/report/removed`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, newStatus: newStatus}),
    	credentials: "include"
    
 	});

export const updateApproved = (obj, id) => {
	try {
	    const response = await approved(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateAssembly = (obj, id) => {
	try {
	    const response = await assembly(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateFinalDC = (obj, id) => {
	try {
	    const response = await finalDC(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateFinalRP = (obj, id) => {
	try {
	    const response = await finalRP(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateFinalSystem = (obj, id) => {
	try {
	    const response = await finalSystem(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateFinalXVB = (obj, id) => {
	try {
	    const response = await finalXVB(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateAG = (obj, id) => {
	try {
	    const response = await ag(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateInitialDC = (obj, id) => {
	try {
	    const response = await initialDC(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateInitialRP = (obj, id) =>{
	try {
	    const response = await initialRP(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateInitialXVB = (obj, id) => {
	try {
	    const response = await initiaXVB(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateParts = (obj, id)=>{
	try {
	    const response = await parts(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateRemarks = (obj, id) =>{
	try {
	    const response = await remarks(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateSystem = (obj, id) => {
	try {
	    const response = await system(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const updateRemoved = (obj, id) =>{
	try {
	    const response = await removed(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}


export const updateStatus= (id, newstatus) =>{
	try {
	    const response = await status(id, newstatus);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
