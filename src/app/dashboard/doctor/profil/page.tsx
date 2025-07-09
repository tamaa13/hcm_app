'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Form from '@/components/custom/form';
import { registerDoctor, updateDoctor } from '@/services/doctors.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useGlobalContext } from '@/app/globalProvider';

function Page() {
   const router = useRouter();
   const { states, actions } = useGlobalContext();

   const [initialValues, setInitialValues] = useState<any>({});
   useEffect(() => {
      if (states?.user) setInitialValues(states?.user);
   }, [states?.user]);

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

   const formFields: any = useMemo(() => {
      if (
         !!initialValues &&
         !!states?.user &&
         Object.keys(initialValues)?.length
      ) {
         return [
            {
               label: 'Name',
               inputProps: {
                  name: 'name',
                  required: true,
                  type: 'text',
               },
            },
            {
               horizontalFieldsContainer: true,
               fields: [
                  {
                     label: 'Email',
                     inputProps: {
                        name: 'email',
                        required: true,
                        type: 'email',
                     },
                  },
                  {
                     label: 'Password',
                     inputProps: {
                        name: 'password',
                        required: true,
                        type: 'password',
                     },
                  },
               ],
            },
            {
               horizontalFieldsContainer: true,
               fields: [
                  {
                     label: 'Phone Number',
                     inputProps: {
                        name: 'phoneNumber',
                        required: true,
                        type: 'tel',
                     },
                  },
                  {
                     label: 'Address',
                     inputProps: {
                        name: 'address',
                        required: true,
                        type: 'text',
                     },
                  },
               ],
            },
            {
               horizontalFieldsContainer: true,
               fields: [
                  {
                     label: 'Profession',
                     inputProps: {
                        name: 'profession',
                        required: true,
                        type: 'text',
                     },
                  },
                  {
                     label: 'ID Card',
                     inputProps: {
                        name: 'idCard',
                        required: true,
                        type: 'text',
                     },
                  },
                  {
                     label: 'Registration Number',
                     inputProps: {
                        name: 'registrationNumber',
                        required: true,
                        type: 'string',
                     },
                  },
               ],
            },

            {
               horizontalFieldsContainer: true,
               fields: [
                  {
                     label: 'Education',
                     inputProps: {
                        name: 'education',
                        required: true,
                        type: 'string',
                     },
                  },
                  {
                     label: 'Specialization',
                     inputProps: {
                        name: 'specialization',
                        required: true,
                        type: 'string',
                     },
                  },
                  {
                     label: 'Experience Years',
                     inputProps: {
                        name: 'experienceYears',
                        required: true,
                        type: 'number',
                     },
                  },
               ],
            },
            {
               horizontalFieldsContainer: true,
               fields: [
                  {
                     label: 'Birth Date',
                     inputProps: {
                        name: 'birthDate',
                        required: true,
                        type: 'date',
                     },
                  },
                  {
                     label: 'Gender',
                     inputProps: {
                        name: 'gender',
                        required: true,
                     },
                     isSelect: true,
                     options: [
                        {
                           label: 'Male',
                           value: 'male',
                        },
                        {
                           label: 'Female',
                           value: 'female',
                        },
                     ],
                  },
               ],
            },
         ];
      } else return [];
   }, [states?.user, initialValues]);

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
