'use client';

import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

type TFormField = {
   label: string;
   inputProps: React.ComponentProps<'input'> & {
      name: string;
      allowedDays?: number[];
   };
   horizontalFieldsContainer?: false;
} & (
   | {
        isSelect?: false;
        isTextarea?: false;
     }
   | {
        isSelect: true;
        options: { label: string; value: any }[];
        onChoice?: (params?: any) => any;
     }
   | {
        isTextarea: true;
        isSelect?: false;
     }
);

export type TFormProps = {
   title?: string;
   description?: string;
   submitButtonCaption?: string;
   fields: (
      | { horizontalFieldsContainer: true; fields: TFormField[] }
      | TFormField
   )[];
   actionCallback?: (props?: any) => any;
   initialValues?: Record<string, any>;
   enableSubmitButton?: boolean;
};

export default function Form({
   title,
   description,
   submitButtonCaption,
   fields,
   actionCallback,
   initialValues,
   enableSubmitButton = true,
}: TFormProps) {
   const { pending } = useFormStatus();
   const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

   const [fieldOptions, setFieldOptions] = useState<any>();

   useEffect(() => {
      const optionsMap: any = {};
      function traverse(fields: TFormField[]) {
         fields.forEach((field) => {
            if ('horizontalFieldsContainer' in field) {
               traverse((field as any).fields);
            } else if (field.isSelect) {
               optionsMap[field.inputProps.name!] = [...field.options];
            }
         });
      }
      traverse(fields as any);
      setFieldOptions(optionsMap);
   }, [JSON.stringify(fields)]);

   useEffect(() => {
      if (initialValues && Object.keys(initialValues).length) {
         setFieldValues((prev) => ({ ...prev, ...initialValues }));
      }
   }, [initialValues]);

   const handleChange = (name: string, value: any) => {
      setFieldValues((prev) => ({ ...prev, [name]: value }));
   };

   const renderField = (field: TFormField, i: number, j?: number) => {
      const key = j !== undefined ? `form-field-${i}-${j}` : `form-field-${i}`;
      const name = field.inputProps.name!;
      const value = fieldValues[name] ?? '';

      return (
         <div key={key} className="w-full flex flex-col gap-2">
            {field.label && <Label htmlFor={name}>{field.label}</Label>}

            {field.isSelect ? (
               fieldOptions?.[field?.inputProps?.name as any]?.length > 0 ? (
                  <Select
                     value={
                        fieldOptions?.[field.inputProps?.name as any].some(
                           (o: any) => o.value === value,
                        )
                           ? value
                           : 'select'
                     }
                     required={field.inputProps.required}
                     disabled={field.inputProps.disabled}
                     onValueChange={(v) => {
                        handleChange(name, v);
                        field.onChoice?.(v);
                     }}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder={field.label} />
                     </SelectTrigger>
                     <SelectContent className="max-h-[320px] overflow-y-scroll">
                        {fieldOptions?.[field.inputProps?.name as any].map(
                           (opt: any) => (
                              <SelectItem
                                 key={`${opt.value}`}
                                 value={opt.value}
                              >
                                 {opt.label}
                              </SelectItem>
                           ),
                        )}
                     </SelectContent>
                  </Select>
               ) : (
                  <Input
                     disabled
                     placeholder="Memuat pilihan..."
                     className="w-full opacity-60"
                  />
               )
            ) : (
               <>
                  {(field as any).isTextarea ? (
                     <textarea
                        {...(field.inputProps as any)}
                        className="border rounded px-3 py-2 w-full min-h-[120px]"
                        value={value}
                        onChange={(e) => handleChange(name, e.target.value)}
                     />
                  ) : (
                     <Input
                        {...field.inputProps}
                        value={value}
                        onChange={(e) => {
                           field?.inputProps?.onChange?.(e);
                           handleChange(name, e.target.value);
                        }}
                     />
                  )}
               </>
            )}
         </div>
      );
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();
      for (const [key, value] of Object.entries(fieldValues)) {
         formData.append(key, value);
      }
      const result = await actionCallback?.(formData);
      if (result?.success) {
         setFieldValues({});
      }
   };

   const isReady =
      !initialValues ||
      (initialValues && Object.keys(initialValues).length > 0);

   if (!isReady) return null;

   return (
      <Card className="w-full h-full">
         <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit}>
               <div className="flex flex-col gap-6">
                  {fields.map((field, i) =>
                     field.horizontalFieldsContainer ? (
                        <div
                           key={`horizontal-group-${i}`}
                           className="w-full flex items-center gap-4"
                        >
                           {field.fields.map((f, j) => renderField(f, i, j))}
                        </div>
                     ) : (
                        renderField(field, i)
                     ),
                  )}
               </div>
               <div className="h-8" />
               {enableSubmitButton && (
                  <Button
                     type="submit"
                     className="w-full hover:cursor-pointer"
                     disabled={pending}
                  >
                     {submitButtonCaption || 'Submit'}
                  </Button>
               )}
            </form>
         </CardContent>
      </Card>
   );
}
