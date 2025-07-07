import { TFormProps } from '@/components/custom/form';

export const formFields: TFormProps['fields'] = [
   {
      label: 'Name',
      inputProps: {
         disabled: true,
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
               disabled: true,
               name: 'email',
               required: true,
               type: 'email',
            },
         },
         {
            label: 'Password',
            inputProps: {
               disabled: true,
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
               disabled: true,
               name: 'profession',
               required: true,
               type: 'text',
            },
         },
         {
            label: 'ID Card',
            inputProps: {
               disabled: true,
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
               disabled: true,
               name: 'phoneNumber',
               required: true,
               type: 'tel',
            },
         },
         {
            label: 'Address',
            inputProps: {
               disabled: true,
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
         disabled: true,
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
               disabled: true,
               name: 'birthDate',
               required: true,
               type: 'date',
            },
         },
         {
            label: 'Gender',
            inputProps: {
               disabled: true,
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
               disabled: true,
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
               disabled: true,
               name: 'heightCm',
               required: true,
               type: 'number',
            },
         },
         {
            label: 'Weight (kg)',
            inputProps: {
               disabled: true,
               name: 'weightKg',
               required: true,
               type: 'number',
            },
         },
      ],
   },
];
