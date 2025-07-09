'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Form from '@/components/custom/form';
import {
   deletePatient,
   getPatientById,
   registerPatient,
   updatePatient,
} from '@/services/patients.service';
import { toast } from 'react-toastify';
import GlobalProvider from '@/app/globalProvider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
   Table,
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from '@/components/ui/table';
import { getPatientAppointments } from '@/services/appointments.service';
import Link from 'next/link';

function PageComponent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const params = useParams();
   const submitButtonCaption =
      params.mode === 'create'
         ? 'Create'
         : params.mode === 'detail'
         ? 'Save'
         : '';

   async function onSubmit(formData: FormData) {
      try {
         let response;

         switch (params.mode) {
            case 'create':
               response = await registerPatient(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/patient');
               }

               return response;
            case 'detail':
               response = await updatePatient(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/patient');
               }

               return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   async function onDelete() {
      try {
         const response = await deletePatient(searchParams.get('id') || '');

         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/nurse/patient');
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [initialValues, setInitialValues] = useState<any>();

   const [appointments, setAppointments] = useState<any[]>([]);
   async function fetchAppointments() {
      setAppointments(
         (await getPatientAppointments(searchParams.get('id') || '')).data ||
            [],
      );
   }

   useEffect(() => {
      const patientId = searchParams.get('id');
      async function getUser() {
         const response = await getPatientById(patientId || '');

         setBirthDate(response?.data?.birthDate || '');
         setInitialValues({
            ...response.data,
            age:
               new Date().getFullYear() -
               new Date(response?.data?.birthDate || '').getFullYear(),
         });
      }

      if (patientId) {
         getUser();
         fetchAppointments();
      } else {
         setInitialValues({
            age: 0,
         });
      }
   }, []);

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
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Informasi Pasien</h2>
         </div>
         <div className="w-full  px-8">
            <Form
               title="Patient Registration"
               description="Please fill in the form below"
               submitButtonCaption={submitButtonCaption}
               fields={formFields}
               actionCallback={onSubmit}
               initialValues={initialValues}
            />
            {params.mode === 'detail' && (
               <div className="w-full my-4">
                  <Button
                     variant={'destructive'}
                     className=" hover:cursor-pointer"
                     type="button"
                     onClick={onDelete}
                  >
                     Hapus Pasien
                     <Trash2 />
                  </Button>
               </div>
            )}
         </div>
         {params.mode === 'detail' && (
            <div className="w-full min-h-[640px] overflow-scroll p-8 my-8">
               <div className="my-4 flex items-center justify-between w-full">
                  <h2 className="text-xl font-semibold">List Kunjungan</h2>
                  <Link
                     href={`/dashboard/nurse/appointment/create?patientId=${searchParams.get(
                        'id',
                     )}`}
                  >
                     <Button className="hover:cursor-pointer">
                        Tambah Kunjungan
                     </Button>
                  </Link>
               </div>
               <Table>
                  <TableCaption>List Kunjungan</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="text-center">No</TableHead>
                        <TableHead className="text-center">Tanggal</TableHead>
                        <TableHead className="text-center">Keluhan</TableHead>
                        <TableHead className="text-center">
                           Status Kunjungan
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {appointments?.map((appointment, i) => (
                        <TableRow
                           key={appointment.appointmentId}
                           className="hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/appointment/detail?id=${
                                    appointment?.appointmentId || ''
                                 }`,
                              );
                           }}
                        >
                           <TableCell className="text-center">
                              {i + 1}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment.appointmentDate}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment.complaint}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment.status}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         )}
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
