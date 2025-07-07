ALTER TABLE "medical_records" ADD COLUMN "patient_id" integer;--> statement-breakpoint
ALTER TABLE "medical_records" ADD COLUMN "doctor_id" integer;--> statement-breakpoint
ALTER TABLE "medical_records" ADD COLUMN "anemnesis" text;--> statement-breakpoint
ALTER TABLE "medical_records" ADD COLUMN "recipe" text;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;