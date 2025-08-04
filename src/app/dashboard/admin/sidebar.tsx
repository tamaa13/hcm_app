import {
   Calendar,
   BookCheckIcon,
   Bed,
   History,
   PersonStanding,
} from 'lucide-react';

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/services/auth.service';
import Image from 'next/image';

// Menu items.
const items = [
   {
      title: 'Kunjungan',
      url: '/dashboard/admin/appointment',
      icon: BookCheckIcon,
   },
   {
      title: 'Pasien',
      url: '/dashboard/admin/patient',
      icon: Bed,
   },
   {
      title: 'Jadwal Praktik Dokter',
      url: '/dashboard/admin/schedule',
      icon: Calendar,
   },
   {
      title: 'Histori Medis',
      url: '/dashboard/admin/medicalRecords',
      icon: History,
   },
   {
      title: 'Register Admin/Dokter',
      url: '/dashboard/admin/registration',
      icon: PersonStanding,
   },
];

export function DashboardSidebar() {
   return (
      <Sidebar>
         <SidebarHeader className="w-full flex items-center justify-center py-24">
            <div>
               <Image
                  src={`/hcm_logo.png`}
                  alt="LOGO"
                  width={160}
                  height={160}
               />
            </div>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel className="px-4 text-base">
                  Menu
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="px-4">
                           <SidebarMenuButton asChild>
                              <Link href={item.url}>
                                 <item.icon />
                                 <span className="text-base">{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter className="w-full flex items-center justify-center my-8">
            <form action={signOut}>
               <Button variant={'destructive'} className="hover:cursor-pointer">
                  Signout
               </Button>
            </form>
         </SidebarFooter>
      </Sidebar>
   );
}
