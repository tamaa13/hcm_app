'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
   const router = useRouter();
   useEffect(() => {
      router.replace('/dashboard/nurse/patient');
   }, []);

   return <div></div>;
}

export default Page;
