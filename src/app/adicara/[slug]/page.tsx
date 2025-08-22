// src/app/adicara/[slug]/page.tsx
// Ini adalah Server Component, tidak perlu 'use client'

import React from 'react';
import { EventDetail } from '@/types/types'; // Pastikan path benar

// Import Client Component
import EventDetailsClient from './componets/EventDetailsClient';

// Next.js 15: params is a Promise in page props. Await it before use.

async function getEventData(slug: string): Promise<EventDetail | null> {
  try {
    // Fetch data from the backend API using the slug
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_DATABASE}/event/${slug}`, {
      cache: 'no-store', // Ensures we get fresh data on every request
    });

    if (!res.ok) {
      console.error(`Failed to fetch event data for slug: ${slug}. Status: ${res.status}`);
      // This will be caught by the !eventData check below and show the error message.
      return null;
    }

    const responseData = await res.json();

    // Data event bisa ada di field 'data' atau 'result' tergantung backend
    if (responseData && (responseData.data || responseData.result)) {
      const event = responseData.data || responseData.result;
      return event;
    } else {
      console.error('Event data not found in the expected format in the response.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching event details in Server Component:', error);
    return null;
  }
}

const EventDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const eventData = await getEventData(slug);

  if (!eventData) {
    // Anda bisa merender halaman 404 custom atau pesan error
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Event tidak ditemukan atau terjadi kesalahan saat memuat data.
      </div>
    );
  }

  // Extract the actual event object if wrapped in a 'data' field
  const rawEvent = (eventData && (eventData as any).data) ? (eventData as any).data : eventData;
  // Ensure ticketTypes is always an array to prevent client-side errors
  const safeEventData = {
    ...rawEvent,
    ticketTypes: Array.isArray(rawEvent.ticketTypes) ? rawEvent.ticketTypes : [],
  };
  // Pass the sanitized data to the Client Component
  return <EventDetailsClient eventData={safeEventData} />;
};

export default EventDetailPage;
