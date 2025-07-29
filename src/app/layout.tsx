import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';

import { ShowFooter } from '@/components/Footer';
import { ShowNavbar } from '@/components/Navbar';

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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ShowNavbar />
          {children}
          <ShowFooter />
        </body>
      </StoreProvider>
    </html>
  );
}
