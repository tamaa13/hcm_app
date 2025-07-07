'use server';

import { db } from '@/db/db';
import { doctors, schedules } from '@/db/schema';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

export async function createSchedule(payload: FormData) {
   try {
      const newSchedule: any = Object.fromEntries(payload.entries());

      const result = (
         await db.insert(schedules).values(newSchedule).returning()
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

export async function updateSchedule(payload: FormData) {
   try {
      const updatedSchedule: any = Object.fromEntries(payload.entries());

      if (!updatedSchedule.scheduleId) {
         return {
            success: false,
            msg: 'Missing scheduleId for update.',
         };
      }

      const scheduleId = updatedSchedule.scheduleId;
      delete updatedSchedule.scheduleId;
      delete updatedSchedule.isRecurring;

      const result = (
         await db
            .update(schedules)
            .set(updatedSchedule)
            .where(eq(schedules.scheduleId, scheduleId))
            .returning()
      )[0];

      return {
         success: !!result,
         data: result,
         msg: 'Schedule updated successfully.',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function deleteSchedule(scheduleId: string) {
   try {
      const scheduleResult = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, scheduleId as any),
      });

      if (!scheduleResult) {
         return {
            success: false,
            msg: "Schedule doesn't exist",
         };
      }

      const appointments = await db.query.appointments.findMany({
         where: (appointment, { eq }) =>
            eq(appointment.scheduleId, scheduleId as any),
      });

      if (appointments?.length)
         return {
            success: false,
            msg: 'Masih ada kunjungan untuk jadwal ini, silahkan menghapus kunjungan terkait',
         };

      await db
         .delete(schedules)
         .where(eq(schedules.scheduleId, scheduleId as any));

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

export async function getAllSchedules(payload?: FormData) {
   try {
      let request: any = {};
      if (payload) {
         request = Object.fromEntries(payload.entries());
      }

      const limit = Number(request.limit || 10);
      const offset = Number(request.offset || 0);
      const search = (request.search || '').toLowerCase();

      const s = schedules;
      const d = doctors;

      const whereClause = request?.doctorId
         ? eq(d.doctorId, request.doctorId)
         : search
         ? ilike(d.name, `%${search}%`)
         : undefined;

      const rows = await db
         .select({
            doctorId: d.doctorId,
            doctorName: d.name,
            scheduleId: s.scheduleId,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            validFrom: s.validFrom,
            validTo: s.validTo,
            createdAt: s.createdAt,
         })
         .from(s)
         .leftJoin(d, eq(s.doctorId, d.doctorId))
         .where(whereClause);

      const grouped: Record<
         number,
         {
            doctorId: number;
            doctorName: string;
            schedules: Record<number, any>;
         }
      > = {};

      for (const row of rows) {
         const docId: any = row.doctorId;
         const day = row.dayOfWeek;

         if (!grouped[docId]) {
            grouped[docId] = {
               doctorId: docId,
               doctorName: row.doctorName || '',
               schedules: {},
            };
         }

         const existing = grouped[docId].schedules[day];
         if (
            !existing ||
            new Date(row.createdAt as any) > new Date(existing.createdAt)
         ) {
            grouped[docId].schedules[day] = row;
         }
      }

      const result = Object.values(grouped)
         .map((g) => ({
            doctorId: g.doctorId,
            doctorName: g.doctorName,
            schedules: Object.values(g.schedules),
         }))
         .slice(offset, offset + limit);

      return {
         success: true,
         data: result,
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err);
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function getScheduleById(scheduleId: string) {
   try {
      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, scheduleId as any),
      });

      return {
         success: true,
         data: { ...schedule, createdAt: undefined, updatedAt: undefined },
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
