'use server';
import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { nurses } from '../db/schema';

export async function registerNurse(payload: FormData) {
   try {
      const newNurse: any = Object.fromEntries(payload.entries());

      delete newNurse.age;

      const existingNurseByEmail = await db.query.nurses.findFirst({
         where: (nurses, { eq }) => eq(nurses.email, newNurse.email),
      });
      if (existingNurseByEmail)
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingNurseByPhoneNumber = await db.query.nurses.findFirst({
         where: (nurses, { eq }) =>
            eq(nurses.phoneNumber, newNurse.phoneNumber),
      });
      if (existingNurseByPhoneNumber)
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingNurseByIdCard = await db.query.nurses.findFirst({
         where: (nurses, { eq }) => eq(nurses.idCard, newNurse.idCard),
      });
      if (existingNurseByIdCard)
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      const result = (await db.insert(nurses).values(newNurse).returning())[0];

      return {
         success: !!result,
         data: result,
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

export async function deleteNurse(nurseId: string) {
   try {
      const nurseResult = await db.query.nurses.findFirst({
         where: (nurses, { eq }) => eq(nurses.nurseId, nurseId as any),
      });

      if (!nurseResult) {
         return {
            success: false,
            msg: "Nurse doesn't exist",
         };
      }

      await db.delete(nurses).where(eq(nurses.nurseId, nurseId as any));

      return {
         success: true,
         msg: 'Data deleted successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}
