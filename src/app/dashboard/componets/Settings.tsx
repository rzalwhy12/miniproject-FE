'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onBtChangePassword = async () => {
    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Semua field harus diisi!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await apiCall.patch(
        'account/update-password',
        {
          oldPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(res.data.result.message);
      oldPasswordRef.current!.value = '';
      newPasswordRef.current!.value = '';
      confirmPasswordRef.current!.value = '';
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (
    label: string,
    id: string,
    inputRef: React.RefObject<HTMLInputElement | null>,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <div>
      <Label htmlFor={id} className="text-white/80">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          ref={inputRef}
          className="bg-white/10 border-white/20 text-white mt-1 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white/10 border border-white/20 rounded-2xl shadow-xl mt-10 backdrop-blur">
      <h2 className="text-xl font-bold text-white mb-6">Ubah Password</h2>

      <div className="space-y-4">
        {renderPasswordField(
          'Password Lama',
          'oldPassword',
          oldPasswordRef,
          showOld,
          setShowOld
        )}
        {renderPasswordField(
          'Password Baru',
          'newPassword',
          newPasswordRef,
          showNew,
          setShowNew
        )}
        {renderPasswordField(
          'Konfirmasi Password Baru',
          'confirmPassword',
          confirmPasswordRef,
          showConfirm,
          setShowConfirm
        )}

        <div className="flex justify-end mt-6">
          <Button
            onClick={onBtChangePassword}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Menyimpan...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
