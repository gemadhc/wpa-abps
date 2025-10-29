const server = process.env.SERVER;
const office = process.env.OFFICE;

const readAssembly= (id) => 
	fetch(`${office}/assembly?` + new URLSearchParams({id}), {
    	method: "GET",
    	credentials: "include"
    
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