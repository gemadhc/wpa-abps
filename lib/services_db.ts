import { getDB }  from "./db.ts"

export async function getServices(id) {
	try{
		const db = await getDB()
  		let item = await db.get('services', id)
  		console.log('after retriaval: ', item)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}


export async function updateService(updates){
	const db = await getDB()
	const myitem = await db.get('services', updates.offline_id )
	if (!myitem) return
	const updated = { ...myitem, synced: false }
	await db.put('services', updated)
}	


export async function createItem(list, stopID) {
	try{
		const db = await getDB()
		let obj = {};
		obj.stopID = stopID; 
		obj.list = list; 
  	return db.put('services', obj); 
  		
	}catch(err){
		console.log(err)
	}
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