'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import {
  createEventForm,
  resetEventForm
} from '@/lib/redux/features/createEvenSlice';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { toast } from 'sonner';


interface EventFormActionsProps {
  image: File | null;
}

const EventFormActions: React.FC<EventFormActionsProps> = ({ image }) => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.createEvent);
  const user = useAppSelector((state) => state.account);

  const obBtSubmit = async (eventStatus: 'DRAFT' | 'PUBLISHED') => {
    dispatch(createEventForm({ loading: true, message: '' }));

    try {
      const token = localStorage.getItem('token');
      if (!image) {
        toast.warning('banner required');
        return;
      }
      const formData = new FormData();
      formData.append('banner', image);

      const payload = {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        category: form.category,
        description: form.description,
        syaratKetentuan: form.syaratKetentuan,
        eventStatus,
        ticketTypes: form.tickets,
        vouchers: form.vouchers
      };

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const res = await apiCall.post('/event/create', payload, { headers });

      const upload = await apiCall.patch(
        `/event/banner/${res.data.result.data.id}`,
        formData,
        { headers }
      );

      if (res.data.result.success) {
        toast.success(res.data.result.message);
      }

      dispatch(resetEventForm());
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8">
        <div className="flex items-center text-gray-600">
          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
          <p className="text-sm">Ready to launch your extraordinary event?</p>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => obBtSubmit('DRAFT')}
            variant="outline"
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={() => obBtSubmit('PUBLISHED')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg px-8 py-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center">
              {form.loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Launch Event
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {form.message && (
        <div
          className={`p-6 rounded-xl backdrop-blur-sm border shadow-lg mt-6 ${
            form.message.includes('berhasil') ||
            form.message.includes('success')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          <div className="flex items-start">
            {form.message.includes('berhasil') ||
            form.message.includes('success') ? (
              <Sparkles className="w-5 h-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Zap className="w-5 h-5 mr-3 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-medium block">{form.message}</span>
              {form.message.includes('server berjalan') && (
                <span className="text-sm mt-1 block opacity-80">
                  Pastikan backend server sudah dijalankan dan dapat diakses.
                </span>
              )}
              {form.message.includes('login') && (
                <span className="text-sm mt-1 block opacity-80">
                  Silakan refresh halaman dan login kembali.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventFormActions;
