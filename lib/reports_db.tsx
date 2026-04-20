import { getDB }  from "./db.tsx"

export async function getReport(id) {
	try{
		const db = await getDB()
  		let item = await db.get('reports', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function updateReport(updates){
	const db = await getDB()
	const myitem = await db.get('reports', updates.reportID )
	if (!myitem) return
	const updated = { ...updates, synced: false }
	await db.put('reports', updated)
  return; 
}	


export async function createItem(item, reportID) {
	try{
		const db = await getDB()
		item.reportID  = Number( reportID) ; 
		item.synced = true ; 
  	return await db.put('reports', item)	
	}catch(err){
		console.log(err)
	}
}

/*read documentation to clean list */
export async function deleteAllReports(){
  return new Promise( async(resolve, reject) =>{
    try{
      const db = await getDB()
      const list = await db.getAll('reports')  
      list.map( async(item) =>{
        await db.delete('reports', item.id )
        
      })
      resolve() 

    }catch(err){
      console.log("This is the error: ", err)
    }
    
  })
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