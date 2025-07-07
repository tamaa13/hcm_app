import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import GlobalProvider from './globalProvider';

// const geistSans = Geist({
//    variable: '--font-geist-sans',
//    subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//    variable: '--font-geist-mono',
//    subsets: ['latin'],
// });

export const metadata: Metadata = {
   title: 'HCM App',
   description: 'A Health Consultation Management App',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="dark">
         <body className={` antialiased`}>
            <GlobalProvider>{children}</GlobalProvider>
         </body>
      </html>
   );
}
