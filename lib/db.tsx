import { openDB, IDBPDatabase } from 'idb'

export interface Item {
  id: number
  label: string
  action: string
  synced: boolean
}

let dbInstance: IDBPDatabase | null = null

export async function getDB() {
  if (dbInstance) return dbInstance
  dbInstance = await openDB('offline-db', 1, {
    upgrade(db) {
      const todoStore = db.createObjectStore('poplist', { keyPath: 'id' })
      const billingStore = db.createObjectStore('billing_details', { keyPath: 'invoiceID' })
      const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id' })
      const lineItemsStore = db.createObjectStore('lineItems', { keyPath: 'invoiceID' })
      const reportsStore = db.createObjectStore('reports', { keyPath: 'reportID'})
      const servicesStore = db.createObjectStore('services' ,{keyPath: 'stopID'})
      const stoplistStore = db.createObjectStore('stoplist', { keyPath: 'stopID' })
      const assemblyStore = db.createObjectStore('assemblyList', { keyPath: 'assemblyID' })

      todoStore.createIndex('by-synced', 'synced')
      billingStore.createIndex('by-synced', 'synced')
      invoiceStore.createIndex('by-synced', 'synced')
      lineItemsStore.createIndex('by-synced', 'synced')
      stoplistStore.createIndex('by-synced', 'synced')
      servicesStore.createIndex('by-synced', 'synced')
      assemblyStore.createIndex('by-synced', 'synced')
      reportsStore.createIndex('by-synced', 'synced')
    },
  })
  return dbInstance
}


export async function monitorMemory(){
  const quota = await navigator.storage.estimate();
  const usedMB = (quota.usage / 1024 / 1024).toFixed(2);
  const limitMB = (quota.quota / 1024 / 1024).toFixed(2);
  const percent = usedMB / limitMB;
  console.log(`Used: ${usedMB} MB / Total Limit: ${limitMB} MB, ${percent *100}%`); 
}

export async function addPop(label) {
  const db = await getDB()
  const myitem: Item = {
    id: crypto.randomUUID(),
    label,
    synced: false,
  }
  await db.add('poplist', myitem )
  return myitem
}

export async function getPops() {
  const db = await getDB()
  return d.getAll('poplist')
}

export async function deletePop(id, action_to_send){
  const db = await getDB()
  const item = await db.get('poplist', id);
  item.action = action_to_send; 
  item.synced = false;  
  await db.put('poplist', item)
}


export async function getUnsyncedPopList(){
  const db = await getDB()
  const allItems = await db.getAll('poplist')
  return allItems.filter((item) => !item.synced)
}

export async function markAsSynced(id){
  const db = await getDB()
  const item = await db.get('poplist', id)
  if (!item) return
  item.synced = true
  await db.put('poplist', item)
}