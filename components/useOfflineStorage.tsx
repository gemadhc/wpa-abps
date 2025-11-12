import { useEffect, useState } from 'react';
import { addData, getAllData, clearData } from '../helpers/indexedDB';

export function useOfflineStorage() {
  const [offlineItems, setOfflineItems] = useState<any[]>([]);

  useEffect(() => {
    // Load existing offline items on mount
    getAllData().then(setOfflineItems).catch(console.error);
  }, []);

  const storeItem = async (item: any) => {
    await addData(item);
    const updated = await getAllData();
    setOfflineItems(updated);
  };

  const clearAll = async () => {
    await clearData();
    setOfflineItems([]);
  };

  return { offlineItems, storeItem, clearAll };
}