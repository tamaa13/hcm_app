'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { getPatients } from '@/services/patients.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
   const router = useRouter();
   const [patients, setPatients] = useState<any[]>([]);
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const limit = 10;
   const [hasNextPage, setHasNextPage] = useState(true);

   async function fetchPatients() {
      const payload = new FormData();
      payload.append('limit', String(limit));
      payload.append('offset', String((page - 1) * limit));
      payload.append('search', search);

      const result = (await getPatients(payload))?.data || [];

      setPatients(result);
      setHasNextPage(result.length === limit);
   }

   useEffect(() => {
      fetchPatients();
   }, [page]);

   const debouncedSearch = useDebounce(search, 500);
   useEffect(() => {
      setPage(1);
      fetchPatients();
   }, [debouncedSearch]);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center">
         <div className="w-full p-8">
            <h2 className="text-lg font-bold">Pasien</h2>
         </div>
         <div className="w-full h-full overflow-scroll p-8">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
               <Input
                  placeholder="Cari berdasarkan nama"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
               />
               <Link href={'/dashboard/nurse/patient/create'}>
                  <Button className="hover:cursor-pointer">
                     Tambah Pasien
                  </Button>
               </Link>
            </div>

            <div className="w-full h-full overflow-scroll">
               <div className="w-full text-center">
                  <h2 className="text-xl font-semibold">List Pasien</h2>
                  <Table>
                     <TableCaption>List Pasien</TableCaption>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="text-center">No</TableHead>
                           <TableHead className="text-center">
                              No. Registrasi
                           </TableHead>
                           <TableHead className="text-center">Nama</TableHead>
                           <TableHead className="text-center">
                              Jenis Kelamin
                           </TableHead>
                           <TableHead className="text-center">Alamat</TableHead>
                           <TableHead className="text-center">Kontak</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {patients?.map((patient, i) => (
                           <TableRow
                              key={patient.patientId}
                              className="hover:cursor-pointer"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/nurse/patient/detail?id=${patient.patientId}`,
                                 )
                              }
                           >
                              <TableCell className="text-center">
                                 {i + 1}
                              </TableCell>
                              <TableCell className="text-center">
                                 {patient.patientId}
                              </TableCell>
                              <TableCell className="text-center">
                                 {patient.name}
                              </TableCell>
                              <TableCell className="text-center">
                                 {patient.gender}
                              </TableCell>
                              <TableCell className="text-center">
                                 {patient.address}
                              </TableCell>
                              <TableCell className="text-center">
                                 {patient.phoneNumber}
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
