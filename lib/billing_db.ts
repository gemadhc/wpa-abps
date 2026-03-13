import { getDB }  from "./db.ts"



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
		console.log("This is the item to be added: ", item)
  		return db.put('billing_details', item)
	}catch(err){
		console.log(err)
	}
}

