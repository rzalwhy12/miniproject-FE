// src/app/adicara/[slug]/page.tsx
// Ini adalah Server Component, tidak perlu 'use client'

import React from 'react';
import { EventDetail } from '@/types/types'; // Pastikan path benar

// Import Client Component
import EventDetailsClient from '@/components/EventDetailsClient';

interface EventDetailPageProps {
    params: {
        slug: string;
    };
}

async function getEventData(slug: string): Promise<EventDetail | null> {
    try {
        const dummyEventData: EventDetail = {
            id: 196,
            name: "Lamine Yamal Fest",
            slug: slug,
            banner: "https://res.cloudinary.com/dobmhsgob/image/upload/v1754234554/zszqxjuood6rcu9q20mz.webp",
            description: "<p>Ini adalah deskripsi acara <strong>Lamine Yamal Fest</strong> yang spektakuler. Akan ada banyak musisi terkenal dan pengalaman tak terlupakan!</p>",
            syaratKetentuan: "<h2>Syarat dan Ketentuan Lamine Yamal Fest</h2><p>1. Tiket yang sudah dibeli tidak dapat dikembalikan.</p><p>2. Wajib membawa identitas diri.</p><p>3. Dilarang membawa makanan/minum dari luar.</p><p>4. Jaga kebersihan dan ketertiban.</p>",
            startDate: "2025-08-03T15:21:00.000Z",
            endDate: "2025-08-03T15:21:00.000Z",
            location: "Surabaya",
            organizer: "User",
            ticketTypes: [
                { id: 1, name: "Reguler", price: "150000", description: "Tiket reguler", stock: 100 },
                { id: 2, name: "VIP", price: "350000", description: "Tiket VIP", stock: 50 },
                { id: 3, name: "Early Bird", price: "100000", description: "Tiket Early Bird", stock: 20 },
            ],
            category: "MUSIC",
            eventStatus: "PUBLISHED"
        };
        return dummyEventData;

    } catch (error) {
        console.error("Error fetching event details in Server Component:", error);
        return null;
    }
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
    const { slug } = params; // Akses params.slug secara langsung di Server Component adalah AMAN

    const eventData = await getEventData(slug);

    if (!eventData) {
        // Anda bisa merender halaman 404 custom atau pesan error
        return <div style={{ textAlign: 'center', padding: '50px' }}>Event tidak ditemukan atau terjadi kesalahan saat memuat data.</div>;
    }

    // Pass data yang diambil ke Client Component
    return (
        <EventDetailsClient eventData={eventData} />
    );
};

export default EventDetailPage;