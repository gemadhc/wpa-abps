import { getDB }  from "./db.tsx"

export async function getLineItem(id) {
	try{
		const db = await getDB()
  		let item = await db.get('lineItems', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function getLineItems(invoiceID) {
	try{
		const db = await getDB()
  		let item = await db.get('lineItems', invoiceID)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function deleteAllLineItems(){
  return new Promise( async(resolve, reject) =>{
    const db = await getDB()
    const list = await db.getAll('lineItems')  
    list.map( async(item) =>{
      await db.delete('reports', item.invoiceID)
      resolve() 
    })
  })
}

export async function addLineItems(items, invoiceID){
	try{
		const db = await getDB()
		let item = {};
		item.list = items
		item.invoiceID = invoiceID; 
		item.synced = true
  	return db.put('lineItems', item)
	}catch(err){
		console.log(err)
	}
}


export async function removeLineItem(item){ 
	try{
		const db = await getDB()
		item.action = 'REMOVE'
		item.synced = false
  		return db.put('lineItems', item)
	}catch(err){
		console.log(err)
	}

}

export async function createLineItem(item){
	try{
		const db = await getDB()
		item.offline_id = crypto.randomUUID()
		item.action = "NEW"
		item.synced = false
  		return db.put('lineItems', item)
	}catch(err){
		console.log(err)
	}
}


export const getUnsyncedLineItems = async () => {
  const db = await getDB()
  const allItems = await db.getAll('lineItems')
  return allItems.filter((item) => !item.synced)
}

export const  markLineItemAsSynced = async(id) => {
  const db = await getDB()
  const item = await db.get('lineItems', id)
  if (!item) return
  item.synced = true
  await db.put('lineItems', item) 
} 