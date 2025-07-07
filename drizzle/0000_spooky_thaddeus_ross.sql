CREATE TABLE "appointments" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	"appointment_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time,
	"status" varchar(20) NOT NULL,
	"complaint" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doctor_id" serial PRIMARY KEY NOT NULL,
	"registration_number" varchar(50) NOT NULL,
	"specialization" varchar(100) NOT NULL,
	"education" text,
	"experience_years" integer,
	"is_available" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"email" varchar(64),
	"address" varchar(240),
	"gender" varchar(6),
	"birth_date" date NOT NULL,
	"profession" varchar(64),
	"id_card" varchar(80),
	"password" varchar(255),
	CONSTRAINT "doctors_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "doctors_email_unique" UNIQUE("email"),
	CONSTRAINT "doctors_id_card_unique" UNIQUE("id_card")
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"record_id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"nurse_id" integer,
	"symptoms" text,
	"diagnosis" text,
	"treatment" text,
	"notes" text,
	"payment_status" varchar(20),
	"total_fee" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nurses" (
	"nurse_id" serial PRIMARY KEY NOT NULL,
	"department" varchar(100),
	"position" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"email" varchar(64),
	"address" varchar(240),
	"gender" varchar(6),
	"birth_date" date NOT NULL,
	"profession" varchar(64),
	"id_card" varchar(80),
	"password" varchar(255),
	CONSTRAINT "nurses_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "nurses_email_unique" UNIQUE("email"),
	CONSTRAINT "nurses_id_card_unique" UNIQUE("id_card")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"patient_id" serial PRIMARY KEY NOT NULL,
	"blood_type" varchar(5),
	"allergies" text,
	"height_cm" integer,
	"weight_kg" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"email" varchar(64),
	"address" varchar(240),
	"gender" varchar(6),
	"birth_date" date NOT NULL,
	"profession" varchar(64),
	"id_card" varchar(80),
	"password" varchar(255),
	CONSTRAINT "patients_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "patients_email_unique" UNIQUE("email"),
	CONSTRAINT "patients_id_card_unique" UNIQUE("id_card")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"recipe_id" serial PRIMARY KEY NOT NULL,
	"record_id" integer NOT NULL,
	"medicine_name" varchar(255) NOT NULL,
	"dosage" varchar(100) NOT NULL,
	"frequency" varchar(100) NOT NULL,
	"duration" varchar(50) NOT NULL,
	"instructions" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"schedule_id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"max_patients" integer,
	"is_recurring" boolean,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("schedule_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("appointment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "public"."nurses"("nurse_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."medical_records"("record_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;