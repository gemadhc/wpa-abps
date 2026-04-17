import { openDB, IDBPDatabase } from 'idb'
import { getDB }  from "./db.tsx"

export interface StopOffline {
    stopID: number
    startTime: string
    endTime: string
    accountId: number
    status: string
    contact: string
    phone: string
    requestor: string
    comment: string
    invoiceID: number
    isPlumbing: boolean
    tester_name: string
    addressID: number
    location_name: string
    street: string
    city: string
    state: string
    zipcode: string
    gate_code: string
    note: string
    action: string
  	synced: boolean
}

export async function getStops() {
  const db = await getDB()
  let list = db.getAll('stoplist')
  return list
}

export async function createStop(item) {
	try{
		const db = await getDB()
    item.synced = true; 
  	return db.put('stoplist', item)
	}catch(err){
		return 
	}
}

export async function updateStop(mystop){
	const db = await getDB()
	const stop = await db.get('stoplist', mystop.stopID )
	if (!stop) return
	const updated = { ...mystop, synced: false, status: 'COMPLETED'}
	await db.put('stoplist', updated)
}

export async function deleteAllStops(){
  return new Promise( async(resolve, reject) =>{
    const db = await getDB()
    const stoplist = await db.getAll('stoplist')  
    stoplist.map( async(item) =>{
      await db.delete('stoplist', item.stopID)
      resolve() 
    })
  })
}

export const getUnsyncedStops = async () => {
  const db = await getDB()
  const allItems = await db.getAll('stoplist')
  return allItems.filter((item) => !item.synced)
}
export const markStopAsSynced = async(id) => {
  const db = await getDB()
  const item = await db.get('stoplist', id)
  if (!item) return
  item.synced = true
  await db.put('stoplist', item) 
} 






