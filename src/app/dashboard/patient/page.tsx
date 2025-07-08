'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
   const router = useRouter();

   useEffect(() => {
      router.replace('/dashboard/patient/appointment');
   }, []);

   return null;
}

export default Page;
