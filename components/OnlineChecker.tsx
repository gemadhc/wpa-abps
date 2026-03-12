'use client';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react'; // pretty icons

export default function OnlineChecker() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    // Define listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm font-medium shadow-xl ${

        isOnline ? 'bg-green-300 text-green-700' : 'bg-red-100 text-red-700 '
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
      
        </>
      )}
    </div>
  );
}
