'use server';
import { db } from '../db/db';
import { patients } from '../db/schema';
import { desc, eq, ilike, or } from 'drizzle-orm';

export async function registerPatient(payload: FormData) {
   try {
      const newPatient: any = Object.fromEntries(payload.entries());

      const existingPatientByEmail = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.email, newPatient.email),
      });
      if (existingPatientByEmail)
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingPatientByPhoneNumber = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.phoneNumber, newPatient.phoneNumber),
      });
      if (existingPatientByPhoneNumber)
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingPatientByIdCard = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.idCard, newPatient.idCard),
      });
      if (existingPatientByIdCard)
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      const result = (
         await db.insert(patients).values(newPatient).returning()
      )[0];

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

export async function updatePatient(payload: FormData) {
   try {
      let updatedPatient: any = Object.fromEntries(payload.entries());

      updatedPatient.patientId = parseInt(updatedPatient.patientId);

      const existingPatientByEmail = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.email, updatedPatient.email),
      });
      if (
         existingPatientByEmail?.patientId &&
         existingPatientByEmail?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingPatientByPhoneNumber = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.phoneNumber, updatedPatient.phoneNumber),
      });
      if (
         existingPatientByPhoneNumber &&
         existingPatientByPhoneNumber?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingPatientByIdCard = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.idCard, updatedPatient.idCard),
      });
      if (
         existingPatientByIdCard &&
         existingPatientByIdCard?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      updatedPatient = {
         ...updatedPatient,
         createdAt: undefined,
         updatedAt: undefined,
      };
      const result = await db
         .update(patients)
         .set(updatedPatient)
         .where(eq(patients.patientId, updatedPatient.patientId))
         .returning();

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

export async function deletePatient(patientId: string) {
   try {
      await db.delete(patients).where(eq(patients.patientId, patientId as any));

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
export async function getPatients(payload?: FormData) {
   try {
      let request: any = {};
      if (payload) request = Object.fromEntries(payload.entries());

      const limit = Number(request.limit || 10);
      const offset = Number(request.offset || 0);
      const search = (request.search || '').toLowerCase();

      const p = patients;

      const whereClause = search ? or(ilike(p.name, `%${search}%`)) : undefined;

      const results = await db
         .select()
         .from(p)
         .where(whereClause)
         .limit(limit)
         .offset(offset)
         .orderBy(desc(p.updatedAt));

      return {
         success: true,
         data: results,
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}

export async function getPatientById(patientId: string) {
   try {
      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.patientId, patientId as any),
      });

      return {
         success: true,
         data: patient,
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}
