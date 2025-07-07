'use client';

import React from 'react';
import Form from '@/components/custom/form';
import { registerPatient } from '@/services/patients.service';
import { formFields } from './form';
import { toast } from 'react-toastify';
import GlobalProvider from '@/app/globalProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PageComponent() {
   const router = useRouter();

   async function onSubmit(formData: FormData) {
      try {
         const response = await registerPatient(formData);

         if (!response.success) {
            toast.info(response.msg);
         } else {
            router.push('/auth/signin');
         }

         return response;
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   return (
      <div className="w-screen h-screen flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Patient Registration"
               description="Please fill in the form below"
               submitButtonCaption="Register"
               fields={formFields}
               actionCallback={onSubmit}
            />

            <div className="w-full flex items-center justify-center gap-2 my-4 text-slate-400">
               <p>Already have an ccount?</p>
               <Link
                  href="/auth/signin"
                  className="text-slate-500 hover:text-slate-700"
               >
                  Sign In
               </Link>
            </div>
         </div>
      </div>
   );
}

export default function Page() {
   return (
      <GlobalProvider>
         <PageComponent />
      </GlobalProvider>
   );
}
