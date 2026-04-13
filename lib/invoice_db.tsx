import { getDB }  from "./db.tsx"

export async function getBilling(id) {
	try{
		const db = await getDB()
  		let item = await db.get('billing_details', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function updateInvoiceStatus(invoice, newstatus) {
	const db = await getDB()
	const myinvoice = await db.get('invoices', invoice )
	if (!invoice) return
	const updated = { ...myinvoice, synced: false, status: newstatus }
	await db.put('invoices', updated)
}


export async function getInvoice(id) {
	try{
		const db = await getDB()
  		let item = await db.get('invoices', id)
  		return item
	}catch(err){
		console.log("err", err)
		return err
	}
 
}

export async function createItem(item) {
	try{
		const db = await getDB()
		item.invoiceID = item.id
		item.synced = true; 
  		return db.put('invoices', item)
	}catch(err){
		console.log(err)
	}
}

export const getUnsyncedInvoices = async () => {
  const db = await getDB()
  const allItems = await db.getAll('invoices')
  return allItems.filter((item) => !item.synced)
}
export const markInvoiceAsSynced = async( id ) => {
  const db = await getDB()
  const item = await db.get('invoices', id)
  if (!item) return
  item.synced = true
  await db.put('invoices', item) 
} 

