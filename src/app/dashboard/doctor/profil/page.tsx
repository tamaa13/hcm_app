'use client';
import React, { useEffect, useState } from 'react';
import Form from '@/components/custom/form';
import { registerDoctor, updateDoctor } from '@/services/doctors.service';
import { formFields } from './form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useGlobalContext } from '@/app/globalProvider';

function Page() {
   const router = useRouter();
   const { states, actions } = useGlobalContext();

   const [initialValues, setInitialValues] = useState<any>({});
   useEffect(() => {
      setInitialValues(states?.user);
   }, []);

   async function onSubmit(formData: FormData) {
      try {
         const response = await updateDoctor(formData);

         if (!response.success) {
            toast.info(response.msg);
         } else {
            actions?.setUser(response?.data?.[0]);
            router.push('/dashboard/doctor');
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
               title="Profil Dokter"
               description="Informasi lengkap profil dokter"
               submitButtonCaption="Simpan"
               fields={formFields}
               actionCallback={onSubmit}
               initialValues={initialValues}
            />
         </div>
      </div>
   );
}

export default Page;
