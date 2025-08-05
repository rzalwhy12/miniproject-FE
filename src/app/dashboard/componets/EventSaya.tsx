'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import {
  Calendar,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export interface IEvent {
  id: number;
  name: string;
  slug: string;
  banner: string | null;
  description: string;
  syaratKetentuan: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  category: string;
  eventStatus: EventStatus;
  organizerId: number;
  ticketTypes: ITicketType[];
  transactions: ITransaction[];
  reviews: IReview[];
}

export interface ITicketType {
  id: number;
  name: string;
  price: number;
  quota: number;
  descriptionTicket?: string;
  benefit?: string;
  eventId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  id: number;
}

export interface IReview {
  id: number;
  rating: number;
}

const EventSaya = () => {
  const [tab, setTab] = useState<'aktif' | 'draft' | 'lalu'>('aktif');
  const [events, setEvents] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiCall.get('/event/my-event', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.result.data);
      } catch (error) {
        showError(error);
      }
    };

    fetchMyEvents();
  }, []);

  const getFilteredEvents = () => {
    switch (tab) {
      case 'aktif':
        return events.filter((e: any) => e.eventStatus === 'PUBLISHED');
      case 'draft':
        return events.filter((e: any) => e.eventStatus === 'DRAFT');
      case 'lalu':
        return events.filter((e: any) => e.eventStatus === 'COMPLETED');
      default:
        return [];
    }
  };

  const getRating = (event: IEvent) => {
    if (!event.reviews.length) return '0.0';
    const total = event.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / event.reviews.length).toFixed(1);
  };

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'aktif':
        return <TrendingUp className="w-5 h-5" />;
      case 'draft':
        return <Clock className="w-5 h-5" />;
      case 'lalu':
        return <Star className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 lg:px-12">
      <div className="flex justify-center md:justify-between max-w-5xl mx-auto backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-2 mb-8">
        {[
          { key: 'aktif', label: 'Event Aktif' },
          { key: 'draft', label: 'Event Draft' },
          { key: 'lalu', label: 'Event Lalu' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as 'aktif' | 'draft' | 'lalu')}
            className={`group flex items-center gap-3 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 text-base font-medium tracking-wide relative overflow-hidden flex-1
            ${
              tab === key
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-white hover:bg-white/10 hover:shadow-md'
            }`}
          >
            {tab === key && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl" />
            )}
            <div className="relative z-10 flex items-center gap-3">
              {getTabIcon(key)}
              <span>{label}</span>
              <div
                className={`px-2 py-1 rounded-full text-xs font-bold ${tab === key ? 'bg-white/20 text-white' : 'bg-purple-500/30 text-purple-100'}`}
              >
                {getFilteredEvents().length}
              </div>
            </div>
            {tab === key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {getFilteredEvents().map((event: any) => (
          <div
            key={event.id}
            className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-20">
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
                  event.eventStatus === 'PUBLISHED'
                    ? 'bg-green-500/20 text-green-300 border-green-400/30'
                    : event.eventStatus === 'DRAFT'
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                }`}
              >
                {event.eventStatus === 'PUBLISHED'
                  ? 'Aktif'
                  : event.eventStatus === 'DRAFT'
                    ? 'Draft'
                    : 'Selesai'}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <img
                src={event.banner ?? '/images/default.png'}
                alt={event.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {event.eventStatus === 'COMPLETED' && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-medium">
                    {getRating(event)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">{event.name}</h3>
              <div className="space-y-2 text-purple-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    {new Date(event.startDate).toLocaleDateString('id-ID', {
                      dateStyle: 'long'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    {event.transactions.length} peserta
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => router.push(`/event/${event.slug}`)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                >
                  {event.eventStatus === 'DRAFT' ? 'Edit' : 'Lihat Detail'}
                </button>
                {event.eventStatus === 'PUBLISHED' && (
                  <button className="bg-white/20 text-white py-2 px-4 rounded-xl font-medium hover:bg-white/30 border border-white/30 transition-all duration-300">
                    Kelola
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center my-20">
        <button
          onClick={() => router.push('/create')}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-2xl px-12 py-6 text-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6" />
            <span>Buat Event Baru</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EventSaya;
