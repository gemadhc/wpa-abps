import { openDB, IDBPDatabase } from 'idb'
import { getDB }  from "db.ts"

export interface StopOffline {
    stopID: number,
    startTime: string,
    endTime: string,
    accountId: number,
    status: string,
    contact: string,
    phone: string,
    requestor: string,
    comment: string,
    invoiceID: number,
    isPlumbing: boolean,
    tester_name: string,
    addressID: number,
    location_name: string,
    street: string,
    city: string,
    state: string,
    zipcode: string,
    gate_code: string,
    note: string, 
    action: string
  	synced: boolean
}

export async function getStops() {
  const db = await getDB()
  return d.getAll('stoplist')
}

export async function createStop(item) {
  const db = await getDB()
  return d.add('stoplist', item)
}

export async function updateStop(id, updates){
	const db = await getDB()
	const stop = await db.get('stoplist', id)
	if (!stop) return
	const updated = { ...stop, ...updates, synced: false }
	await db.put('stoplist', updated)
}



