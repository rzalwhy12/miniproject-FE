'use client';

import React from 'react';
import { KeyRound } from 'lucide-react'; // Icon lebih relevan untuk reset password
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const RequestResetPassword = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-xl relative animate-fade-in">
        <div className="flex justify-center mb-4">
          <KeyRound className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Link Reset Password Dikirim
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Kami telah mengirimkan tautan untuk mengatur ulang password ke alamat
          email kamu. Silakan cek kotak masuk atau folder spam untuk melanjutkan
          proses reset password.
        </p>
        <Button
          className="w-full cursor-pointer focus:ring-indigo-400"
          onClick={() => router.push('/')}
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default RequestResetPassword;
