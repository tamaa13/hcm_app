'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { createContext, useContext } from 'react';
import { getProfile } from '@/services/auth.service';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

const globalContext = createContext<any>({});

export default function GlobalProvider({ children }: PropsWithChildren) {
   const pathname = usePathname();
   const [user, setUser] = useState<any>();

   useEffect(() => {
      async function setProfile() {
         const response = await getProfile();
         if (response) setUser(response.data);
      }

      setProfile();
   }, []);

   useEffect(() => {
      if (user && pathname === '/dashboard')
         redirect(`/dashboard/${user.type}`);
   }, [pathname, user]);

   return (
      <globalContext.Provider
         value={{
            states: { user },
            actions: { setUser },
         }}
      >
         <ToastContainer theme="dark" />
         {children}
      </globalContext.Provider>
   );
}

export const useGlobalContext = () => useContext(globalContext);
