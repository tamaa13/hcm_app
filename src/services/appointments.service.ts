'use server';

import { db } from '@/db/db';
import { appointments, patients } from '@/db/schema';
import { and, desc, eq, ilike, or, sql, asc } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
import * as schema from '../db/schema';

export async function createAppointments(payload: FormData) {
   try {
      const newAppoointment: any = Object.fromEntries(payload.entries());

      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.patientId, newAppoointment.patientId),
      });
      if (!patient)
         return {
            success: false,
            msg: 'Patient data could not be found',
         };

      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, newAppoointment.scheduleId),
      });
      if (!schedule)
         return {
            success: false,
            msg: 'Schedule data could not be found',
         };
      const doctor = await db.query.doctors.findFirst({
         where: (doctors, { eq }) =>
            eq(doctors.doctorId, newAppoointment.doctorId),
      });
      if (!doctor)
         return {
            success: false,
            msg: 'Doctor data could not be found',
         };

      const result = (
         await db.insert(appointments).values(newAppoointment).returning()
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

export async function updateAppointments(payload: FormData) {
   try {
      const updateData: any = Object.fromEntries(payload.entries());

      if (!updateData.appointmentId) {
         return {
            success: false,
            msg: 'Appointment ID is required',
         };
      }

      const existingAppointment = await db.query.appointments.findFirst({
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, updateData.appointmentId),
      });

      if (!existingAppointment) {
         return {
            success: false,
            msg: 'Appointment not found',
         };
      }

      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.patientId, updateData.patientId),
      });
      if (!patient)
         return {
            success: false,
            msg: 'Patient data could not be found',
         };

      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, updateData.scheduleId),
      });
      if (!schedule)
         return {
            success: false,
            msg: 'Schedule data could not be found',
         };

      const doctor = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.doctorId, updateData.doctorId),
      });
      if (!doctor)
         return {
            success: false,
            msg: 'Doctor data could not be found',
         };

      const result = await db
         .update(appointments)
         .set(updateData)
         .where(eq(appointments.appointmentId, updateData.appointmentId))
         .returning();

      return {
         success: !!result,
         data: result,
         msg: 'Update successful',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function deleteAppointment(appointmentId: string) {
   try {
      const appointmentResult = await db.query.appointments.findFirst({
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, appointmentId as any),
      });

      if (!appointmentResult) {
         return {
            success: false,
            msg: "Appointment doesn't exist",
         };
      }

      await db
         .delete(appointments)
         .where(eq(appointments.appointmentId, appointmentId as any));

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

export async function getPatientAppointments(patientId: string) {
   try {
      const patient = await db.query.appointments.findMany({
         where: (appointments, { eq }) =>
            eq(appointments.patientId, patientId as any),
         with: {
            patient: true,
            schedule: true,
            medicalRecords: true,
         },
         orderBy: (appointment, { asc }) => asc(appointment.updatedAt),
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
export async function getAllAppointments(payload?: FormData) {
   try {
      let request: any;
      if (payload) {
         request = Object.fromEntries(payload.entries());
      }

      const limit = Number(request.limit || 10);
      const offset = Number(request.offset || 0);
      const search = (request.search || '').toLowerCase();
      const status = request?.status;

      const a = appointments;
      const p = patients;

      const whereClause = and(
         or(ilike(a.complaint, `%${search}%`), ilike(p.name, `%${search}%`)),
         status
            ? status?.includes('|')
               ? or(
                    ...status
                       ?.split('|')
                       ?.map((status: string) => eq(a.status, status)),
                 )
               : eq(a.status, status)
            : undefined,
      );

      const results = await db
         .select()
         .from(a)
         .leftJoin(p, eq(a.patientId, p.patientId))
         .where(whereClause)
         .limit(limit)
         .offset(offset)
         .orderBy(asc(a.createdAt));

      return {
         success: true,
         data: results?.map((resultData) => ({
            ...resultData?.appointments,
            patient: resultData?.patients,
         })),
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred ${err.toString()}`,
      };
   }
}
export async function getAppointment(appointmentId?: string) {
   try {
      const appointmentsResult = await db.query.appointments.findFirst({
         with: {
            patient: true,
            schedule: true,
            medicalRecords: true,
         },
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, appointmentId as any),
      });

      return {
         success: true,
         data: {
            ...appointmentsResult,
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
export async function getAppointmentTotals() {
   try {
      const result = await db
         .select({
            status: appointments.status,
            count: sql<number>`COUNT(*)`,
         })
         .from(appointments)
         .groupBy(appointments.status);

      return {
         success: true,
         data: result,
         msg: 'Appointment totals grouped by status fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function validateAppointmentTime(
   doctorId: string,
   scheduleId: string,
   startTime: string,
   endTime: string,
   date: string,
) {
   function toDateTime(time: string) {
      return new Date(`${date}T${time}`);
   }

   try {
      const doctorAppointments = await db.query.appointments.findMany({
         where: (appointment, { eq, and }) =>
            and(
               eq(appointment.doctorId, doctorId as any),
               eq(appointment.scheduleId, scheduleId as any),
            ),
         with: {
            schedule: true,
         },
         orderBy: (appointment, { asc }) => [asc(appointment.startTime)],
      });

      const doctorTodaySchedule = await db.query.schedules.findFirst({
         where: (sched, { eq, and }) =>
            and(
               eq(sched?.doctorId, doctorId as any),
               eq(sched?.scheduleId, scheduleId as any),
            ),
      });

      if (!doctorTodaySchedule) {
         return {
            success: false,
            msg: 'Jadwal dokter tidak ditemukan.',
         };
      }

      const inputStart = toDateTime(startTime);
      const inputEnd = toDateTime(endTime);
      const scheduleStart = toDateTime(doctorTodaySchedule.startTime);
      const scheduleEnd = toDateTime(doctorTodaySchedule.endTime);

      if (inputStart >= inputEnd) {
         return {
            success: false,
            msg: `Waktu mulai harus lebih awal dari waktu selesai.`,
         };
      }

      if (inputStart < scheduleStart || inputEnd > scheduleEnd) {
         return {
            success: false,
            msg: `Waktu harus dalam rentang jadwal dokter: ${doctorTodaySchedule.startTime} - ${doctorTodaySchedule.endTime}`,
         };
      }

      const sameDayAppointments = doctorAppointments.filter((appt) => {
         return (
            new Date(appt.appointmentDate).toDateString() ===
            new Date(date).toDateString()
         );
      });

      const conflicting = sameDayAppointments.find((appt) => {
         const apptStart = toDateTime(appt.startTime);
         const apptEnd = toDateTime(appt.endTime as any);
         return inputStart < apptEnd && inputEnd > apptStart;
      });

      if (conflicting) {
         const arrangedTimes = sameDayAppointments
            .map((appt) => `${appt.startTime} - ${appt.endTime}`)
            .join(', ');

         return {
            success: false,
            msg: `Waktu bertabrakan dengan janji temu lain. Jadwal yang sudah ada: ${arrangedTimes}`,
         };
      }

      return {
         success: true,
         msg: 'Waktu valid dan tersedia.',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `Terjadi kesalahan: ${err.toString()}`,
      };
   }
}
