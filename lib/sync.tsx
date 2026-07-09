
import { getUnsyncedPopList, markAsSynced } from './db'
import { getUnsyncedStops, markStopAsSynced } from "./stop_db.tsx" 
import { getUnsyncedInvoices, markInvoiceAsSynced } from "./invoice_db.tsx" 
import { getUnsyncedLineItems, markLineItemAsSynced, removeFromLocal, updateLineItemID} from "./lineitem_db.tsx" 
import { getUnsyncedServices, markServiceAsSynced, createItem as createService} from "./services_db.tsx"
import { getUnsyncedReports, markReportAsSynced } from "./reports_db.tsx"
import { getUnsyncedAssemblies, markAssemblyAsSynced } from "./assemblies_db.tsx"

import { completeStop } from "../actions/stop.js" 

import {updateStatus,  updateLineItemStatus,
  requestQuickbooksID, 
  createItem as createLineItem,  
  removeItem as removeLineItem, 
  updateItem as updateLineItem } from "../actions/invoice"

import { updateReport } from "../actions/report"
import { updateAssembly, createAssembly} from "../actions/assembly"

import { setAsReady, setAsNotReady, updateStatus as updateServiceStatus }
 from "../actions/service";

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
  console.log("unsynced items: ", unsyncedItems )
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
  return new Promise( async(resolve, reject) =>{
    if (!navigator.onLine) {
      console.log('Offline - will sync later')
      resolve()
    }
    const unsyncedItems = await getUnsyncedLineItems()
    if (unsyncedItems.length === 0) {
      resolve()
    }

    console.log("these are the unsynced line items: ", unsyncedItems)
    for (const item of unsyncedItems) {
      try {
        //look at the list of items 
        let mylist = item.list; 
        await Promise.all(
          mylist.map(async (lineItem) => {
            if (!lineItem?.action) return;

            if (lineItem.action === "REMOVE") {
              await removeLineItem(lineItem.id);
              await removeFromLocal(lineItem.invoiceID, lineItem.id);
            }

            if (lineItem.action === "NEW") {
              const data = await createLineItem(lineItem.invoiceID);
              const updates = {
                ...data.LineItem[0],
                oldID: lineItem.id,
              };
              await updateLineItemID(lineItem.invoiceID, updates);
            }

            if (lineItem.action === "EDIT") {
              await updateLineItem(lineItem.id, lineItem);
            }
          })
        );

        await markLineItemAsSynced(item.invoiceID);
        resolve()
      } catch (error) {
        console.error('Sync failed:', error)
        resolve(error)
      }
    }
  })
}


export async function syncServices() {
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }

  //console.log("syncing services....")

  const unsyncedItems = await getUnsyncedServices()
  //console.log("unsynced services: ", unsyncedItems)

  if (unsyncedItems.length === 0) return

  for (const item of unsyncedItems) {
    try {
      //console.log("unsynced service: ", item)

      // ✅ WAIT for all inner updates
      await Promise.all(
        item.list.map(async (subItem) => {
         // console.log("updating this service: ", subItem)

          if (subItem.ready) {
            return setAsReady(subItem.serviceID)
          } else {
            return setAsNotReady(subItem.serviceID, subItem.reason)
          }
        })
      )

      await markServiceAsSynced(item.stopID)

    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}


export async function syncReports() {
  if (!navigator.onLine) {
    console.log('Offline - will sync later')
    return
  }

  const unsyncedItems = await getUnsyncedReports()
  if (unsyncedItems.length === 0) return

  for (const item of unsyncedItems) {
    try {
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
  console.log("unsynced assemblies: ", unsyncedItems)
  for (const item of unsyncedItems) {
    try {
      //check if it needs to be created 
      if(item.isNew){
        await createAssembly(item.addressID, item.stopID);
        
      }else{
        await updateAssembly(item)
      }
      await markAssemblyAsSynced(item?.id || item.assemblyID)

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
    syncAssemblies()
  })
}