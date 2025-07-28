
'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from'@/components/Navbar' ;
import StoreProvider from './StoreProvider';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

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
