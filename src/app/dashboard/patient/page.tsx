import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

function Page() {
   const router = useRouter();

   useEffect(() => {
      router.replace('/dashboard/patient/appointment');
   }, []);

   return null;
}

export default Page;
