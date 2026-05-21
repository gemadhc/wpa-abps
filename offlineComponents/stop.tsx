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

	    <div className = { `flex flex-row gap-10 sticky bottom-0 left-0 right-0 bg-slate-800  
	    shadow-xl rounded-tl-lg rounded-tr-lg mb-5 w-full py-5 px-2`} >
	    	<button 
          		className="w-full flex items-center justify-center  bg-slate-500 text-white hover:bg-gray-600 disabled:bg-gray-400 transition"
	  			onClick = {navigateToList}  
	  		> 
	  			<ArrowLeft className="w-4 h-10"/>
	  		</button>
	  		<button        
	  		   	className="w-full flex items-center justify-center  bg-slate-800 text-white hover:bg-slate-800 disabled:bg-gray-400 transition"
			>			
			</button>
	    </div>
    </div>
  );
}