import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './sidebar';
import { Breadcrumbs } from '@/components/custom/breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <SidebarProvider>
         <DashboardSidebar />
         <main className="w-full">
            <div className="w-full p-8 flex items-center justify-between sticky top-0 bg-background z-10">
               <Breadcrumbs />
               <div className="text-slate-300">
                  {new Date().toLocaleDateString('id', {
                     weekday: 'long',
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric',
                     timeZone: 'UTC',
                  })}
               </div>
            </div>
            <SidebarTrigger className="hover:cursor-pointer scale-200 ml-8 mt-8" />
            {children}
         </main>
      </SidebarProvider>
   );
}
