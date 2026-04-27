'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'
import WaterLoader from '@/components/WaterLoader'; 
import { ViewTransition } from 'react'
import { ArrowLeft, SaveAll } from 'lucide-react';

export default  function ClientComponent({ stopID, navigateToReport, navigateToList }) {
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
  	<div  style={{ viewTransitionName: `stop-${stopID}` }}>
  		

  		<ViewTransition>

  		{
  			stop ? 
  				<StopBody
			      item={stop}
			      stopID={stopID}
			      navigateToReport={navigateToReport}
			    />
			: 
				<div className = "bg-white min-h-screen min-h-screen"> 
					<h2>Loading Stop...</h2>
					<WaterLoader />
				</div>
  		}


	    </ViewTransition>
	    <div className = "fixed bottom-0 bg-white py-10 w-full min-h-20">
	    	<button 
	  			className = 'text-black hover:underline hover:cursor-pointer px-10 py-1 border rounded-xl ml-5 '
	  			onClick = {navigateToList}  > 
	  			<ArrowLeft />
	  		</button>
	    </div>
    </div>
  );
}