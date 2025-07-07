import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
   return (
      <div className="w-screen h-full lg:h-screen flex flex-col items-center justify-center overflow-y-scroll">
         <div className="my-16">
            <h1 className="text-lg xl:text-xl 2xl:text-2xl font-bold">
               Choose your preferred account type
            </h1>
         </div>
         <div className="flex items-center justify-center gap-8 w-full flex-wrap">
            <Link
               href="/auth/registration/patient"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Patient</CardTitle>
                     <CardDescription>
                        Use this type of account if you want to have a
                        consultation appointment
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/user.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </Link>
            <Link
               href="/auth/registration/nurse"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Admin</CardTitle>
                     <CardDescription>
                        Use this type of account if you are an administrator
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/admin.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </Link>
            <Link
               href="/auth/registration/doctor"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Doctor</CardTitle>
                     <CardDescription>
                        Use this type of account if you are a doctor
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/doctor.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </Link>
         </div>
      </div>
   );
}
