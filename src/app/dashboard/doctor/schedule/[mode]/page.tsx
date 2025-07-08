'use client';

import Form, { TFormProps } from '@/components/custom/form';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import {
   createSchedule,
   deleteSchedule,
   getScheduleById,
   updateSchedule,
} from '@/services/schedules.service';
import { getDoctors } from '@/services/doctors.service';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useGlobalContext } from '@/app/globalProvider';

function Page() {
   const router = useRouter();
   const params = useParams();
   const searchParams = useSearchParams();

   const { states } = useGlobalContext();

   async function onSubmit(formData: FormData) {
      try {
         let response;

         switch (params.mode) {
            case 'create':
               response = await createSchedule(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/doctor/schedule');
               }

               return response;
            case 'detail':
               response = await updateSchedule(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/doctor/schedule');
               }

               return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   async function onDelete() {
      try {
         const response = await deleteSchedule(searchParams.get('id') || '');

         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/doctor/schedule');
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [doctors, setDoctors] = useState<any[]>([]);
   async function fetchDoctors() {
      const formData = new FormData();
      formData.append('limit', '100');
      setDoctors((await getDoctors(formData))?.data || []);
      setFormReady(true);
   }

   const [initialValues, setInitialValues] = useState<any>({});
   async function fetchSchedule() {
      const schedule = (await getScheduleById(searchParams.get('id') || ''))
         ?.data;
      setInitialValues({
         ...schedule,
         doctorId: String(schedule?.doctorId),
         dayOfWeek: String(schedule?.dayOfWeek),
      });
   }
   useEffect(() => {
      if (searchParams.get('id')) fetchSchedule();
      else {
         setInitialValues({
            doctorId: String(states?.user?.doctorId),
         });
      }
      fetchDoctors();
   }, [router, states?.user]);

   const [formReady, setFormReady] = useState<boolean>(false);

   const formFields: TFormProps['fields'] = useMemo(
      () =>
         formReady
            ? [
                 {
                    label: 'Dokter',
                    inputProps: {
                       name: 'doctorId',
                       required: true,
                       disabled: true,
                    },
                    isSelect: true,
                    options: doctors.map((doctor) => ({
                       label: doctor.name,
                       value: String(doctor.doctorId),
                    })),
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Hari',
                          inputProps: {
                             name: 'dayOfWeek',
                             required: true,
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                          isSelect: true,
                          options: [
                             {
                                label: 'Senin',
                                value: '0',
                             },
                             {
                                label: 'Selasa',
                                value: '1',
                             },
                             {
                                label: 'Rabu',
                                value: '2',
                             },
                             {
                                label: 'Kamis',
                                value: '3',
                             },
                             {
                                label: 'Jumat',
                                value: '4',
                             },
                             {
                                label: 'Sabtu',
                                value: '5',
                             },
                          ],
                       },
                       {
                          label: 'Waktu Mulai',
                          inputProps: {
                             name: 'startTime',
                             required: true,
                             type: 'time',
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                       },
                       {
                          label: 'Waktu Berakhir',
                          inputProps: {
                             name: 'endTime',
                             required: true,
                             type: 'time',
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                       },
                    ],
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Maksimal Pasien',
                          inputProps: {
                             name: 'maxPatients',
                             required: true,
                             type: 'number',
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                       },
                       {
                          label: 'Berlaku Mulai',
                          inputProps: {
                             name: 'validFrom',
                             required: true,
                             type: 'date',
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                       },
                       {
                          label: 'Berlaku Sampai',
                          inputProps: {
                             name: 'validTo',
                             required: true,
                             type: 'date',
                             disabled:
                                params.mode === 'detail' &&
                                initialValues?.doctorId !==
                                   String(states?.user?.doctorId),
                          },
                       },
                    ],
                 },
              ]
            : [],
      [doctors, initialValues, router, formReady],
   );

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Informasi Jadwal</h2>
         </div>
         {(params.mode !== 'detail' ||
            Object.keys(initialValues)?.length > 0) && (
            <div className="w-full  px-8">
               {formReady && (
                  <Form
                     title="Pendaftaran Jadwal"
                     description="Silahkan mengisi detail jadwal praktik"
                     submitButtonCaption={
                        params.mode === 'detail' ? 'Simpan' : 'Buat'
                     }
                     fields={formFields}
                     actionCallback={onSubmit}
                     initialValues={initialValues}
                     enableSubmitButton={
                        (params.mode === 'detail' &&
                           initialValues?.doctorId ===
                              String(states?.user?.doctorId)) ||
                        params.mode === 'create'
                     }
                  />
               )}
               {params.mode === 'detail' &&
                  initialValues?.doctorId ===
                     String(states?.user?.doctorId) && (
                     <div className="w-full my-4">
                        <Button
                           variant={'destructive'}
                           className=" hover:cursor-pointer"
                           type="button"
                           onClick={onDelete}
                        >
                           Hapus Jadwal
                           <Trash2 />
                        </Button>
                     </div>
                  )}
            </div>
         )}
      </div>
   );
}

export default Page;
