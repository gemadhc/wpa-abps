const request = (obj) => 
	fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
    	method: "POST",
    	body: JSON.stringify(obj),    	
    	headers:{
    		'Content-Type': 'application/json', 
    		'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
    		'X-Goog-FieldMask': 'routes.optimizedIntermediateWaypointIndex,routes.legs'
    	} 
  	});

export const requestRoute =  (bd) =>{
	return new Promise( async (resolve, reject) =>{
		let response = await request(bd); 
		let data = await response.json() 
		const route = data.routes?.[0];
    	const waypointOrder = route?.optimizedIntermediateWaypointIndex || [];
    	resolve( waypointOrder);
	})
	
}