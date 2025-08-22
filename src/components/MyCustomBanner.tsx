"use client"
import React, { useEffect, useState } from "react";
import { apiCall } from '@/helper/apiCall';

type Event = {
  id: number;
  name: string;
  banner: string;
  transactionCount: number;
  location: string;
  startDate: string;
  city: string;
};

const MyCustomBanner: React.FC<{ onLoaded?: () => void }> = ({ onLoaded }) => {
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('CustomBanner mounted');

  useEffect(() => {
    console.log('CustomBanner useEffect dijalankan');
    apiCall.get('/event')
      .then(res => {
        console.log('CustomBanner API response:', res);
        const events = res.data?.result?.data || [];
        const sortedEvents = events.sort((a: any, b: any) => (b.transactionCount || 0) - (a.transactionCount || 0));
        setTopEvents(sortedEvents.slice(0, 3));
        setLoading(false);
        onLoaded?.();
        console.log('CustomBanner loading selesai');
      })
      .catch((error) => {
        console.log('CustomBanner API error:', error);
        setLoading(false);
        onLoaded?.();
        console.log('CustomBanner loading error');
      });
  }, []); // Remove onLoaded dependency

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Banner Atas */}
      <div className="w-full flex justify-center">
        <img
          src="/images/banner/banner5.png"
          alt="Banner Promo"
          className="rounded-2xl w-full max-w-7xl h-auto min-h-[100px] md:h-[200px] object-cover"
        />
      </div>

      {/* Top Events */}
      <div className="w-full bg-gray-800 py-10">
        <div className=" px-2">
          <h2 className="text-white max-w-7xl mx-auto text-2xl font-bold mb-6">Top Events</h2>
          {loading ? (
            <div className="text-center py-10 text-lg text-white">Loading top events...</div>
          ) : topEvents.length === 0 ? (
            <div className="text-center py-10 text-lg text-white">No top events found.</div>
          ) : (
            <div className="flex flex-col gap-6 md:flex-row md:gap-8 justify-center">
              {topEvents.map((event, idx) => (
                <div key={event.id} className="flex flex-row items-center gap-4 w-full md:w-auto">
                  <span className="text-[96px] font-extrabold leading-none drop-shadow-lg text-white">
                    {idx + 1}
                  </span>
                  <img
                    src={event.banner}
                    alt={event.name}
                    className="rounded-xl w-[300px] h-[180px] object-cover shadow-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Banner Bawah */}
      <div className="w-full flex justify-center">
        <img
          src="/images/banner/banner5.png"
          alt="Banner Promo Bawah"
          className="rounded-2xl w-full max-w-7xl h-auto min-h-[100px] md:h-[200px] object-cover pb-7"
        />
      </div>
    </div>
  );
};

export default MyCustomBanner;