'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hook';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { Card, CardContent } from '@/components/ui/card';

import AuthOrganizer from '@/middleware/AuthOrganizer';
import BackgroundElements from './components/BackgroundElements';
import EventImageUpload from './components/EventImageUpload';
import EventBasicInfo from './components/EventBasicInfo';
import TicketSection from './components/TicketSection';
import EventDescription from './components/EventDescription';
import VoucherSection from './components/VoucherSection';
import EventFormActions from './components/EventFormActions';

import { setEditEventForm } from '@/lib/redux/features/editEventSlice';

const EditEventPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = params.slug;

  const [image, setImage] = useState<File | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const res = await apiCall.get(`/event/edit/${slug}`, { headers });
        const data = res.data.result.data;

        // Ambil banner sebagai File
        if (data.banner) {
          const fileFromURL = await fetch(data.banner)
            .then((r) => r.blob())
            .then(
              (blob) =>
                new File([blob], 'event-banner.jpg', {
                  type: blob.type
                })
            );
          setImage(fileFromURL);
        }

        // Dispatch ke slice editEvent
        dispatch(
          setEditEventForm({
            eventId: data.id,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            category: data.category,
            description: data.description,
            syaratKetentuan: data.syaratKetentuan,
            tickets: data.tickets,
            vouchers: data.vouchers
          })
        );
      } catch (error) {
        showError(error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEvent();
  }, [dispatch, slug]);

  if (initialLoading) {
    return <div className="text-center mt-20">Loading event data...</div>;
  }

  return (
    <>
      <AuthOrganizer />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden">
        <BackgroundElements />
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 relative z-10">
          <form className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Banner + Info */}
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <EventImageUpload image={image} setImage={setImage} />
              <CardContent className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm">
                <EventBasicInfo />
              </CardContent>
            </Card>

            <VoucherSection />
            <TicketSection />
            <EventDescription />
            <EventFormActions image={image} />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
