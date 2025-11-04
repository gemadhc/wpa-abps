


function getCurrentLocation(){
	let pos = navigator.geolocation.getCurrentPosition( (position) =>{
		return({
			lat: position.coords.latitude, 
            lng: position.coords.longitude
		})
	}) 
	return pos; 
	
}
function convertToWayPoint(address){
	return {location: `${address.street} ${address.city} ${address.state} ${address.zipcode}`}
}


export const routeStops = (stoplist) =>{
	return new Promise( asycn( resolve, reject) =>{

	})
}