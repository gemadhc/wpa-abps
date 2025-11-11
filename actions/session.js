const server = process.env.SERVER;
const office = process.env.OFFICE;

const request = (id) => 
	fetch(`${server}/session/addresses?` + new URLSearchParams({ id }), {
    	method: "GET",
    	credentials: "include"
 });

const updateDefault  = (newDefault) => 
	fetch(`${server}/session/addresses` , {
    	method: "PUT",
    	credentials: "include", 
    	body:JSON.stringify({ newDefault: newDefault }), 
    	headers:{
    		'Content-Type': "application/json"
    	}
 });

const create  = (obj) => 
	fetch(`${server}/session/addresses` , {
    	method: "POST",
    	credentials: "include", 
    	body:JSON.stringify({ obj: obj }), 
    	headers:{
    		'Content-Type': "application/json"
    	}
 });

const requestLogin = (obj) => (
	fetch(`${office}/session`, {
		method: "POST", 
		body: JSON.stringify(obj), 
		credentials: 'include', 
		headers: {
            "Content-Type" : "application/json"
        }
	}) 
)

const requestLogout  = () =>(
	fetch( `${office}/session`, {
		method: "DELETE", 
		credentials: 'include'
	}) 
)
const requestSessionCheck = () => (

	fetch(`${office}/session`, {
		method: "GET",
		credentials: "include", 
		headers: {
			"Content-Type": "application/json"
		}
	})
)


export const requestAddresses = async() =>{
	try{
		let response = await request(25); 
		let data = await response.json()
		return await data.list
	}catch(err){
		return err; 
	}
}

export const changeDefaultAddress = async(newDefault) =>{
	try{
		let response = await updateDefault(newDefault); 
		let data = await response.json()
		return await data
	}catch(err){
		return err; 
	}
}

export const createAddress = async(addrObj) =>{
	try{
		let response = await create(addrObj); 
		let data = await response.json()
		return await data
	}catch(err){
		return err; 
	}
}

export const checkSession = () => {
	return new Promise(async (resolve, reject) => {
		const response = await requestSessionCheck() ;
		const data = await response.json();
		if (response.ok) {
			if (JSON.parse(data).active) {
				resolve(true)
			} else {
				resolve(false)
			}
		}
	})
}

export const login = (credentials) => {
	return new Promise( async (resolve, reject)=>{
		console.log("Gotta log this one in: ", credentials, server); 
		const response = await requestLogin(credentials)
		const data = await response.json(); 
		if(data.success){
			resolve(data.user); 
		}else{
			console.log("Login failed..."); 
			resolve(false)
		}	
	})
	
}

export const logout = async() => {
	return new Promise( async(resolve, reject) =>{
		const response = await requestLogout() ; 
		const data = await response.json(); 
		localStorage.removeItem('session');
		if(response.ok){
			resolve()
		}else{
			console.log("Logout failed..."); 
		}
	})
}

