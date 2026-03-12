'use client'
import { useEffect, useState } from 'react';
import { Item, addPop, getPops, deletePop} from "../../lib/db"
import { syncItems }  from "../../lib/sync"
 

export default function Home(){
	const [list, setList] = useState([])

	async function load(){
		const newlist = await getPops(); 
		//load from list from api 
		//for each stop - push to offline DB
		setList(newlist); 
	}

	useEffect(()=>{	
		load(); 
	}, [])


	const addToList = async(label)=>{
		const item = await addPop(label); 
		setList([item, ...list])
		syncItems()
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
			<div className="px-30 py-3 bg-pink-500 text-center ">
				<button 
					onClick = { () => addToList(list.length + 1 ) }
					className = "hover:bg-pink-400  cursor-pointer p-3 border border-white rounded-xl mr-9"> + </button>
				<button 
					disabled= { Boolean(!list.length) }
					onClick = { removeFromList }
					className = "hover:bg-pink-400  cursor-pointer p-3 border border-white rounded-xl disabled:bg-gray-400"> 
						- 
				</button>
			</div>
			<div>
				<ul className="px-30 ">
				{
					list.map((item, ind) =>{
						return(
							<li className = "p-3 rounded border bg-pink-200 text-black text-center mb-2 "> 	
								{ind}
							</li>
						)
					})
				}
				</ul>
			</div>
		</div>
	)	
}