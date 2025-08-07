'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import VoucherSection from '@/app/create/components/VoucherSection';
import AuthOrganizer from '@/middleware/AuthOrganizer';
import BackgroundElements from './components/BackgroundElements';
import EventImageUpload from './components/EventImageUpload';
import EventBasicInfo from './components/EventBasicInfo';
import TicketSection from './components/TicketSection';
import EventDescription from './components/EventDescription';
import EventFormActions from './components/EventFormActions';
import { useState } from 'react';

const CreateEventPage = () => {
  // Local state for image file
  const [image, setImage] = useState<File | null>(null);

  return (
    <>
      {/* Auth Middleware */}
      <AuthOrganizer />
      {/* Page Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden">
        <BackgroundElements />
        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 relative z-10">
          <form className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Event Banner + Basic Info */}
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <EventImageUpload image={image} setImage={setImage} />
              <CardContent className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm">
                <EventBasicInfo />
              </CardContent>
            </Card>
            {/* Voucher */}
            <VoucherSection />
            {/* Tickets */}
            <TicketSection />
            {/* Description & Requirements */}
            <EventDescription />
            {/* Submit / Draft Buttons */}
            <EventFormActions image={image} />
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventPage;
