import {
   pgTable,
   foreignKey,
   serial,
   integer,
   time,
   boolean,
   date,
   timestamp,
   varchar,
   text,
   numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
export const schedules = pgTable(
   'schedules',
   {
      scheduleId: serial('schedule_id').notNull().primaryKey(),
      doctorId: integer('doctor_id').notNull(),
      dayOfWeek: integer('day_of_week').notNull(),
      startTime: varchar('start_time').notNull(),
      endTime: varchar('end_time').notNull(),
      maxPatients: integer('max_patients'),
      isRecurring: boolean('is_recurring'),
      validFrom: date('valid_from').notNull(),
      validTo: date('valid_to'),
      createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
      updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
   },
   (table) => [
      foreignKey({
         columns: [table.doctorId],
         foreignColumns: [doctors.doctorId],
         name: 'schedules_doctor_id_fkey',
      }),
   ],
);

export const doctors = pgTable('doctors', {
   doctorId: serial('doctor_id').notNull().primaryKey(),
   registrationNumber: varchar('registration_number', { length: 50 }).notNull(),
   specialization: varchar({ length: 100 }).notNull(),
   education: text(),
   experienceYears: integer('experience_years'),
   isAvailable: boolean('is_available'),
   createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
   updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }).unique(),
   email: varchar({ length: 64 }).unique(),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }).unique(),
   password: varchar({ length: 255 }),
});

export const nurses = pgTable('nurses', {
   nurseId: serial('nurse_id').notNull().primaryKey(),
   department: varchar({ length: 100 }),
   position: varchar({ length: 100 }),
   createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
   updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }).unique(),
   email: varchar({ length: 64 }).unique(),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }).unique(),
   password: varchar({ length: 255 }),
});

export const patients = pgTable('patients', {
   patientId: serial('patient_id').notNull().primaryKey(),
   bloodType: varchar('blood_type', { length: 5 }),
   allergies: text(),
   heightCm: integer('height_cm'),
   weightKg: numeric('weight_kg', { precision: 5, scale: 2 }),
   createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
   updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }).unique(),
   email: varchar({ length: 64 }).unique(),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }).unique(),
   password: varchar({ length: 255 }),
});

export const appointments = pgTable(
   'appointments',
   {
      appointmentId: serial('appointment_id').notNull().primaryKey(),
      patientId: integer('patient_id').notNull(),
      doctorId: integer('doctor_id').notNull(),
      scheduleId: integer('schedule_id').notNull(),
      appointmentDate: date('appointment_date').notNull(),
      startTime: varchar('start_time').notNull(),
      endTime: varchar('end_time'),
      status: varchar({ length: 20 }).notNull(),
      complaint: text(),
      createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
      updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
   },
   (table) => [
      foreignKey({
         columns: [table.patientId],
         foreignColumns: [patients.patientId],
         name: 'appointments_patient_id_fkey',
      }),
      foreignKey({
         columns: [table.scheduleId],
         foreignColumns: [schedules.scheduleId],
         name: 'appointments_schedule_id_fkey',
      }),
      foreignKey({
         columns: [table.doctorId],
         foreignColumns: [doctors.doctorId],
         name: 'appointments_doctor_id_fkey',
      }),
   ],
);

export const medicalRecords = pgTable(
   'medical_records',
   {
      recordId: serial('record_id').notNull().primaryKey(),
      appointmentId: integer('appointment_id').notNull(),
      patientId: integer('patient_id'),
      doctorId: integer('doctor_id'),
      nurseId: integer('nurse_id'),
      symptoms: text(),
      diagnosis: text(),
      anemnesis: text(),
      treatment: text(),
      notes: text(),
      recipe: text(),
      paymentStatus: varchar('payment_status', { length: 20 }),
      totalFee: numeric('total_fee', { precision: 10, scale: 2 }),
      createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
      updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
   },
   (table) => [
      foreignKey({
         columns: [table.appointmentId],
         foreignColumns: [appointments.appointmentId],
         name: 'medical_records_appointment_id_fkey',
      }),
      foreignKey({
         columns: [table.nurseId],
         foreignColumns: [nurses.nurseId],
         name: 'medical_records_nurse_id_fkey',
      }),
      foreignKey({
         columns: [table.patientId],
         foreignColumns: [patients.patientId],
         name: 'medical_records_patient_id_fkey',
      }),
      foreignKey({
         columns: [table.doctorId],
         foreignColumns: [doctors.doctorId],
         name: 'medical_records_doctor_id_fkey',
      }),
   ],
);

export const recipes = pgTable(
   'recipes',
   {
      recipeId: serial('recipe_id').notNull().primaryKey(),
      recordId: integer('record_id').notNull(),
      medicineName: varchar('medicine_name', { length: 255 }).notNull(),
      dosage: varchar({ length: 100 }).notNull(),
      frequency: varchar({ length: 100 }).notNull(),
      duration: varchar({ length: 50 }).notNull(),
      instructions: text(),
      createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
   },
   (table) => [
      foreignKey({
         columns: [table.recordId],
         foreignColumns: [medicalRecords.recordId],
         name: 'recipes_record_id_fkey',
      }),
   ],
);

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
      patient: one(patients, {
         fields: [medicalRecords.patientId],
         references: [patients.patientId],
      }),
      doctor: one(doctors, {
         fields: [medicalRecords.doctorId],
         references: [doctors.doctorId],
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
