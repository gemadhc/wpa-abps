const server = process.env.SERVER;

const request = (id) => 
	fetch(`${server}/stop?` + new URLSearchParams({ id }), {
    	method: "GET",
    	credentials: "include"
    
  	});
 const update = (obj) => 
 	fetch(`${server}/stop`, {
    	method: "PUT",
    	body: JSON.stringify( obj ),
    	credentials: "include"
    
  	});
const services = (id) =>
	fetch(`${server}/stop/services?` + new URLSearchParams({id}), {
    	method: "GET",
    	credentials: "include"
    
  	});
const complete = (id) =>
	fetch(`${server}/stop/complete`, {
    	method: "PUT",
    	body: JSON.stringify({stopID: id}), 
    	credentials: "include", 
    	headers: {
    		"Content-Type": "application/json"
    	} 
  	});
export const requestStop = async (id) =>{
	try {
	    const response = await request(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to fetch stop");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  }
}
export const updateStop = async (obj) =>{
	try {
	    const response = await update(obj);
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

export const requestServices = async (id) =>{
	try {
	    const response = await services(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to fetch services");
	    }
	    return data.list;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}

export const completeStop = async( id) => {
	try {
	    const response = await complete(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to fetch services");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}

