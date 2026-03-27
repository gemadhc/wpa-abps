import { getDB }  from "./db.ts"

export async function getLineItem(id) {
	try{
		const db = await getDB()
  		let item = db.get('lineItems', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function getLineItems(invoiceID) {
	try{
		const db = await getDB()
  		let item = db.get('lineItems', invoiceID)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function addLineItems(items, invoiceID){
	try{
		const db = await getDB()
		let item = {};
		item.list = items
		item.invoiceID = invoiceId; 
		item.synced = false
  	return db.put('lineItems', item)
	}catch(err){
		console.log(err)
	}
}


export async function removeLineItem(item){ 
	try{
		const db = await getDB()
		console.log("This is the item to be added: ", item)
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
		console.log("This is the item to be added: ", item)
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