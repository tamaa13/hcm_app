import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
   const path = request.nextUrl.pathname;
   const token = request.cookies.get('token');
   const role = request.cookies.get('role');

   if (token && role && !path.includes(`${role?.value}`)) {
      return NextResponse.redirect(
         new URL(
            `/dashboard/${role?.value}${
               role?.value === 'patient' ? '/appointment' : ''
            }`,
            request.url,
         ),
      );
   }

   if (!token && !path.includes('auth'))
      return NextResponse.redirect(new URL('/auth/signin', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
