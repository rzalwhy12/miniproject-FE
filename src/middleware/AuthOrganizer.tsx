'use client';
import { useAppSelector } from '@/lib/redux/hook';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLogin from './Auth';
import { toast } from 'sonner';

const AuthOrganizer = () => {
  const router = useRouter();
  const { role, checking } = useAppSelector((state) => state.account);

  useEffect(() => {
    // Jangan lakukan apa pun sampai proses pengecekan selesai
    if (!checking && role && role !== 'ORGANIZER') {
      router.replace('/');
    }
  }, [role, checking]);

  return <AuthLogin />;
};

export default AuthOrganizer;
