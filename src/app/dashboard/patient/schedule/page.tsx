'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Table,
} from '@/components/ui/table';
import { getAllSchedules } from '@/services/schedules.service';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

function Page() {
   const router = useRouter();
   const [schedules, setSchedules] = useState<any[]>([]);
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const limit = 10;
   const [hasNextPage, setHasNextPage] = useState(true);

   async function fetchSchedules() {
      const payload = new FormData();
      payload.append('limit', String(limit));
      payload.append('offset', String((page - 1) * limit));
      payload.append('search', search);

      const result = (await getAllSchedules(payload))?.data || [];

      setSchedules(result);
      setHasNextPage(result.length === limit);
   }

   useEffect(() => {
      fetchSchedules();
   }, [page]);

   const debouncedSearch = useDebounce(search, 500);
   useEffect(() => {
      setPage(1);
      fetchSchedules();
   }, [debouncedSearch]);

   return (
      <div className="w-full h-full overflow-scroll ">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Jadwal</h2>
         </div>
         <div className="w-full h-full overflow-scroll p-8">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
               <Input
                  placeholder="Cari berdasarkan nama dokter"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
               />
            </div>
            <div className="w-full text-center">
               <h2 className="text-lg font-semibold my-4">
                  Jadwal Praktik Dokter
               </h2>

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
                     {schedules?.map((schedule: any) => (
                        <TableRow key={schedule?.doctorId}>
                           <TableCell className="text-center">
                              {schedule?.doctorName}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 0,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 0,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 0,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 1,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 1,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 1,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 2,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 2,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 2,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 3,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 3,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 3,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 4,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 4,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 4,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell
                              className="text-center hover:cursor-pointer"
                              onClick={() => {
                                 const scheduleId = (
                                    schedule.schedules as any[]
                                 ).findLast(
                                    (sched) => sched.dayOfWeek === 5,
                                 )?.scheduleId;
                                 if (scheduleId)
                                    router.push(
                                       `/dashboard/patient/schedule/detail?id=${scheduleId}`,
                                    );
                              }}
                           >
                              {`${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 5,
                                 )?.startTime || ''
                              } - ${
                                 (schedule.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 5,
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
         </div>
      </div>
   );
}

export default Page;
