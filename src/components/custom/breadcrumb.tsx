'use client';
import Link from 'next/link';
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
   const pathName = usePathname();

   // Remove empty strings and split the pathname
   const pathSegments = pathName.split('/').filter(Boolean);

   // Build cumulative paths
   const breadcrumbs = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      return { segment, href };
   });

   return (
      <Breadcrumb>
         <BreadcrumbList>
            {breadcrumbs.map(({ segment, href }) => (
               <BreadcrumbItem key={href}>
                  /
                  <BreadcrumbLink asChild>
                     <Link href={href} className="text-base">
                        {decodeURIComponent(segment)}
                     </Link>
                  </BreadcrumbLink>
               </BreadcrumbItem>
            ))}
         </BreadcrumbList>
      </Breadcrumb>
   );
}
