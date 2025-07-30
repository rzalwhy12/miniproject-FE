'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const VerifyEmail = () => {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-xl relative animate-fade-in">
        <div className="flex justify-center mb-4">
          <Mail className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Verifikasi Email Anda
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Kami telah mengirimkan tautan verifikasi ke alamat email Anda. Silakan
          periksa kotak masuk atau folder spam Anda untuk melanjutkan.
        </p>
        <Button
          asChild
          className="w-full cursor-pointer  focus:ring-pink-400"
          onClick={() => router.push('/')}
        >
          <span>Kembali ke Beranda</span>
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
