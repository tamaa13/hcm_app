'use client';

import Form, { TFormProps } from '@/components/custom/form';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getAllSchedules } from '@/services/schedules.service';
import { getPatients } from '@/services/patients.service';
import { getDoctors, getDoctorsSelection } from '@/services/doctors.service';
import { dayOfWeekAsString } from '@/lib/utils';
import {
   createAppointments,
   deleteAppointment,
   getAppointment,
   updateAppointments,
   validateAppointmentTime,
} from '@/services/appointments.service';
import {
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Table,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useGlobalContext } from '@/app/globalProvider';

function Page() {
   const router = useRouter();
   const params = useParams();
   const searchParams = useSearchParams();

   const [initialValues, setInitialValues] = useState<any>({});
   const { states } = useGlobalContext();

   async function onSubmit(formData: FormData) {
      try {
         const requestData: any = {};
         formData
            .entries()
            .forEach((entry) => ((requestData as any)[entry[0]] = entry[1]));

         const validated = await validateAppointmentTime(
            requestData?.doctorId,
            requestData?.scheduleId,
            requestData?.startTime,
            requestData?.endTime,
            requestData?.appointmentDate,
         );

         if (!validated?.success) toast.info(validated?.msg);

         if (validated?.success) {
            let response;

            switch (params.mode) {
               case 'create':
                  response = await createAppointments(formData);
                  if (!response?.success) {
                     toast.info(response?.msg);
                  } else {
                     router.push('/dashboard/patient/appointment');
                  }

                  return response;
               case 'detail':
                  response = await updateAppointments(formData);
                  if (!response?.success) {
                     toast.info(response?.msg);
                  } else {
                     router.push('/dashboard/patient/appointment');
                  }

                  return response;
            }
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   async function onDelete() {
      try {
         const response = await deleteAppointment(searchParams.get('id') || '');

         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/patient/appointment');
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [patients, setPatients] = useState<any[]>([]);
   async function fetchPatients() {
      const formData = new FormData();
      formData.append('limit', '100');
      setPatients((await getPatients(formData))?.data || []);
      return true;
   }
   const [doctors, setDoctors] = useState<any[]>([]);
   async function fetchDoctors() {
      const formData = new FormData();
      formData.append('limit', '100');
      setDoctors((await getDoctorsSelection(formData))?.data || []);
      return true;
   }
   const [schedulesTable, setSchedulesTable] = useState<any[]>([]);
   const [schedules, setSchedules] = useState<any[]>([]);
   async function fetchSchedulesSelection(doctorId: string) {
      const payload = new FormData();
      payload.append('limit', '100');
      if (doctorId) payload.append('doctorId', doctorId);
      const response = (await getAllSchedules(payload))?.data || [];
      const result: any = (response || [])?.[response.length - 1]?.schedules;
      setSchedules(result);
      return true;
   }
   async function fetchSchedulesTable() {
      const payload = new FormData();
      payload.append('limit', String(limit));
      payload.append('offset', String((page - 1) * limit));
      payload.append('search', search);
      const response = (await getAllSchedules(payload))?.data || [];
      const result = response || [];
      setHasNextPage(result.length === limit);
      setSchedulesTable(result);
   }
   const [formReady, setFormReady] = useState(false);

   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const limit = 10;
   const [hasNextPage, setHasNextPage] = useState(true);

   useEffect(() => {
      fetchSchedulesTable();
   }, [page]);

   const debouncedSearch = useDebounce(search, 500);
   useEffect(() => {
      setPage(1);
      fetchSchedulesTable();
   }, [debouncedSearch]);

   useEffect(() => {
      async function init() {
         const appointmentId = searchParams.get('id');

         const [doctorsData, patientsData] = await Promise.all([
            fetchDoctors(),
            fetchPatients(),
         ]);

         if (appointmentId) {
            const response = await getAppointment(appointmentId);
            const doctorId = String(response.data?.doctorId);

            if (doctorsData && patientsData) {
               setInitialValues({
                  ...response.data,
                  patientId: String(response.data?.patientId),
                  doctorId,
                  scheduleId: String(response?.data?.scheduleId),
               });

               setChosenDoctor(doctorId);

               await fetchSchedulesSelection(doctorId);
            }
         } else {
            setInitialValues({
               patientId: String(states?.user?.patientId),
               status: 'pending',
            });
         }

         await fetchSchedulesTable();

         setFormReady(true);
      }

      if (states?.user) init();
   }, [states?.user]);

   const [chosenDoctor, setChosenDoctor] = useState<any>();
   useEffect(() => {
      if (chosenDoctor) fetchSchedulesSelection(chosenDoctor);
      else setSchedules([]);
   }, [chosenDoctor]);

   const [chosenScheduleDay, setChosenScheduleDay] = useState<number>();
   const formFields: TFormProps['fields'] = useMemo(
      () =>
         formReady && states?.user
            ? [
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Pasien',
                          inputProps: {
                             name: 'patientId',
                             required: true,
                             disabled: true,
                          },
                          isSelect: true,
                          options: patients.map((patient) => ({
                             label: patient.name,
                             value: String(patient.patientId),
                          })),
                       },
                       {
                          label: 'Dokter',
                          inputProps: {
                             name: 'doctorId',
                             required: true,
                             disabled: params.mode === 'detail',
                          },
                          isSelect: true,
                          options: doctors.map((doctor) => ({
                             label: doctor.name,
                             value: String(doctor.doctorId),
                          })),
                          onChoice: (v) => setChosenDoctor(v),
                       },
                    ],
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Jadwal',
                          inputProps: {
                             name: 'scheduleId',
                             required: true,
                             disabled:
                                !chosenDoctor || params.mode === 'detail',
                          },
                          isSelect: true,
                          options: (schedules || []).map((schedule) => ({
                             label: dayOfWeekAsString(schedule?.dayOfWeek),

                             value: String(schedule?.scheduleId),
                          })),
                          onChoice: (v) =>
                             setChosenScheduleDay(
                                schedules?.find(
                                   (sched) =>
                                      Number(sched?.scheduleId) === Number(v),
                                )?.dayOfWeek,
                             ),
                       },
                       {
                          label: 'Tanggal',
                          inputProps: {
                             name: 'appointmentDate',
                             required: true,
                             type: 'date',
                             disabled:
                                params.mode === 'detail' ||
                                typeof chosenScheduleDay !== 'number',
                             onChange: (e) => {
                                if (
                                   new Date(e.target.value).getTime() <
                                      new Date().getTime() &&
                                   new Date(e.target.value).getDay() !==
                                      new Date().getDay()
                                ) {
                                   toast.info(
                                      'Tanggal harus sama atau lebih dari hari ini',
                                   );
                                   e.target.value = '';
                                   return;
                                }
                                const selected = new Date(
                                   e.target.value,
                                ).getDay();
                                const allowedDay =
                                   Number(chosenScheduleDay) >= 6
                                      ? 0
                                      : Number(chosenScheduleDay) + 1;

                                if (allowedDay !== selected) {
                                   toast.info(
                                      `Pilih tanggal dengan hari ${dayOfWeekAsString(
                                         Number(chosenScheduleDay || '0') > 6
                                            ? 0
                                            : Number(chosenScheduleDay || '0'),
                                      )}`,
                                   );
                                   e.target.value = '';
                                }
                             },
                          },
                       },
                    ],
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Waktu Mulai',
                          inputProps: {
                             name: 'startTime',
                             required: true,
                             type: 'time',
                             disabled: params.mode === 'detail',
                          },
                       },
                       {
                          label: 'Sampai',
                          inputProps: {
                             name: 'endTime',
                             type: 'time',
                             disabled: params.mode === 'detail',
                          },
                       },
                    ],
                 },
                 {
                    horizontalFieldsContainer: true,
                    fields: [
                       {
                          label: 'Keluhan',
                          inputProps: {
                             name: 'complaint',
                             type: 'text',
                             disabled: params.mode === 'detail',
                          },
                       },
                       {
                          label: 'status',
                          inputProps: {
                             name: 'status',
                             required: true,
                             disabled: true,
                          },
                          isSelect: true,
                          options: [
                             {
                                label: 'Sedang Antri',
                                value: 'pending',
                             },
                          ],
                       },
                    ],
                 },
              ]
            : [],
      [
         formReady,
         schedules,
         chosenDoctor,
         doctors,
         patients,
         states?.user,
         chosenScheduleDay,
      ],
   );

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Informasi Kunjungan</h2>
         </div>
         <div className="w-full p-8">
            {formReady && !!states?.user && (
               <>
                  <Form
                     title="Pendaftaran Jadwal Kunjungan"
                     description="Silahkan mengisi detail jadwal kunjungan"
                     submitButtonCaption={'Buat Kunjungan'}
                     fields={formFields}
                     actionCallback={onSubmit}
                     initialValues={initialValues}
                     enableSubmitButton={params.mode === 'create'}
                  />
                  {params.mode === 'detail' &&
                     String(states?.user?.patientId) ===
                        initialValues?.patientId && (
                        <div className="w-full my-4">
                           <Button
                              variant={'destructive'}
                              className=" hover:cursor-pointer"
                              type="button"
                              onClick={onDelete}
                           >
                              Hapus Kunjungan
                              <Trash2 />
                           </Button>
                        </div>
                     )}
               </>
            )}
            {params.mode === 'create' && (
               <div className="w-full my-8 text-center">
                  <h2 className="text-lg font-semibold my-4">
                     Jadwal Praktik Dokter
                  </h2>
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                     <Input
                        placeholder="Cari berdasarkan nama, keluhan, status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                     />
                  </div>
                  <Table>
                     <TableCaption>Jadwal Praktik</TableCaption>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="text-center">
                              Nama Dokter
                           </TableHead>
                           <TableHead className="text-center">Senin</TableHead>
                           <TableHead className="text-center">Selasa</TableHead>
                           <TableHead className="text-center">Rabu</TableHead>
                           <TableHead className="text-center">Kamis</TableHead>
                           <TableHead className="text-center">Jumat</TableHead>
                           <TableHead className="text-center">Sabtu</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {schedulesTable?.map((schedule: any) => (
                           <TableRow
                              key={schedule?.doctorId}
                              className="hover:cursor-pointer"
                           >
                              <TableCell className="text-center">
                                 {schedule?.doctorName}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 0,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 0,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 1,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 1,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 2,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 2,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 3,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 3,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 4,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 4,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                              <TableCell className="text-center">
                                 {`${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 5,
                                    )?.startTime || ''
                                 } - ${
                                    (schedule?.schedules as any[]).findLast(
                                       (sched) => sched?.dayOfWeek === 5,
                                    )?.endTime || ''
                                 }`}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-6">
                     <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                     >
                        Previous
                     </Button>
                     <span>Page {page}</span>
                     <Button
                        variant="outline"
                        disabled={!hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                     >
                        Next
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default Page;
