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