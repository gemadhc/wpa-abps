import { getDB }  from "./db.tsx"

export async function getAssembly(id) {
	try{
		const db = await getDB()
  		let item = await db.get('assemblyList', id)
      console.log("This is the assemblyitem!!!!!!: ", item)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function updateAssembly(updates){
	const db = await getDB()
	const myitem = await db.get('assemblyList', updates.assembly_id )
	if (!myitem) return
	const updated = { ...updates, synced: false }
	await db.put('assemblyList', updated)
}	


export async function createItem(item, assemblyID) {
	try{
		const db = await getDB()
		item.assemblyID  = assemblyID
		item.synced = true; 
  		return await db.put('assemblyList', item)	

	}catch(err){
		console.log(err)
	}
}

/*read documentation to clean list */
export async function deleteAllAssemblies(){
  return new Promise( async(resolve, reject) =>{
    const db = await getDB()
    const list = await db.getAll('assemblyList')  
    list.map( async(item) =>{
      await db.delete('assemblyList', item.id)
      resolve() 
    })
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