'use client';
import React from 'react';
import Form from '@/components/custom/form';
import { formFields } from './form';
import { signIn } from '@/services/auth.service';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Page() {
   const router = useRouter();
   async function onSubmit(formData: FormData) {
      try {
         const response = await signIn(formData);

         if (!response.success) {
            toast.info(response.msg);
         }

         router.replace(`/dashboard/${response.data?.type}`);
         return response;
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   return (
      <div className="w-screen h-screen flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Sign in to your account"
               description="Please input your credentials"
               submitButtonCaption="Sign In"
               fields={formFields}
               actionCallback={onSubmit}
            />
            <div className=" w-full flex items-center justify-center gap-2 my-4 text-slate-400">
               <p>Don&apos;t hace an account?</p>
               <Link
                  href="/auth/registration"
                  className="text-slate-500 hover:text-slate-700"
               >
                  Register
               </Link>
            </div>
         </div>
      </div>
   );
}

export default Page;
