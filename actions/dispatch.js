const server = process.env.SERVER;

const request = (date) => 
	fetch(`${server}/dispatch?` + new URLSearchParams({ date }), {
    	method: "GET",
    	credentials: "include"
    
  	});

const bins = (date) => 
	fetch(`${server}/dispatch/bins?` + new URLSearchParams({ date }), {
    	method: "GET",
    	credentials: "include"
    
  	});

export const requestDispatch = async (date) => {
	try {
	    const response = await request(date);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data.list;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}

export const requestBins= async (date) => {
	try {
	    const response = await bins(date);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return data.list;
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}