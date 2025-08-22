'use client';
import { useAppSelector } from '@/lib/redux/hook';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLogin from './Auth';

const AuthOrganizer = () => {
  const router = useRouter();
  const { role, checking } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!checking && role && role !== 'ORGANIZER') {
      router.replace('/');
    }
  }, [role, checking]);

  return <AuthLogin />;
};

export default AuthOrganizer;
