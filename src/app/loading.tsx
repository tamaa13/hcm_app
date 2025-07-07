'use client';
import { ClipLoader } from 'react-spinners';

export default function Loading() {
   return (
      <div className="w-screen h-screen flex items-center justify-center">
         <ClipLoader color="#000000" size={60} />
      </div>
   );
}
