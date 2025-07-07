'use client';

import React, { useEffect, useState } from 'react';
import Form from '@/components/custom/form';
import { getMedicalRecord } from '@/services/medicalRecords.service';
import { formFields } from './form';
import { toast } from 'react-toastify';
import GlobalProvider from '@/app/globalProvider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

function PageComponent() {
   const router = useRouter();
   const searchParams = useSearchParams();

   const [initialValues, setInitialValues] = useState<any>();

   useEffect(() => {
      const medicalRecordId = searchParams.get('id');
      async function fetchMedicalRecord() {
         const response = await getMedicalRecord(medicalRecordId || '');

         setInitialValues({
            ...response.data,
            patientName: response?.data?.patient?.name,
            doctorName: response?.data?.doctor?.name,
            nurseName: response?.data?.nurse?.name,
         });
      }

      if (medicalRecordId) {
         fetchMedicalRecord();
      }
   }, []);

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Informasi Histori Medis</h2>
         </div>
         <div className="w-full  px-8">
            <Form
               title="Histori Medis"
               description=""
               submitButtonCaption={''}
               fields={formFields}
               actionCallback={() => {}}
               initialValues={initialValues}
               enableSubmitButton={false}
            />
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
