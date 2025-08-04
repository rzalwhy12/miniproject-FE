'use client';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showError } from '@/helper/interceptor';
import { apiCall } from '@/helper/apiCall';

interface IDataUser {
  name: string;
  email: string;
  username: string;
  profileImage: string;
  noTlp: string;
  birthDate: string;
  gender: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  referralCode: string;
  isVerified: boolean;
  couponDiscount: number;
  totalPoint: number;
}

const EditProfileForm = () => {
  const [form, setForm] = useState<IDataUser | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Refs
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const bankNameRef = useRef<HTMLInputElement>(null);
  const bankAccountRef = useRef<HTMLInputElement>(null);
  const holderRef = useRef<HTMLInputElement>(null);

  const getProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await apiCall.get('account/get-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = res.data.result.data;
      setForm(data);
      setImagePreview(data.profileImage);
    } catch (error) {
      showError(error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  const handleSubmit = async () => {
    const updatedData = {
      name: nameRef.current?.value || '',
      noTlp: phoneRef.current?.value || '',
      birthDate: birthRef.current?.value
        ? new Date(birthRef.current.value).toISOString()
        : null,
      gender: genderRef.current?.value || '',
      bankName: bankNameRef.current?.value || '',
      bankAccount: bankAccountRef.current?.value || '',
      accountHolder: holderRef.current?.value || ''
    };

    const token = localStorage.getItem('token');

    try {
      // 👉 API pertama: update data JSON (bukan FormData)
      const res = await apiCall.patch('account/update-data', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 👉 API kedua: upload foto (gunakan FormData)
      if (profileImageFile) {
        const imageForm = new FormData();
        imageForm.append('profileImage', profileImageFile); // field name harus sesuai di backend

        await apiCall.patch('account/update-profile-image', imageForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      toast.success(res.data.result.message);
      getProfile();
    } catch (error) {
      showError(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setProfileImageFile(file);
    }
  };

  if (!form) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-lg mt-10">
      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <div className="relative w-28 h-28">
          <img
            src={
              imagePreview ||
              'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
            }
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-4 border-white shadow"
          />
          <label className="absolute bottom-0 right-0 bg-purple-600 p-1 rounded-full cursor-pointer hover:bg-purple-700 transition">
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-white text-xs">📷</span>
          </label>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        <ReadOnlyField label="Email" value={form.email} />
        <ReadOnlyField label="Username" value={form.username} />
        <ReadOnlyField label="Referral Code" value={form.referralCode} />
        <ReadOnlyField label="Point" value={form.totalPoint.toLocaleString()} />
        <ReadOnlyField label="Kupon" value={`${form.couponDiscount || 0}%`} />

        <InputBlock
          label="Nama Lengkap"
          name="name"
          defaultValue={form.name}
          ref={nameRef}
        />
        <InputBlock
          label="No Telepon"
          name="noTlp"
          defaultValue={form.noTlp}
          ref={phoneRef}
        />
        <InputBlock
          label="Tanggal Lahir"
          name="birthDate"
          type="date"
          defaultValue={form.birthDate}
          ref={birthRef}
        />

        <div>
          <Label className="block mb-1 text-white/80">Jenis Kelamin</Label>
          <select
            name="gender"
            defaultValue={form.gender}
            ref={genderRef}
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white focus:outline-none"
          >
            <option value="" className="text-black">
              Pilih
            </option>
            <option value="MALE" className="text-black">
              Laki-laki
            </option>
            <option value="FEMALE" className="text-black">
              Perempuan
            </option>
          </select>
        </div>

        <hr className="border-white/20 my-6" />

        <InputBlock
          label="Nama Bank"
          name="bankName"
          defaultValue={form.bankName}
          ref={bankNameRef}
        />
        <InputBlock
          label="No Rekening"
          name="bankAccount"
          defaultValue={form.bankAccount}
          ref={bankAccountRef}
        />
        <InputBlock
          label="Atas Nama"
          name="accountHolder"
          defaultValue={form.accountHolder}
          ref={holderRef}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          variant="outline"
          className="text-black border-none"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

// ReadOnly
const ReadOnlyField = ({
  label,
  value
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <Label className="block mb-1 text-white/80">{label}</Label>
    <Input
      value={value}
      disabled
      className="bg-white/10 border-white/20 text-white opacity-60 cursor-not-allowed"
    />
  </div>
);

// Input Block dengan forwardRef
import { forwardRef } from 'react';
import { toast } from 'sonner';
const InputBlock = forwardRef<
  HTMLInputElement,
  {
    label: string;
    name: string;
    type?: string;
    defaultValue: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, name, type = 'text', defaultValue, ...rest }, ref) => (
  <div>
    <Label htmlFor={name} className="block mb-1 text-white/80">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      defaultValue={defaultValue}
      className="bg-white/10 border-white/20 text-white"
      ref={ref}
      {...rest}
    />
  </div>
));
InputBlock.displayName = 'InputBlock';

export default EditProfileForm;
