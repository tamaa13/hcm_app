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
import { useDebounce } from '@/hooks/useDebounce';
import { getMedicalRecords } from '@/services/medicalRecords.service';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
   const router = useRouter();
   const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const limit = 10;
   const [hasNextPage, setHasNextPage] = useState(true);

   async function fetchMedicalRecords() {
      const payload = new FormData();
      payload.append('limit', String(limit));
      payload.append('offset', String((page - 1) * limit));
      payload.append('search', search);

      const result = (await getMedicalRecords(payload))?.data || [];

      setMedicalRecords(result);
      setHasNextPage(result.length === limit);
   }

   useEffect(() => {
      fetchMedicalRecords();
   }, [page]);

   const debouncedSearch = useDebounce(search, 500);
   useEffect(() => {
      setPage(1);
      fetchMedicalRecords();
   }, [debouncedSearch]);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Histori Medis</h2>
         </div>
         <div className="w-full h-full overflow-scroll p-8">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
               <Input
                  placeholder="Cari kata kunci"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
               />
               {/* <Link href={'/dashboard/nurse/medicalRecords/create'}>
                  <Button className="hover:cursor-pointer">
                     Tambah Pasien
                  </Button>
               </Link> */}
            </div>

            <div className="w-full h-full overflow-scroll">
               <div className="w-full text-center">
                  <h2 className="text-xl font-semibold">List Histori Medis</h2>
                  <Table>
                     <TableCaption>List Histori Medis</TableCaption>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="text-center">No</TableHead>
                           <TableHead className="text-center">
                              Kode Kunjungan
                           </TableHead>
                           <TableHead className="text-center">Pasien</TableHead>
                           <TableHead className="text-center">Dokter</TableHead>
                           <TableHead className="text-center">
                              Diagnosis
                           </TableHead>
                           <TableHead className="text-center">Biaya</TableHead>
                           <TableHead className="text-center">
                              Status Pembayaran
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {medicalRecords?.map((medicalRecord, i) => (
                           <TableRow
                              key={`medicalRecord?.medical_records?.recordId-${medicalRecord?.medical_records?.recordId}-${i}`}
                              className="hover:cursor-pointer"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/nurse/medicalRecords/detail?id=${medicalRecord?.medical_records?.recordId}`,
                                 )
                              }
                           >
                              <TableCell className="text-center">
                                 {i + 1}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.appointments?.appointmentId ||
                                    ''}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.patients?.name || ''}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.doctors?.name}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.medical_records?.diagnosis ||
                                    ''}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.medical_records?.totalFee ||
                                    ''}
                              </TableCell>
                              <TableCell className="text-center">
                                 {medicalRecord?.medical_records
                                    ?.paymentStatus || ''}
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
      </div>
   );
}

export default Page;
