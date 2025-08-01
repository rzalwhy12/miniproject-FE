'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Import komponen yang sudah dipecah
import {
  EventImageUpload,
  EventBasicInfo,
  TicketSection,
  EventDescription,
  EventFormActions,
  BackgroundElements
} from '@/app/create/components';

// Import custom hooks dan utils
import { useCreateEvent } from '@/hooks/useCreateEvent';
import { submitEvent } from '@/utils/eventSubmission';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import VoucherSection from '@/app/create/components/VoucherSection';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { signIn } from '@/lib/redux/features/accountSlice';

const CreateEventPage = () => {
  const { user, loading: authLoading, login } = useAuth();
  const isLogin = useAppSelector((state) => state.account.isLogin);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Menggunakan custom hook untuk mengelola state
  const {
    form,
    tickets,
    vouchers,
    loading,
    message,
    setLoading,
    setMessage,
    handleChange,
    handleTicketChange,
    handleVoucherChange,
    addVoucher,
    removeVoucher,
    addTicket,
    removeTicket,
    resetForm
  } = useCreateEvent();

  // State untuk menunda redirect sampai pengecekan token selesai
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiCall.get('/auth/keep-login', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          dispatch(signIn(res.data.result.data));
          localStorage.setItem('user', JSON.stringify(res.data.result.data));
          login(res.data.result.data);
        } catch (error: unknown) {
          showError(error);
        }
      }
      setCheckingLogin(false);
    };
    checkLogin();
  }, [dispatch]);

  // Redirect ke login hanya setelah pengecekan login selesai
  useEffect(() => {
    if (!authLoading && !checkingLogin && !isLogin) {
      router.push('/sign-in');
    }
  }, [isLogin, authLoading, checkingLogin, router]);

  // Show loading screen while checking authentication
  if (authLoading || checkingLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Don't render the form if not authenticated (will redirect)
  if (!isLogin) {
    return null;
  }

  // Handler untuk Launch Event (Publish)
  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEvent(
      { ...form, statusEvent: 'PUBLISHED' },
      tickets,
      user,
      setLoading,
      setMessage,
      resetForm
    );
  };

  // Handler untuk Save Draft
  const handleDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    await submitEvent(
      { ...form, statusEvent: 'DRAFT' },
      tickets,
      user,
      setLoading,
      setMessage,
      resetForm
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden">
      <BackgroundElements />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 relative z-10">
        <form
          onSubmit={handleLaunch}
          className="space-y-6 sm:space-y-8 md:space-y-10"
        >
          {/* Hero Section with Image Upload */}
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
            <EventImageUpload image={form.image} onImageChange={handleChange} />
            {/* Event Basic Info */}
            <CardContent className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm">
              <EventBasicInfo form={form} onChange={handleChange} />
            </CardContent>
          </Card>

          {/* Voucher Section (standalone card) */}
          <VoucherSection
            vouchers={vouchers}
            handleVoucherChange={handleVoucherChange}
            addVoucher={addVoucher}
            removeVoucher={removeVoucher}
          />

          {/* Tickets Section */}
          <TicketSection
            tickets={tickets}
            onTicketChange={handleTicketChange}
            onAddTicket={addTicket}
            onRemoveTicket={removeTicket}
          />

          {/* Description Section */}
          <EventDescription
            description={form.description}
            syaratKetentuan={form.syaratKetentuan}
            onDescriptionChange={(val) =>
              handleChange({
                target: { name: 'description', value: val }
              } as React.ChangeEvent<HTMLInputElement>)
            }
            onSyaratChange={(val) =>
              handleChange({
                target: { name: 'syaratKetentuan', value: val }
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Action Buttons and Message */}
          <EventFormActions
            loading={loading}
            message={message}
            onLaunch={handleLaunch}
            onDraft={handleDraft}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
