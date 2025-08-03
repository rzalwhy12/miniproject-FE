'use client';

import React, { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiCall } from '@/helper/apiCall';
import { useParams, useRouter } from 'next/navigation';
import { showError } from '@/helper/interceptor';

const ResetPassword = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const param = useParams();
  const router = useRouter();

  const onBtResetPassword = async () => {
    try {
      const password = passwordRef.current?.value;
      const confirmPassword = confirmPasswordRef.current?.value;

      if (!password || !confirmPassword) {
        toast.warning('Semua field wajib diisi');
        return;
      }

      if (password !== confirmPassword) {
        toast.warning('Password dan konfirmasi tidak cocok');
        return;
      }

      const res = await apiCall.post(
        '/auth/reset-password',
        { password: password },
        {
          headers: {
            Authorization: `Bearer ${param.token}`
          }
        }
      );

      toast.success(res.data.result.message);

      router.push('/sign-in');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-xl space-y-6 my-12">
      <h2 className="text-2xl font-semibold text-center">
        Atur Ulang Password
      </h2>

      <p className="text-gray-600 text-sm text-center">
        Silakan masukkan password baru dan konfirmasi ulang. Pastikan kamu
        memilih password yang kuat dan mudah diingat.
      </p>

      <form className="space-y-4">
        {/* Password */}
        <div className="relative">
          <Label htmlFor="password">Password Baru</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan password baru"
            ref={passwordRef}
            required
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 my-2"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Ulangi password"
            ref={confirmPasswordRef}
            required
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 my-2"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </div>
        </div>

        <Button type="button" className="w-full" onClick={onBtResetPassword}>
          Simpan Password Baru
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
