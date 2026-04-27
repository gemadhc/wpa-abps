import { getDB }  from "./db.tsx"

export async function getAssembly(id) {
	try{
		const db = await getDB()
  		let item = await db.get('assemblyList', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function updateAssembly(updates){
  console.log("updates of assembly: ", updates )
	const db = await getDB()
	const myitem = await db.get('assemblyList', updates.assembly_id )
	if (!myitem) return
	const updated = { ...updates, synced: false }
	await db.put('assemblyList', updated)
}	

export async function addAssembly(addressID, stopID){
	try{
		console.log("adding a new assembly: ", stopID, addressID)
		const db = await getDB()
		let item = {}; 
		item.assemblyID  = crypto.randomUUID()
		item.isNew = true; 
		item.stopID = stopID;
		item.addressID = addressID; 
		item.synced = false; 
		console.log(item)
  	return await db.put('assemblyList', item)	

	}catch(err){
		console.log(err)
	}
}


export async function createItem(item, assemblyID ) {
	try{
		const db = await getDB()
		item.assemblyID  = Number( assemblyID )
		item.synced = true; 
  		return await db.put('assemblyList', item)	
	}catch(err){
		console.log(err)
	}
}

/*read documentation to clean list */
export async function deleteAllAssemblies(){
  return new Promise( async(resolve, reject) =>{
    try{
      const db = await getDB()
      const list = await db.getAll('assemblyList')  
      list.map( async(item) =>{
        await db.delete('assemblyList', item?.id || item?.assemblyID)
      })
      resolve() 
    }catch(err){
      console.log("This is the error: ", err)
      resolve()
    }
    
  })
}

export const getUnsyncedAssemblies = async () => {
  const db = await getDB()
  const allItems = await db.getAll('assemblyList')
  return allItems.filter((item) => !item.synced)
}

export const  markAssemblyAsSynced = async(id) => {
  const db = await getDB()
  const item = await db.get('assemblyList', id)
  if (!item) return
  item.synced = true
  await db.put('assemblyList', item) 
} 