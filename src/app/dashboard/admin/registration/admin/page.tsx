'use client';
import React from 'react';
import Form from '@/components/custom/form';
import { registerNurse } from '@/services/nurses.service';
import { formFields } from './form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

function Page() {
   const router = useRouter();

   async function onSubmit(formData: FormData) {
      try {
         console.log({ formData });

         const response = await registerNurse(formData);
         console.log({ response });
         if (!response.success) {
            toast.info(response.msg);
         } else {
            router.back();
         }

         return response;
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   return (
      <div className="w-full h-full flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Admin Registration"
               description="Please fill in the form below"
               submitButtonCaption="Register"
               fields={formFields}
               actionCallback={onSubmit}
            />
         </div>
      </div>
   );
}

export default Page;
