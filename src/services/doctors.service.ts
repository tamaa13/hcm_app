'use server';
import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { doctors } from '../db/schema';

export async function registerDoctor(payload: FormData) {
   try {
      const newDoctor: any = Object.fromEntries(payload.entries());

      const existingDoctorByEmail = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.email, newDoctor.email),
      });
      if (existingDoctorByEmail)
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingDoctorByPhoneNumber = await db.query.doctors.findFirst({
         where: (doctors, { eq }) =>
            eq(doctors.phoneNumber, newDoctor.phoneNumber),
      });
      if (existingDoctorByPhoneNumber)
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingDoctorByIdCard = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.idCard, newDoctor.idCard),
      });
      if (existingDoctorByIdCard)
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      const result = (
         await db.insert(doctors).values(newDoctor).returning()
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

export async function updateDoctor(payload: FormData) {
   try {
      let updatedDoctor: any = Object.fromEntries(payload.entries());

      updatedDoctor.doctorId = parseInt(updatedDoctor.doctorId);

      const existingDoctorByEmail = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.email, updatedDoctor.email),
      });
      if (
         existingDoctorByEmail?.doctorId &&
         existingDoctorByEmail?.doctorId !== updatedDoctor.doctorId
      )
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingDoctorByPhoneNumber = await db.query.doctors.findFirst({
         where: (doctors, { eq }) =>
            eq(doctors.phoneNumber, updatedDoctor.phoneNumber),
      });
      if (
         existingDoctorByPhoneNumber &&
         existingDoctorByPhoneNumber?.doctorId !== updatedDoctor.doctorId
      )
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingDoctorByIdCard = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.idCard, updatedDoctor.idCard),
      });
      if (
         existingDoctorByIdCard &&
         existingDoctorByIdCard?.doctorId !== updatedDoctor.doctorId
      )
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      delete updatedDoctor.createdAt;
      delete updatedDoctor.updatedAt;

      updatedDoctor = {
         ...updatedDoctor,
         experienceYears: Number(updatedDoctor?.experienceYears) || 0,
         isAvailable: true,
      };

      const result = await db
         .update(doctors)
         .set(updatedDoctor)
         .where(eq(doctors.doctorId, updatedDoctor.doctorId))
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

export async function getDoctors(payload?: FormData) {
   try {
      let request: any;
      if (payload) request = Object.fromEntries(payload.entries());

      const doctors = await db.query.doctors.findMany({
         limit: request.limit || 10,
         offset: request.offset || 0,
         orderBy: (doctor, { desc }) => desc(doctor?.updatedAt),
      });

      return {
         success: true,
         data: doctors,
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
export async function getDoctorsSelection(payload?: FormData) {
   try {
      let request: any;
      if (payload) request = Object.fromEntries(payload.entries());

      const doctors = await db.query.doctors.findMany({
         limit: request.limit || 10,
         offset: request.offset || 0,
         with: {
            schedules: true,
         },
         orderBy: (doctor, { desc }) => desc(doctor?.updatedAt),
      });

      const hasSchedules = doctors.filter(
         (doctor) => doctor.schedules?.length > 0,
      );

      return {
         success: true,
         data: hasSchedules,
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

export async function deleteDoctor(doctorId: string) {
   try {
      const doctorResult = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.doctorId, doctorId as any),
      });

      if (!doctorResult) {
         return {
            success: false,
            msg: "Doctor doesn't exist",
         };
      }

      await db.delete(doctors).where(eq(doctors.doctorId, doctorId as any));

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
