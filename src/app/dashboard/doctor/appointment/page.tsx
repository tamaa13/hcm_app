'use client';

import { Button } from '@/components/ui/button';
import {
   Table,
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from '@/components/ui/table';
import {
   getAllAppointments,
   getAppointmentTotals,
} from '@/services/appointments.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function Page() {
   const router = useRouter();

   const [appointments, setAppointments] = useState<any[]>([]);
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const limit = 10;
   const [hasNextPage, setHasNextPage] = useState(true);

   const [appointmentTotals, setAppointmentTotals] = useState<any[]>([]);
   async function fetchAppointmentTotals() {
      const response = await getAppointmentTotals();

      setAppointmentTotals(response.data || []);
   }

   async function fetchAppointments() {
      const payload = new FormData();
      payload.append('limit', String(limit));
      payload.append('offset', String((page - 1) * limit));
      payload.append('search', search);
      payload.append('status', 'pending|treating');

      const result = (await getAllAppointments(payload))?.data || [];

      setAppointments(result);
      setHasNextPage(result.length === limit);
   }

   useEffect(() => {
      fetchAppointmentTotals();
   }, []);

   useEffect(() => {
      fetchAppointments();
   }, [page]);

   const debouncedSearch = useDebounce(search, 500);
   useEffect(() => {
      setPage(1);
      fetchAppointments();
   }, [debouncedSearch]);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Kunjungan</h2>
         </div>
         <div className="w-full p-8 flex items-center justify-center gap-8 overflow-x-scroll">
            {appointmentTotals?.map((total) => (
               <Card key={`appointment-total-${total?.status}`}>
                  <CardContent className="flex flex-col items-center justify-center px-12 py-4 gap-4">
                     <p className="text-xl">{total?.count || 0}</p>
                     <Badge
                        className={`h-5 min-w-5 rounded-full px-1  tabular-nums p-4 ${
                           total?.status === 'pending'
                              ? 'bg-pink-800'
                              : total?.status === 'treating'
                              ? 'bg-orange-800'
                              : total?.status === 'payment'
                              ? 'bg-yellow-800'
                              : 'bg-green-800'
                        }`}
                     >
                        {total?.status}
                     </Badge>
                  </CardContent>
               </Card>
            ))}
         </div>
         <div className="w-full h-full overflow-scroll p-8">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
               <Input
                  placeholder="Cari berdasarkan nama, keluhan, status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
               />
               {/* <Link href={`/dashboard/doctor/appointment/create`}>
                  <Button className="hover:cursor-pointer">
                     Buat Kunjungan
                  </Button>
               </Link> */}
            </div>
            <div className="w-full text-center">
               <h2 className="text-lg font-semibold my-4">List Kunjungan</h2>
               <Table>
                  <TableCaption>List Kunjungan</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="text-center">No</TableHead>
                        <TableHead className="text-center">Pasien</TableHead>
                        <TableHead className="text-center">Tanggal</TableHead>
                        <TableHead className="text-center">Jam</TableHead>
                        <TableHead className="text-center">Keluhan</TableHead>
                        <TableHead className="text-center">
                           Status Kunjungan
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {appointments.map((appointment, i) => (
                        <TableRow
                           key={appointment.appointmentId}
                           className="hover:cursor-pointer"
                           onClick={() =>
                              router.push(
                                 `/dashboard/doctor/appointment/detail?id=${appointment.appointmentId}`,
                              )
                           }
                        >
                           <TableCell className="text-center">
                              {i + 1 + (page - 1) * limit}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment?.patient?.name || ''}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment?.appointmentDate || ''}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${appointment?.startTime || ''} - ${
                                 appointment?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment?.complaint || ''}
                           </TableCell>
                           <TableCell className="text-center">
                              {appointment?.status || ''}
                           </TableCell>
                           {i === 0 && page === 1 && !search && (
                              <TableCell className="text-center">
                                 <Button
                                    className="hover:cursor-pointer"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       router.push(
                                          `/dashboard/doctor/appointment/treat?id=${appointment.appointmentId}`,
                                       );
                                    }}
                                 >
                                    Periksa
                                 </Button>
                              </TableCell>
                           )}
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
