'use client'
import { useEffect, useState } from 'react';
import { Item, addPop, getPops, deletePop} from "../../lib/db"
import { getStops, createStop, updateStop} from "../../lib/stop_db"
import { format } from "date-fns"
import { syncItems }  from "../../lib/sync"
import { requestDispatch, requestBins } from "../../actions/dispatch"
import { syncStops } from "../../lib/sync"
import ListSorted from "./ListSorted"

 
export default function Home(){
	const [list, setList] = useState([])
	const [myDate, setMyDate] = useState(format( new Date(), "yyyy-MM-dd"))

	const loadStops = async () => {
		try{
			const cached = await getStops()
			console.log("cached...", cached)
    		setList(cached)

    		if (!navigator.onLine) {
      			console.log("Offline: using cached stops")
      			return
    		}
			const stopsData = await requestDispatch(myDate)
			const promises = stopsData.map(stop => {
				return createStop(stop)
			})
			await Promise.all(promises)
			const newlist = await getStops()
			setList(newlist)
		}catch(err){
			console.log("error creating offline store", err)
		}
	}

	useEffect(()=>{
		loadStops()
	}, [])


	const updateStatus = async(stop)=>{
		stop.status = "COMPLETED"
		await updateStop(stop)
		await syncStops();
		loadStops()
	}

	const removeFromList = async ()=>{
		let id = list[list.length - 1].id
		console.log("removing: ",id)
		await deletePop(id, 'remove');
		setList( list.filter( it=> it.id != id) )
		syncItems()
	}

	return(
		<div>
			<ListSorted  
				stops = { list }
				reloadList =  { () => loadStops() }
			/>
		</div>
	)	
}