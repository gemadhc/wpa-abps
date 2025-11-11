'use client';
import { createContext, useContext, useState , useEffect } from "react";
import { useRouter } from "next/navigation";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const router = useRouter()
  useEffect(()=>{
  	if(!session){
  		router.push('/login')
  	}else{
  		router.push('/dispatch')
  	}
  }, [session])


  useEffect(()=>{
  	const storedSession = localStorage.getItem('session');
  	console.log("Stored session: ", storedSession, JSON.parse(storedSession))
  	if(JSON.parse(storedSession)){
  		setSession(JSON.parse(storedSession))
  	}
  }, [])
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);