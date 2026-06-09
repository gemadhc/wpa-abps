import { getDB }  from "./db.tsx"

export async function getServices(id) {
	try{
		const db = await getDB()
  		let item = await db.get('services', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
}

export async function getAllServices(){
	try{
		const db = await getDB()
  		let items = await db.getAll('services')
  		if(items.length == 0 ){
  			return null
  		}else{
  			return items
  		}
  		
	}catch(err){
		console.log("err", err)
		return err
	}
}

export async function deleteAllServices(){
  return new Promise( async(resolve, reject) =>{
    const db = await getDB()
    const list = await db.getAll('services')  
    list.map( async(item) =>{
      await db.delete('services', item.stopID)
    })
    resolve() 
  })
}


export async function updateService(updates){
	const db = await getDB()
	const myitem = await db.get('services', updates.stopID )
	if (!myitem) return
	const updated = { ...updates, synced: false }
	await db.put('services', updated)
}	

export async function updateServiceAssembly(updates) {
	console.log("updates to make: ", updates);
	//updates.stopID = 62983; 
	const db = await getDB();
	const myitem = await db.get("services", updates.stopID);

	if (!myitem || !Array.isArray(myitem.list)) return;

	let found = false;

	const updatedList = myitem.list.map(item => {
		//console.log("is this the list? ", item.testReportID, updates.reportID, item, updates)
		if (item.testReportID === updates.reportID) {
			found = true;
			return {
				...item,
				state: "Edited",
				location: updates.location,
				serial_number: updates.serial_number,
			};
		}
		return item;
	});

	if (!found) {
		console.warn("No matching reportID found:", updates.reportID);
		return;
	}

	const updated = {
		...myitem,
		list: updatedList,
		synced: false,
	};
	//console.log("updated service: ", updated)
	await db.put("services", updated);
}
export async function createItem(list, stopID) {
	try{
		const db = await getDB()
		let obj = {};
		obj.stopID = stopID; 
		obj.list = list; 
		obj.synced = true; 
  	return db.put('services', obj); 
  		
	}catch(err){
		console.log(err)
	}
}


export async function serviceNotReady( stopID, serviceID, reason, isReady){
	return new Promise( async(resolve, reject) =>{
		try{
			//console.log("updating as ready/notready", stopID, serviceID, reason, isReady)
			const db = await getDB();
			const myitem = await db.get("services", Number(stopID) );
			//console.log("myitem: ", myitem)
			if (!myitem || !Array.isArray(myitem.list)) return;
			let found = false;
			const updatedList = myitem.list.map(item => {
				//console.log("comparing: ", item, serviceID, typeof(item.serviceID), typeof(serviceID) )
				if (item.serviceID === serviceID) {
					//console.log("It was found!")
					found = true;
					return {
						...item,
						reason: reason,
						ready: isReady
					};
				}
				return item;
			});

			if (!found) {
				console.warn("No matching reportID found:", updates.reportID);
				resolve(); 
			}
			const updated = {
				...myitem,
				list: updatedList,
				synced: false,
			};

			//console.log("updated service: ", updated)
			await db.put("services", updated);
			resolve()
		}catch(err){
			console.log("Err: ", err)
			resolve()
		}
	})
	
}


export const getUnsyncedServices = async () => {
  const db = await getDB()
  const allItems = await db.getAll('services')
  return allItems.filter((item) => !item.synced)
}

export const markServiceAsSynced = async(id) => {
  const db = await getDB()
  const item = await db.get('services', id)
  if (!item) return
  item.synced = true
  await db.put('services', item) 
} 