'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Form from '@/components/custom/form';
import { registerPatient } from '@/services/patients.service';
import { toast } from 'react-toastify';
import GlobalProvider from '@/app/globalProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PageComponent() {
   const router = useRouter();

   const [initialValues, setInitialValues] = useState<any>();
   const [age, setAge] = useState<number>(0);
   const [birthDate, setBirthDate] = useState<string>('');
   useEffect(() => {
      if (birthDate) {
         setAge(new Date().getFullYear() - new Date(birthDate).getFullYear());
         setInitialValues((prev: any) => ({
            ...prev,
            age: new Date().getFullYear() - new Date(birthDate).getFullYear(),
         }));
      }
   }, [birthDate]);

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

   const formFields: any[] = useMemo(
      () => [
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
         // {
         //    horizontalFieldsContainer: true,
         //    fields: [
         //       {
         //          label: 'Profession',
         //          inputProps: {
         //             name: 'profession',
         //             required: true,
         //             type: 'text',
         //          },
         //       },
         //       {
         //          label: 'ID Card',
         //          inputProps: {
         //             name: 'idCard',
         //             required: true,
         //             type: 'text',
         //          },
         //       },
         //    ],
         // },
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
         // {
         //    label: 'Allergies',
         //    inputProps: {
         //       name: 'allergies',
         //       required: true,
         //       type: 'text',
         //    },
         // },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Birth Date',
                  inputProps: {
                     name: 'birthDate',
                     required: true,
                     type: 'date',
                     onBlur: (e: any) => {
                        console.log('AWAWAW');
                        setBirthDate(e.target.value);
                     },
                  },
               },
               {
                  label: 'Usia',
                  inputProps: {
                     name: 'age',
                     required: true,
                     type: 'number',
                     disabled: true,
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
               // {
               //    label: 'Blood Type',
               //    inputProps: {
               //       name: 'bloodType',
               //       required: true,
               //    },
               //    isSelect: true,
               //    options: [
               //       {
               //          label: 'O',
               //          value: 'O',
               //       },
               //       {
               //          label: 'A',
               //          value: 'A',
               //       },
               //       {
               //          label: 'B',
               //          value: 'B',
               //       },
               //       {
               //          label: 'AB',
               //          value: 'AB',
               //       },
               //    ],
               // },
            ],
         },
         // {
         //    horizontalFieldsContainer: true,
         //    fields: [
         //       {
         //          label: 'Height (cm)',
         //          inputProps: {
         //             name: 'heightCm',
         //             required: true,
         //             type: 'number',
         //          },
         //       },
         //       {
         //          label: 'Weight (kg)',
         //          inputProps: {
         //             name: 'weightKg',
         //             required: true,
         //             type: 'number',
         //          },
         //       },
         //    ],
         // },
      ],
      [initialValues, birthDate, age],
   );

   return (
      <div className="w-screen h-screen flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Patient Registration"
               description="Please fill in the form below"
               submitButtonCaption="Register"
               fields={formFields}
               actionCallback={onSubmit}
               initialValues={initialValues}
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
