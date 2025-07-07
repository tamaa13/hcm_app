'use server';

import { db } from '@/db/db';
import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';
import { redirect } from 'next/navigation';

export async function signIn(payload: FormData) {
   const cookieStore = await cookies();

   try {
      const authPayload: any = Object.fromEntries(payload.entries());

      let userResult: any;

      switch (authPayload.accountType) {
         case 'patient':
            userResult = await db.query.patients.findFirst({
               where: (patients, { eq, and }) =>
                  and(
                     eq(patients.email, authPayload.email),
                     eq(patients.password, authPayload.password),
                  ),
            });
            if (userResult) {
               const token = sign(
                  { type: 'patient', patientId: userResult.patientId },
                  process.env.NEXT_PUBLIC_JWT_SECRET!,
               );
               userResult.type = 'patient';
               cookieStore.set({
                  name: 'token',
                  value: token,
                  httpOnly: true,
                  path: '/',
               });
               cookieStore.set({
                  name: 'role',
                  value: 'patient',
                  httpOnly: true,
                  path: '/',
               });
            }
            break;
         case 'nurse':
            userResult = await db.query.nurses.findFirst({
               where: (nurses, { eq, and }) =>
                  and(
                     eq(nurses.email, authPayload.email),
                     eq(nurses.password, authPayload.password),
                  ),
            });
            if (userResult) {
               const token = sign(
                  { type: 'nurse', nurseId: userResult.nurseId },
                  process.env.NEXT_PUBLIC_JWT_SECRET!,
               );

               userResult.type = 'nurse';
               cookieStore.set({
                  name: 'token',
                  value: token,
                  httpOnly: true,
                  path: '/',
               });
               cookieStore.set({
                  name: 'role',
                  value: 'nurse',
                  httpOnly: true,
                  path: '/',
               });
            }
            break;
         case 'doctor':
            userResult = await db.query.doctors.findFirst({
               where: (doctors, { eq, and }) =>
                  and(
                     eq(doctors.email, authPayload.email),
                     eq(doctors.password, authPayload.password),
                  ),
            });
            if (userResult) {
               const token = sign(
                  { type: 'doctor', doctorId: userResult.doctorId },
                  process.env.NEXT_PUBLIC_JWT_SECRET!,
               );
               userResult.type = 'doctor';
               cookieStore.set({
                  name: 'token',
                  value: token,
                  httpOnly: true,
                  path: '/',
               });
               cookieStore.set({
                  name: 'role',
                  value: 'doctor',
                  httpOnly: true,
                  path: '/',
               });
            }
            break;
         default:
            userResult = null;
      }

      if (!userResult)
         return {
            success: false,
            msg: 'Invalid credentials',
         };

      return {
         success: true,
         data: userResult,
         msg: 'Success',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}

export async function signOut() {
   const cookieStore = await cookies();
   cookieStore.delete({
      name: 'token',
      httpOnly: true,
      path: '/',
   });
   cookieStore.delete({
      name: 'role',
      httpOnly: true,
      path: '/',
   });
   redirect('/auth/signin');
}

export async function getProfile() {
   const cookieStore = await cookies();
   const token = cookieStore.get('token')?.value || '';
   let decoded: any;

   if (token) decoded = verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);

   let user;
   if (decoded) {
      switch (decoded.type) {
         case 'patient':
            user = {
               ...(await db.query.patients.findFirst({
                  where: (patients, { eq }) =>
                     eq(patients.patientId, decoded.patientId),
               })),
               type: decoded.type,
            };
            break;
         case 'nurse':
            user = {
               ...(await db.query.nurses.findFirst({
                  where: (nurses, { eq }) =>
                     eq(nurses.nurseId, decoded.nurseId),
               })),
               type: decoded.type,
            };
            break;
         case 'doctor':
            user = {
               ...(await db.query.doctors.findFirst({
                  where: (doctors, { eq }) =>
                     eq(doctors.doctorId, decoded.doctorId),
               })),
               type: decoded.type,
            };
            break;
      }
   }

   if (!user)
      return {
         success: false,
         msg: 'Please sign in first',
      };

   return {
      success: true,
      data: user,
      msg: 'Success',
   };
}
