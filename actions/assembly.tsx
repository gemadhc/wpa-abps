const server = process.env.SERVER;
const office = process.env.OFFICE;

const readAssembly= (id) => 
	fetch(`${office}/assembly?` + new URLSearchParams({id}), {
    	method: "GET",
    	credentials: "include"
    
 	});
const update = (obj) => 
	fetch(`${server}/assembly`, {
    	method: "PUT",
    	body: JSON.stringify({obj: obj}),
    	credentials: "include", 
    	headers:{
    		'Content-Type': "application/json"
    	}
 	});

export const requestAssembly = async ( id ) => {
	try {
	    const response = await readAssembly(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to read report");
	    }
	    if(data.Assembly.length ){
	    	return data.Assembly[0];
	    }else{
	    	return {}
	    }
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 

}

export const updateAssembly = async ( obj ) => {
	try {
	    const response = await update( obj );
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to read report");
	    }
	   	return data
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 

}