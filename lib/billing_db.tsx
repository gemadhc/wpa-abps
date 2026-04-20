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


export async function deleteAllBilling(){
  return new Promise( async(resolve, reject) =>{
    const db = await getDB()
    const list = await db.getAll('billing_details')  
    list.map( async(item) =>{
      	await db.delete('billing_details', item.invoiceID)
    })
    resolve() 
  })
}

