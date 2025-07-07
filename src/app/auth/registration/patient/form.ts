import { TFormProps } from '@/components/custom/form';

export const formFields: TFormProps['fields'] = [
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
      label: 'Allergies',
      inputProps: {
         name: 'allergies',
         required: true,
         type: 'text',
      },
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
         {
            label: 'Blood Type',
            inputProps: {
               name: 'bloodType',
               required: true,
            },
            isSelect: true,
            options: [
               {
                  label: 'O',
                  value: 'O',
               },
               {
                  label: 'A',
                  value: 'A',
               },
               {
                  label: 'B',
                  value: 'B',
               },
               {
                  label: 'AB',
                  value: 'AB',
               },
            ],
         },
      ],
   },
   {
      horizontalFieldsContainer: true,
      fields: [
         {
            label: 'Height (cm)',
            inputProps: {
               name: 'heightCm',
               required: true,
               type: 'number',
            },
         },
         {
            label: 'Weight (kg)',
            inputProps: {
               name: 'weightKg',
               required: true,
               type: 'number',
            },
         },
      ],
   },
];
