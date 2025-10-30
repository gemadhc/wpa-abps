const server = process.env.SERVER;
const office = process.env.OFFICE;


const create = (obj) => 
	fetch(`${office}/lineitem`, {
    	method: "POST",
    	body: JSON.stringify({obj}),
    	credentials: "include",
    	headers: {
    		"Content-Type": "application/json"
    	}
 	});


const remove = (id) => 
	fetch(`${office}/lineitem`, {
    	method: "DELETE",
    	body: JSON.stringify({id}),
    	credentials: "include",
    	headers: {
    		"Content-Type": "application/json"
    	}
 	});

const update = (obj) => 
	fetch(`${office}/lineitem`, {
    	method: "PUT",
    	body: JSON.stringify({obj}),
    	credentials: "include",
    	headers: {
    		"Content-Type": "application/json"
    	}
 	});
const read = (id) => 
	fetch(`${office}/lineitem?` + new URLSearchParams({id}), {
    	method: "GET",
    	credentials: "include",
    	headers: {
    		"Content-Type": "application/json"
    	}
 	});


export const voidme = () => {}
export const unvoidme =  () =>{} 
export const newline = () => {}
export const removeline = () => {}
export const updateline = () =>{}