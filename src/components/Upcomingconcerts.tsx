"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from '@/helper/apiCall';

const UpcomingConcerts: React.FC<{ onLoaded?: () => void }> = ({ onLoaded }) => {
    const [concerts, setConcerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    console.log('UpcomingConcerts mounted');

    useEffect(() => {
        console.log('UpcomingConcerts useEffect dijalankan');
        apiCall.get('/event')
            .then(res => {
                console.log('UpcomingConcerts API response:', res);
                setConcerts(res.data?.result?.data || []);
                setLoading(false);
                onLoaded?.();
                console.log('UpcomingConcerts loading selesai');
            })
            .catch((error) => {
                console.log('UpcomingConcerts API error:', error);
                setLoading(false);
                onLoaded?.();
                console.log('UpcomingConcerts loading error');
            });
    }, []); // Remove onLoaded dependency

    const handleCardClick = (slug: string) => {
        router.push(`/adicara/${slug}`);
    };

    return (
        <section className="px-8 py-10 max-w-[1300px] mx-auto ">
            <div className="flex justify-between items-center mb-8 mt-8 ">
                <h2 className="text-3xl font-semibold">Featured Events</h2>
                <a href="/tickets" className="text-gray-600 hover:underline text-lg">
                    See All
                </a>
            </div>
            {loading ? (
                <div className="text-center py-10 text-lg text-gray-500">Loading events...</div>
            ) : concerts.length === 0 ? (
                <div className="text-center py-10 text-lg text-gray-500">No upcoming events found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[1300px] mx-auto">
                    {concerts.slice(0, 4).map((concert, idx) => (
                        <div
                            key={idx}
                            className="group bg-white rounded-2xl shadow border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-300 cursor-pointer"
                            onClick={() => handleCardClick(concert.slug)}
                        >
                            <div className="relative">
                                <img
                                    src={concert.banner}
                                    alt={concert.name}
                                    className="w-full h-70 object-cover"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center">
                                    <div className="mb-8 text-center w-full">
                                        <h3 className="font-semibold text-2xl mb-1 text-gray-900">{concert.name}</h3>
                                        <p className="text-gray-700">
                                            {concert.location}
                                        </p>
                                        <p className="text-gray-600 mt-1">{concert.startDate}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Default card content */}
                            <div className="p-5 text-center group-hover:opacity-0 transition-opacity duration-300">
                                <h3 className="font-semibold text-xl mb-1">{concert.name}</h3>
                                <p className="text-gray-600">{concert.city}</p>
                                <p className="text-gray-500 mt-1">{concert.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default UpcomingConcerts;