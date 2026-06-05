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
      await db.delete('lineItems',  item.invoiceID )
      
    })
    resolve() 
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

export async function removeLineItem (itemID, invoiceID) { 
	return new Promise( async(resolve, reject) =>{
		try{
			const db = await getDB()
			const myitem = await db.get('lineItems', invoiceID ); 
			console.log("This is the item: ", myitem)
			//find the line item inside the invoice item list
			for(let i = 0; i < myitem.list.length; i++){
				console.log("comparing: ", myitem.list[i].id,  itemID)
				if(myitem.list[i].id == itemID){
					//this is the item to remove
					myitem.list[i].action = "REMOVE"; 
					break; 
				}
			}
			myitem.synced = false; 
			console.log("Is this item updated: ", myitem)
			await db.put('lineItems', myitem)
	  		resolve()
		}catch(err){
			console.log(err)
			resolve(err)
		}
	})
}

export async function removeFromLocal(invoiceID, itemID) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDB();

      const myitem = await db.get('lineItems', invoiceID);

      if (!myitem || !Array.isArray(myitem.list)) {
        resolve();
        return;
      }

      myitem.list = myitem.list.filter(
        (item) => item.id !== itemID
      );

      await db.put('lineItems', myitem);

      resolve();

    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

export async function createLineItem(invoiceID){
	try{
		const db = await getDB()
		const myitem = await db.get('lineItems', invoiceID );

		let obj = {}
		obj.action = "NEW"; 
		obj.amount = 65.0; 
		obj.description = ''; 
		obj.quantity = 1;
		obj.unitPriceDefined = 65.0;
		obj.invoiceID = invoiceID; 
		obj.item = "Backflow Inspection"; 
		obj.qb_id = "221"; 
		obj.sku = 200; 
		obj.taxable = false;
		obj.id = crypto.randomUUID(); 

		myitem.list.push(obj); 
		myitem.synced = false

		console.log("Creating a new assembly: ", myitem)
		await db.put('lineItems', myitem)
  		return 

	}catch(err){
		console.log(err)
	}
}


export async function updateLineItem(invoiceID, updates){
	try{
		const db = await getDB()
		const myitem = await db.get('lineItems', invoiceID );
		myitem.list = myitem.list.map((item) => {
			if (item.id === updates.id) {
		    	return {
		      	...item,
		      	...updates,
		      	action: "EDIT",
		    	};
 			} 
 			return item; 
 		})

		myitem.synced = false; 
		console.log("item to update: ", myitem)
		await db.put('lineItems', myitem)
  		return 
	}catch(err){
		console.log(err)
	}
}

export async function updateLineItemID(invoiceID, updates){
	try{
		const db = await getDB()
		const myitem = await db.get('lineItems', invoiceID );
		myitem.list = myitem.list.map((item) => {
			if (item.id === updates.oldID) {
		    	return {
		      	...item,
		      	...updates,
		      	action: "EDIT",
		    	};
 			} 
 			return item; 
 		})

		myitem.synced = false; 
		console.log("item to update: ", myitem)
		await db.put('lineItems', myitem)
  		return 
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

  console.log("defaulting action to nothing")
  //change the actions to nothing 
  item.list = item.list.map( (item) =>{
  	return {
  		...item, 
  		action: null
  	}
  })
  await db.put('lineItems', item)
  if (!item) return
  item.synced = true
  await db.put('lineItems', item) 
} 






