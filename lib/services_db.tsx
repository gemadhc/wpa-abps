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

	const db = await getDB();
	const myitem = await db.get("services", updates.stopID);

	if (!myitem || !Array.isArray(myitem.list)) return;

	let found = false;

	const updatedList = myitem.list.map(item => {
		if (item.testReportID === updates.testReportID) {
			found = true;
			return {
				...item,
				state: "COMPLETED",
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
	console.log("updated service: ", updated)
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
	console.log("updating as ready/notready", stopID, serviceID, reason, isReady)
	const db = await getDB();
	const myitem = await db.get("services", Number(stopID) );
	console.log("myitem: ", myitem)
	if (!myitem || !Array.isArray(myitem.list)) return;
	let found = false;
	const updatedList = myitem.list.map(item => {
		console.log("comparing: ", item, serviceID)
		if (item.serviceID === serviceID) {
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
		return;
	}
	const updated = {
		...myitem,
		list: updatedList,
		synced: false,
	};

	console.log("updated service: ", updated)
	await db.put("services", updated);
	return 
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