'use client';

import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showError } from '@/helper/interceptor';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';
import RequestResetPassword from './components/RequestResetEmail';
import { useParams } from 'next/navigation';

const ForgetPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [showReqEmail, setShowReqEmail] = useState(false);

  const onBtSendEmail = async () => {
    try {
      if (!emailRef.current?.value) {
        toast.warning('field required');
        return;
      }
      const res = await apiCall.post('/auth/forget-password', {
        email: emailRef.current.value
      });

      if (res.data.result.success) {
        setShowReqEmail(true);
      }
    } catch (error) {
      showError(error);
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-2xl rounded-xl space-y-6 my-24">
        <h2 className="text-2xl font-semibold text-center">Lupa Password</h2>

        {/* Keterangan tambahan */}
        <p className="text-sm text-gray-600 text-center">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan link untuk
          mengatur ulang password kamu.
        </p>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="my-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="masukkan email kamu"
              ref={emailRef}
              required
            />
          </div>
          <Button type="button" className="w-full" onClick={onBtSendEmail}>
            Kirim Link Reset
          </Button>
        </form>
      </div>
      {showReqEmail && <RequestResetPassword />}
    </>
  );
};

export default ForgetPassword;
