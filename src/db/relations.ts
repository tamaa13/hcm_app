import { relations } from 'drizzle-orm/relations';
import {
   doctors,
   schedules,
   nurses,
   patients,
   appointments,
   medicalRecords,
   recipes,
} from './schema';

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
   doctor: one(doctors, {
      fields: [schedules.doctorId],
      references: [doctors.doctorId],
   }),
   appointments: many(appointments),
}));

export const doctorsRelations = relations(doctors, ({ many }) => ({
   schedules: many(schedules),
}));

export const nursesRelations = relations(nurses, ({ many }) => ({
   medicalRecords: many(medicalRecords),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
   appointments: many(appointments),
}));

export const appointmentsRelations = relations(
   appointments,
   ({ one, many }) => ({
      patient: one(patients, {
         fields: [appointments.patientId],
         references: [patients.patientId],
      }),
      schedule: one(schedules, {
         fields: [appointments.scheduleId],
         references: [schedules.scheduleId],
      }),
      medicalRecords: many(medicalRecords),
   }),
);

export const medicalRecordsRelations = relations(
   medicalRecords,
   ({ one, many }) => ({
      appointment: one(appointments, {
         fields: [medicalRecords.appointmentId],
         references: [appointments.appointmentId],
      }),
      nurse: one(nurses, {
         fields: [medicalRecords.nurseId],
         references: [nurses.nurseId],
      }),
      recipes: many(recipes),
   }),
);

export const recipesRelations = relations(recipes, ({ one }) => ({
   medicalRecord: one(medicalRecords, {
      fields: [recipes.recordId],
      references: [medicalRecords.recordId],
   }),
}));
