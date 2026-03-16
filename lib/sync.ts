import { getUnsyncedPopList, markAsSynced } from './db'
import { getUnsyncedStops, markStopAsSynced } from "./stop_db.ts" 
import { getUnsyncedInvoices, markInvoiceAsSynced } from "./invoice_db.ts" 

import { completeStop } from "../actions/stop.js" 
import {updateStatus, requestQuickbooksID} from "../actions/invoice"


export async function syncItems() {
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedPopList()

  if (unsyncedItems.length === 0) {
    return
  }

  for (const item of unsyncedItems) {
    try {
    	console.log("sending this to server: ", item)
      await markAsSynced(item.id)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}

export async function syncStops(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedStops()
  if (unsyncedItems.length === 0) {
    return
  }
  console.log(`Syncing ${unsyncedItems.length} items... }`)
  for (const item of unsyncedItems) {
    try {
      console.log("sending this to server: ", item)
      await completeStop(item.stopID)
      await markStopAsSynced(item.stopID)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}


export async function syncInvoices(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedInvoices()
  if (unsyncedItems.length === 0) {
    return
  }
  console.log(`Syncing ${unsyncedItems.length} items... }`)
  for (const item of unsyncedItems) {
    try {
      console.log("sending this to server: ", item)
      await updateStatus(item.id, item.status)
      await markInvoiceAsSynced(item.id)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}
export async function syncLineItems(){}
export async function syncServices(){}



if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online! Syncing...')
    syncItems()
    syncStops(); 
    syncInvoices(); 
    syncLineItems();
    syncServices(); 
  })
}