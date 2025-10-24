const server = process.env.SERVER;

const request = (id) => 
	fetch(`${server}/invoice?` + new URLSearchParams({ id }), {
    	method: "GET",
    	credentials: "include"
    
 });

const status = (id, newStatus) => 
	fetch(`${server}/invoice`, {
    	method: "PUT",
    	body: JSON.stringify({id: id, newStatus: newStatus}), 
    	credentials: "include"
    
 });
const requestLineItems = (id) => 
	fetch(`${server}/invoice/lineitems?` + new URLSearchParams({id: id}), {
    	method: "GET",
    	credentials: "include"
    
 });
const updateLineItem = (id, obj) =>
	fetch(`${server}/invoice/lineitems`, {
    	method: "PUT",
    	body: JSON.stringify({ id: id, obj: obj }), 
    	credentials: "include"
    
 });
const removeLineItem = (id)  =>
	fetch(`${server}/invoice/lineitems`, {
    	method: "DELETE",
    	body: JSON.stringify({ id: id}), 
    	credentials: "include"
    
 });
const createLineItem = (id) => 
	fetch(`${server}/invoice/lineitems`, {
    	method: "POST",
    	body: JSON.stringify({ id: id}), 
    	credentials: "include"
    
 });
const billing = (id) => 
	fetch(`${server}/invoice/billing?` + new URLSearchParams({id}), {
    	method: "GET",
    	credentials: "include"
    
 });

export const requestBilling = async (id) => {
	try {
	    const response = await billing(id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    if(data.Billing.length){
	    	return data.Billing[0];
	    }else{
	    	return null
	    }
	    
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const requestInvoice = async (obj, id) => {
	try {
	    const response = await request(obj, id);
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    if(data.invoice.length){
	    	return data.invoice[0];
	    }else{
	    	return data
	    }
	    
	  } catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	  } 
}
export const requestItems = async( id) => {
	try {
	    const response = await requestLineItems(id);
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
export const updateItem = async (id, obj) => {
	try {
	    const response = await updateLineItem(id, obj);
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
export const removeItem = async (id) => {
	try {
	    const response = await removeLineItem(id);
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

export const createItem = async (id) => {
	try {
	    const response = await createLineItem(id);
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
export const updateStatus = async (id, newStatus) => {
	try {
	    const response = await status(id, newStatus);
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

