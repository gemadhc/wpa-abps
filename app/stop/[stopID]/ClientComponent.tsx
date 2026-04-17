'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'

import { ViewTransition } from 'react'

export default  function ClientComponent({ stopID }) {
	const [stop, setStop] = useState(null)
	
	const getter = async ()=>{
		let stops = await getStops();
  	    let item = stops.find((s) => s.stopID == stopID);
		setStop(item)
	}
	
	useEffect(()=>{
		getter()
	}, [])


  return (
  	<div  style={{ viewTransitionName: `stop-${stopID}` }}>
  		<ViewTransition>
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
	    </ViewTransition>
    </div>
  );
}