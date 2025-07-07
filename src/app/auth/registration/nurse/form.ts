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
      horizontalFieldsContainer: true,
      fields: [
         {
            label: 'Department',
            inputProps: {
               name: 'department',
               required: true,
               type: 'string',
            },
         },
         {
            label: 'Position',
            inputProps: {
               name: 'position',
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
