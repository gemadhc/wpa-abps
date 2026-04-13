import { getUnsyncedPopList, markAsSynced } from './db'
import { getUnsyncedStops, markStopAsSynced } from "./stop_db.tsx" 
import { getUnsyncedInvoices, markInvoiceAsSynced } from "./invoice_db.tsx" 
import { getUnsyncedLineItems, markLineItemAsSynced } from "./lineitem_db.tsx" 
import { getUnsyncedServices, markServiceAsSynced} from "./services_db.tsx"
import { getUnsyncedReports, markReportAsSynced } from "./reports_db.tsx"
import { getUnsyncedAssemblies, markAssemblyAsSynced } from "./assemblies_db.tsx"

import { completeStop } from "../actions/stop.js" 
import {updateStatus, requestQuickbooksID} from "../actions/invoice"
import  { updateLineItemStatus } from "../actions/invoice"
import { updateReport } from "../actions/report"
import { updateAssembly} from "../actions/assembly"

export async function syncItems() {
  if (!navigator.onLine) {
    return
  }
  const unsyncedItems = await getUnsyncedPopList()

  if (unsyncedItems.length === 0) {
    return
  }

  for (const item of unsyncedItems) {
    try {
      await markAsSynced(item.id)
    } catch (error) {
    }
  }
}

export async function syncStops(){
  if (!navigator.onLine) {
    return
  }
  const unsyncedItems = await getUnsyncedStops()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      await completeStop(item.stopID)
      await markStopAsSynced(item.stopID)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}


export async function syncInvoices(){
  if (!navigator.onLine) {
    return
  }
  const unsyncedItems = await getUnsyncedInvoices()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      await updateStatus(item.id, item.status)
      await markInvoiceAsSynced(item.id)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}

export async function syncLineItems(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedLineItems()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      await updateLineItemStatus(item)
      await markLineItemAsSynced(item.offline_id)

    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}
export async function syncServices(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedServices()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      console.log("unsynced service: ", item)
      //await updateLineItemStatus(item)
      await markServiceAsSynced(item.id)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

}
export async function syncReports(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedReports()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      console.log("unsynced reports: ", unsyncedItems)
      await updateReport(item)
      await markReportAsSynced(item.reportID)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

}

export async function syncAssemblies(){
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }
  const unsyncedItems = await getUnsyncedAssemblies()
  if (unsyncedItems.length === 0) {
    return
  }
  for (const item of unsyncedItems) {
    try {
      await updateAssembly(item)
      await markAssemblyAsSynced(item.id)

    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

}


if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online! Syncing...')
    syncItems()
    syncStops(); 
    syncInvoices(); 
    syncLineItems();
    syncServices(); 
    syncReports(); 
  })
}