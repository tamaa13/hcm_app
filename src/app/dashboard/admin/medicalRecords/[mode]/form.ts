import { TFormProps } from '@/components/custom/form';

export const formFields: TFormProps['fields'] = [
   {
      horizontalFieldsContainer: true,
      fields: [
         {
            label: 'Kode Kunjungan',
            inputProps: {
               name: 'appointmentId',
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
            label: 'Kode Pasien',
            inputProps: {
               name: 'patientId',
               required: true,
               type: 'text',
               disabled: true,
            },
         },
         {
            label: 'Nama Pasien',
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
            label: 'Kode Dokter',
            inputProps: {
               name: 'doctorId',
               required: true,
               type: 'text',
               disabled: true,
            },
         },
         {
            label: 'Nama Dokter',
            inputProps: {
               name: 'doctorName',
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
            label: 'Kode Admin',
            inputProps: {
               name: 'nurseId',
               required: true,
               type: 'text',
               disabled: true,
            },
         },
         {
            label: 'Nama Admin',
            inputProps: {
               name: 'nurseName',
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
            label: 'Diagnosis',
            inputProps: {
               name: 'diagnosis',
               required: true,
               type: 'text',
               disabled: true,
            },
         },
         {
            label: 'Gejala',
            inputProps: {
               name: 'symptoms',
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
            label: 'Anemnesis',
            inputProps: {
               name: 'anemnesis',
               required: true,
               disabled: true,
            },
            isTextarea: true,
         },
         {
            label: 'Penanganan',
            inputProps: {
               name: 'treatment',
               required: true,
               disabled: true,
            },
            isTextarea: true,
         },
      ],
   },
   {
      label: 'Catatan',
      inputProps: {
         name: 'notes',
         required: true,
         disabled: true,
      },
      isTextarea: true,
   },
   {
      label: 'Resep',
      inputProps: {
         name: 'recipe',
         required: true,
         disabled: true,
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
               type: 'text',
               disabled: true,
            },
         },
         {
            label: 'Status Pembayaran',
            inputProps: {
               name: 'paymentStatus',
               required: true,
               disabled: true,
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
];
