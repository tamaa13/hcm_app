import { TFormProps } from '@/components/custom/form';

export const formFields: TFormProps['fields'] = [
   {
      label: 'Email',
      inputProps: {
         required: true,
         type: 'email',
         name: 'email',
      },
   },
   {
      label: 'Password',
      inputProps: {
         required: true,
         type: 'password',
         name: 'password',
      },
   },
   {
      label: 'Account Type',
      inputProps: {
         required: true,
         name: 'accountType',
      },
      isSelect: true,
      options: [
         {
            label: 'Patient',
            value: 'patient',
         },
         {
            label: 'Nurse',
            value: 'nurse',
         },
         {
            label: 'Doctor',
            value: 'doctor',
         },
      ],
   },
];
