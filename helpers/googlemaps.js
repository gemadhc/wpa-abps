import { requestRoute } from "../actions/googlemap.js";

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    const options = {
      enableHighAccuracy: false, // turn off for faster response            // wait up to 5 seconds
      maximumAge: 0              // don't use cached position
    };
	resolve({
      latitude: 45.4943675930669, longitude: -122.60481262320748
    })

    /*navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: 45.4943675930669, longitude: -122.60481262320748
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        reject(error);
      },
      options
    );*/
  });
}

//Helper to convert stop address into Google Maps waypoint
function convertToWayPoint(address) {
  return {
    address: `${address.street} ${address.city} ${address.state} ${address.zipcode}`,
  };
}

// Create and request a route
const createRoute = async (waypoints, currentLocation, destination) => {
	return new Promise(async(resolve, reject) =>{
	    const body = {
	    origin: {
	    	location: {
	    		latLng: currentLocation
	    	}
	    },
	    destination: {
	    	location: {
	    		latLng: currentLocation
	    	}
	    },
	    intermediates: waypoints,
	    travelMode: "DRIVE",
	    optimizeWaypointOrder: "true"
	  };
	  // Assuming requestRoute sends the API request:
	  const order = await requestRoute(body);
	  resolve(order)
	})
  
};

// Main function to route stops
export const routeStops = async (stoplist) => {
  try {
    const currentLocation = await getCurrentLocation();
    const stopsToRoute = stoplist.slice(0, process.env.MAX_WAYPOINTS || 20);
    const waypoints = stopsToRoute.map((stop) => convertToWayPoint(stop));
    const order = await createRoute(waypoints, currentLocation);

     if (order.length  && order[0] != -1) {
      const orderedStops = order.map((i) => stoplist[i]);
      return orderedStops;
    }
    return stoplist;
  } catch (err) {
    return stoplist; // fallback
  }
};
