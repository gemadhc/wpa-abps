import { getDB }  from "./db.tsx"

export async function getBilling(id) {
	try{
		const db = await getDB()
  		let item = db.get('billing_details', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function createItem(item) {
	try{
		const db = await getDB()
		item.synced = true; 
  		return db.put('billing_details', item)
	}catch(err){
		console.log(err)
	}
}

