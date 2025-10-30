const server = process.env.SERVER;

const ready = (id) => 
	fetch(`${server}/service/ready`, {
    	method: "PUT",
    	body: JSON.stringify({id: id}) ,
    	credentials: "include", 
    	headers: {
    		"Content-Type": 'application/json'
    	}
 	});

const not_ready = (id, reason) => 
	fetch(`${server}/service/not-ready` , {
    	method: "PUT",
    	body: JSON.stringify({id: id, reason: reason}) ,
    	credentials: "include", 
    	headers: {
    		"Content-Type": 'application/json'
    	}
    
 	});

export const setAsReady = async ( id ) => {
	try {
	    const response = await ready(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to read report");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 

}

export const setAsNotReady = async ( id, reason ) => {
	try {
	    const response = await not_ready(id, reason);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to read report");
	    }
	    return data;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 

}

