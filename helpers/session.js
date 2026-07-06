'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true)
  
  const router = useRouter();
  const pathname = usePathname();

  // Load saved session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed) setSession(parsed);
      } catch (e) {
        console.error('Invalid session in storage');
      }
    }
    setLoading(false);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    if (session) {
      if( !session.token){
        router.push('/login');
      }
      console.log( "This is the session: ", session)
      if( !session?.user?.account_activated ){
        console.log("resetting")
        router.push('/reset')
      }
      // Only redirect to /dispatch if not already there
      if (pathname === '/login'){
        router.push('/');
      } 
    } else {
      // If not logged in, redirect to /login (except when already there)
      if (pathname !== '/login') router.push('/login');
    }

  }, [session, pathname, router, loading]);
  

  // When session changes, update localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
