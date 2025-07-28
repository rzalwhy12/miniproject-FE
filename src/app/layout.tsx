
'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/Footer';

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
  const pathname = usePathname();
  const hideNavAndFooter = pathname === '/signin' || pathname === '/signup';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {!hideNavAndFooter && <Navbar />}
          {children}
          {!hideNavAndFooter && <Footer />}
        </StoreProvider>
      </body>
    </html>
  );
}
