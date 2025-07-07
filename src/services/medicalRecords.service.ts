'use server';
import { db } from '../db/db';
import {
   appointments,
   doctors,
   medicalRecords,
   nurses,
   patients,
} from '../db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';

export async function createMedicalRecord(payload: FormData) {
   try {
      const newMedicalRecord: any = Object.fromEntries(payload.entries());

      const appointmentId = newMedicalRecord?.appointmentId;
      const appointmentStatus = newMedicalRecord?.statusKunjungan || 'pending';

      delete newMedicalRecord.complaint;
      delete newMedicalRecord.statusKunjungan;

      await db
         .update(appointments)
         .set({
            status: appointmentStatus,
         })
         .where(eq(appointments?.appointmentId, appointmentId));

      const result = (
         await db.insert(medicalRecords).values(newMedicalRecord).returning()
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

export async function updateMedicalRecord(payload: FormData) {
   try {
      const updatedMedicalRecord: any = Object.fromEntries(payload.entries());

      delete updatedMedicalRecord.complaint;

      if (updatedMedicalRecord?.nurseId) {
         const nurse = await db.query.nurses.findFirst({
            where: (nurse, { eq }) =>
               eq(nurse.nurseId, updatedMedicalRecord?.nurseId),
         });

         if (!nurse)
            return {
               success: false,
               msg: "Nurse doesn't exist",
            };
      }

      if (updatedMedicalRecord?.doctorId) {
         const doctor = await db.query.doctors.findFirst({
            where: (doctor, { eq }) =>
               eq(doctor.doctorId, updatedMedicalRecord?.doctorId),
         });

         if (!doctor)
            return {
               success: false,
               msg: "Doctor doesn't exist",
            };
      }

      if (updatedMedicalRecord?.patientId) {
         const patient = await db.query.patients.findFirst({
            where: (patient, { eq }) =>
               eq(patient.patientId, updatedMedicalRecord?.patientId),
         });

         if (!patient)
            return {
               success: false,
               msg: "Patient doesn't exist",
            };
      }

      if (updatedMedicalRecord?.appointmentId) {
         const appointment = await db.query.appointments.findFirst({
            where: (appointment, { eq }) =>
               eq(
                  appointment.appointmentId,
                  updatedMedicalRecord?.appointmentId,
               ),
         });

         if (!appointment)
            return {
               success: false,
               msg: "Appointment doesn't exist",
            };
      }

      delete updatedMedicalRecord.createdAt;
      delete updatedMedicalRecord.updatedAt;

      const result = await db
         .update(medicalRecords)
         .set(updatedMedicalRecord)
         .where(eq(medicalRecords.recordId, updatedMedicalRecord?.recordId))
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

export async function getMedicalRecord(recordId?: string) {
   try {
      const medicalRecordsResult = await db.query.medicalRecords.findFirst({
         with: {
            appointment: true,
            nurse: true,
            doctor: true,
            patient: true,
         },
         where: (medicalRecords, { eq }) =>
            eq(medicalRecords.recordId, recordId as any),
      });

      return {
         success: true,
         data: {
            ...medicalRecordsResult,
            createdAt: undefined,
            updatedAt: undefined,
         },
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

export async function deleteMedicalRecord(recordId?: string) {
   try {
      await db
         .delete(medicalRecords)
         .where(eq(medicalRecords?.recordId, recordId as any));

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
export async function getMedicalRecords(payload?: FormData) {
   try {
      const request: Record<string, any> = {};
      if (payload) {
         for (const [key, value] of payload.entries()) {
            request[key] = value;
         }
      }

      const limit = Number(request.limit || 10);
      const offset = Number(request.offset || 0);
      const search = (request.search || '').toLowerCase();

      const m = medicalRecords;
      const p = patients;
      const d = doctors;
      const a = appointments;
      const n = nurses;

      const filters = [];

      if (request.patientId) filters.push(eq(p.patientId, request.patientId));
      if (request.doctorId) filters.push(eq(d.doctorId, request.doctorId));
      if (request.appointmentId)
         filters.push(eq(a.appointmentId, request.appointmentId));
      if (request.nurseId) filters.push(eq(n.nurseId, request.nurseId));

      const searchClause = search
         ? or(
              ilike(m.symptoms, `%${search}%`),
              ilike(m.diagnosis, `%${search}%`),
              ilike(m.anemnesis, `%${search}%`),
              ilike(m.treatment, `%${search}%`),
              ilike(m.notes, `%${search}%`),
              ilike(m.recipe, `%${search}%`),
              ilike(m.paymentStatus, `%${search}%`),
              ilike(p.name, `%${search}%`),
              ilike(d.name, `%${search}%`),
              ilike(n.name, `%${search}%`),
           )
         : undefined;

      const whereClause =
         searchClause && filters.length > 0
            ? and(searchClause, ...filters)
            : searchClause ||
              (filters.length > 0 ? and(...filters) : undefined);

      const results = await db
         .select()
         .from(m)
         .leftJoin(d, eq(m.doctorId, d.doctorId))
         .leftJoin(p, eq(m.patientId, p.patientId))
         .leftJoin(a, eq(m.appointmentId, a.appointmentId))
         .leftJoin(n, eq(m.nurseId, n.nurseId))
         .where(whereClause)
         .limit(limit)
         .offset(offset)
         .orderBy(desc(m.updatedAt));

      return {
         success: true,
         data: results,
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}
