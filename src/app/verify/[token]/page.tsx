'use client';

import { Button } from '@/components/ui/button';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { hideLoading, showLoading } from '@/lib/redux/features/loadingSlice';
import { useAppDispatch } from '@/lib/redux/hook';
import { Mail } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const verifyPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const btVerify = async () => {
    try {
      dispatch(showLoading());
      const res = await apiCall.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${params.token}`
        }
      });
      dispatch(hideLoading());
      toast.success(res.data.result.message);
      router.push('/');
    } catch (error: unknown) {
      dispatch(hideLoading());
      showError(error);
    }
  };

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
          Klik tombol di bawah ini untuk memverifikasi email Anda.
        </p>
        <Button className="w-full" onClick={btVerify}>
          Verifikasi Sekarang
        </Button>
      </div>
    </div>
  );
};

export default verifyPage;
