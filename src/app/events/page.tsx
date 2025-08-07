"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventDetail } from '@/types/types';
import { categoryService, artistService } from '@/helper/exploreService';
import { apiCall } from '@/helper/apiCall';
import Image from 'next/image';
import Link from 'next/link';

const EventsPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<EventDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentFilter, setCurrentFilter] = useState<{
        type: 'category' | 'artist' | 'all';
        value: string;
    }>({ type: 'all', value: '' });

    useEffect(() => {
        const category = searchParams.get('category');
        const artist = searchParams.get('artist');

        if (category) {
            setCurrentFilter({ type: 'category', value: category });
            fetchEventsByCategory(category);
        } else if (artist) {
            setCurrentFilter({ type: 'artist', value: artist });
            fetchEventsByArtist(artist);
        } else {
            setCurrentFilter({ type: 'all', value: '' });
            fetchAllEvents();
        }
    }, [searchParams]);

    const fetchAllEvents = async () => {
        setLoading(true);
        try {
            const response = await apiCall.get('/event');
            setEvents(response.data.result || response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventsByCategory = async (categoryId: string) => {
        setLoading(true);
        try {
            const events = await categoryService.getEventsByCategory(categoryId);
            setEvents(events);
        } catch (error) {
            console.error('Error fetching events by category:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventsByArtist = async (artistId: string) => {
        setLoading(true);
        try {
            const events = await artistService.getEventsByArtist(artistId);
            setEvents(events);
        } catch (error) {
            console.error('Error fetching events by artist:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(Number(price));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentFilter.type === 'category' ? `Events in ${currentFilter.value}` :
                            currentFilter.type === 'artist' ? `Events by ${currentFilter.value}` :
                                'All Events'}
                    </h1>
                    <p className="text-gray-600">
                        {events.length} {events.length === 1 ? 'event' : 'events'} found
                    </p>
                </div>

                {/* Events Grid */}
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                href={`/adicara/${event.slug}`}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Event Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {event.banner ? (
                                        <Image
                                            src={event.banner}
                                            alt={event.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                            <span className="text-white font-semibold">No Image</span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full">
                                        {event.category}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${event.eventStatus === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                            event.eventStatus === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {event.eventStatus}
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                        {event.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <span className="font-medium">Date:</span>
                                            <span className="ml-2">{formatDate(event.startDate)}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <span className="font-medium">Location:</span>
                                            <span className="ml-2 line-clamp-1">{event.location}</span>
                                        </div>

                                        {event.ticketTypes && event.ticketTypes.length > 0 && (
                                            <div className="flex items-center">
                                                <span className="font-medium">From:</span>
                                                <span className="ml-2 text-green-600 font-semibold">
                                                    {formatPrice(Math.min(...event.ticketTypes.map(t => Number(t.price))).toString())}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5l10 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-600 mb-6">
                            {currentFilter.type === 'category' ?
                                `No events found in the ${currentFilter.value} category.` :
                                currentFilter.type === 'artist' ?
                                    `No events found for ${currentFilter.value}.` :
                                    'No events are currently available.'
                            }
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
