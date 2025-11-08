const server = process.env.SERVER;

const requestAddresses = (id) => 
	fetch(`${server}/session/addresses` + new URLSearchParams({ id }), {
    	method: "GET",
    	credentials: "include"
 });


export const requestAddresses = async() =>{
	try{
		let response = await requestAddresses(); 
		let data = await response.json()
		return JSON.parse(data.list)
		
	}catch(err){
		return err; 
	}
}