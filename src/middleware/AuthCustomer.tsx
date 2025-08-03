'use client';
import { useAppSelector } from '@/lib/redux/hook';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLogin from './Auth';

const AuthCustomer = () => {
  const router = useRouter();
  const role = useAppSelector((state) => state.account.role);

  useEffect(() => {
    if (role && role !== 'CUSTOMER') {
      router.replace('/');
    }
  }, [role]);

  return <AuthLogin />;
};

export default AuthCustomer;
