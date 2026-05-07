'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'
import WaterLoader from '@/components/WaterLoader'; 
import { ViewTransition } from 'react'

export default  function ClientComponent({ stopID }) {
	const [stop, setStop] = useState(null)
	const [loaded, setLoaded] = useState(false)
	const getter = async ()=>{
		let stops = await getStops(); 
  	    let item = stops.find((s) => s.stopID == stopID);
  	    if(item){
  	    	
  	    	setStop(item)
  	    }
	}
	
	useEffect(()=>{
		getter()
	}, [])

  return (
  	<div  id = "stop-client" style={{ viewTransitionName: `stop-${stopID}` }}>
  		<ViewTransition>
  		{
  			stop ? 
  				<StopBody
			      item={stop}
			      stopID={stopID}
			    />
			: 
				<div> 
					<h2>Loading...</h2>
					<WaterLoader />
				</div>
  		}

	    </ViewTransition>
    </div>
  );
}