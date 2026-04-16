'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'


export default  function ClientComponent({ stopID }) {
	const [stop, setStop] = useState(null)
	
	const getter = async ()=>{
		let stops = await getStops();
		console.log("These are the stops: ", stops, " for ", stopID)
  	    let item = stops.find((s) => s.stopID == stopID);
  	    console.log("stop item: ", item)
		setStop(item)
	}
	useEffect(()=>{
		console.log("StopID: ", stopID)
		getter()

	}, [])


  return (
  	<div>
  		{
  			stop ? 
  				<StopBody
			      item={stop}
			      stopID={stopID}
			    />
			: 
				<div> 
					Loading...
				</div>
  		}
	    
    </div>
  );
}