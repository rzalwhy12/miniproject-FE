import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';
import { ShowFooter } from '@/components/Footer';

import LoadingAnimation from '@/components/Loading';
import { ShowNavbar } from '@/components/navbar';
import KeepLoginProvider from '@/middleware/KeepLogin';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
          <KeepLoginProvider />
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ShowNavbar />
            <LoadingAnimation />
            {children}
            <Toaster richColors position="top-right" />
            <ShowFooter />
          </body>
      </StoreProvider>
    </html>
  );
}
