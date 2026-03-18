import { getDB }  from "./db.ts"

export async function getReport(id) {
	try{
		const db = await getDB()
  		let item = db.get('reports', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function updateReport(updates){
	const db = await getDB()
	const myitem = await db.get('reports', updates.offline_id )
	if (!myitem) return
	const updated = { ...myitem, synced: false }
	await db.put('reports', updated)
}	


export async function createItem(item) {
	try{
		const db = await getDB()
		item.offline_id  = crypto.randomUUID()
  	return db.put('reports', item)	
	}catch(err){
		console.log(err)
	}
}



export const getUnsyncedReports = async () => {
  const db = await getDB()
  const allItems = await db.getAll('reports')
  return allItems.filter((item) => !item.synced)
}

export const  markReportAsSynced = async(id) => {
  const db = await getDB()
  const item = await db.get('reports', id)
  if (!item) return
  item.synced = true
  await db.put('reports', item) 
} 