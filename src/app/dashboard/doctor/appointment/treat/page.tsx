'use client';

import Form, { TFormProps } from '@/components/custom/form';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import {
   createAppointments,
   deleteAppointment,
   getAppointment,
   updateAppointments,
} from '@/services/appointments.service';
import { createMedicalRecord } from '@/services/medicalRecords.service';

function Page() {
   const router = useRouter();
   const params = useParams();
   const searchParams = useSearchParams();

   const [initialPatientValues, setInitialPatientValues] = useState<any>({});
   const [initialtreatmentValues, setInitialtreatmentValues] = useState<any>({
      appointmentId: searchParams.get('id'),
   });

   async function onSubmit(formData: FormData) {
      try {
         const response = await createMedicalRecord(formData);
         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/doctor/appointment');
         }

         return response;
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   async function onDelete() {
      try {
         const response = await deleteAppointment(searchParams.get('id') || '');

         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/doctor/appointment');
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [formReady, setFormReady] = useState(false);

   useEffect(() => {
      async function init() {
         const appointmentId = searchParams.get('id');

         if (appointmentId) {
            const response = await getAppointment(appointmentId);
            const doctorId = String(response.data?.doctorId);
            setInitialPatientValues({
               ...response.data,
               patientId: String(response.data?.patientId),
               doctorId,
               scheduleId: String(response?.data?.scheduleId),
               patientName: response?.data?.patient?.name,
               patientEmail: response?.data?.patient?.email,
               patientPhoneNumber: response?.data?.patient?.phoneNumber,
               patientAddress: response?.data?.patient?.address,
            });
            setInitialtreatmentValues((prev: any) => ({
               ...prev,
               complaint: response.data?.complaint,
               statusKunjungan: response?.data?.status,
               appointmentId: response.data?.appointmentId,
               patientId: String(response.data?.patientId),
               doctorId,
            }));
         }

         setFormReady(true);
      }

      init();
   }, []);

   const patientFormFields: TFormProps['fields'] = useMemo(
      () =>
         formReady
            ? [
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Kode Pasien',
                          inputProps: {
                             name: 'patientId',
                             required: true,
                             type: 'text',
                             disabled: true,
                          },
                       },
                       {
                          label: 'Nama',
                          inputProps: {
                             name: 'patientName',
                             required: true,
                             type: 'text',
                             disabled: true,
                          },
                       },
                    ],
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Email',
                          inputProps: {
                             name: 'patientEmail',
                             required: true,
                             type: 'email',
                             disabled: true,
                          },
                       },
                       {
                          label: 'No. HP',
                          inputProps: {
                             name: 'patientPhoneNumber',
                             required: true,
                             type: 'text',
                             disabled: true,
                          },
                       },
                    ],
                 },
                 {
                    label: 'Alamat',
                    inputProps: {
                       name: 'patientAddress',
                       required: true,
                       type: 'text',
                       disabled: true,
                    },
                 },
              ]
            : [],
      [formReady],
   );

   const treatmentFormFields: TFormProps['fields'] = useMemo(
      () => [
         {
            label: 'Keluhan',
            inputProps: {
               name: 'complaint',
               required: true,
               type: 'text',
               disabled: true,
            },
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Gejala',
                  inputProps: {
                     name: 'symptoms',
                     required: true,
                     type: 'text',
                  },
               },
               {
                  label: 'Diagnosis',
                  inputProps: {
                     name: 'diagnosis',
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
                  label: 'Penanganan',
                  inputProps: {
                     name: 'treatment',
                     required: true,
                     type: 'text',
                  },
               },
               {
                  label: 'Catatan',
                  inputProps: {
                     name: 'notes',
                     required: true,
                     type: 'text',
                  },
               },
            ],
         },
         {
            label: 'Anemnesis',
            inputProps: {
               name: 'anemnesis',
               required: true,
               type: 'text',
            },
            isTextarea: true,
         },
         {
            label: 'Resep',
            inputProps: {
               name: 'recipe',
               required: true,
               type: 'text',
            },
            isTextarea: true,
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Biaya',
                  inputProps: {
                     name: 'totalFee',
                     required: true,
                     type: 'number',
                  },
               },
               {
                  label: 'Status Pembayaran',
                  inputProps: {
                     name: 'paymentStatus',
                     required: true,
                  },
                  isSelect: true,
                  options: [
                     {
                        label: 'Lunas',
                        value: 'paid',
                     },
                     {
                        label: 'Belum Lunas',
                        value: 'unpaid',
                     },
                  ],
               },
            ],
         },
         {
            label: 'Status Kunjungan',
            inputProps: {
               name: 'statusKunjungan',
               required: true,
            },
            isSelect: true,
            options: [
               {
                  label: 'Sedang antri',
                  value: 'pending',
               },
               {
                  label: 'Sedang tindakan',
                  value: 'treating',
               },
               {
                  label: 'Pembayaran',
                  value: 'payment',
               },
            ],
         },
      ],
      [],
   );

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Informasi Kunjungan</h2>
         </div>
         <div className="w-full p-8">
            <div className="w-full flex flex-col gap-8">
               {formReady && (
                  <div className="w-full">
                     <Form
                        title="Informasi Pasien"
                        description="Informasi lengkap pasien"
                        submitButtonCaption={'Simpan'}
                        fields={patientFormFields}
                        actionCallback={onSubmit}
                        initialValues={initialPatientValues}
                        enableSubmitButton={false}
                     />
                  </div>
               )}
               <div className="w-full">
                  <Form
                     title="Informasi Penanganan"
                     description="Silahkan masukan detail penanganan"
                     submitButtonCaption={'Simpan'}
                     fields={treatmentFormFields}
                     actionCallback={onSubmit}
                     initialValues={initialtreatmentValues}
                     // enableSubmitButton={false}
                  />
                  {/* {params.mode === 'detail' && (
                     <div className="w-full my-4">
                        <Button
                           variant={'destructive'}
                           className=" hover:cursor-pointer"
                           type="button"
                           onClick={onDelete}
                        >
                           Hapus Kunjungan
                           <Trash2 />
                        </Button>
                     </div>
                  )} */}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Page;
