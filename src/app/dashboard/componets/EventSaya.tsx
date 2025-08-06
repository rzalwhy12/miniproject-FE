'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  Plus,
  Pencil,
  Trash
} from 'lucide-react';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'PAST';

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
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const statusMap = {
          aktif: 'PUBLISHED',
          draft: 'DRAFT',
          lalu: 'PAST'
        };

        const res = await apiCall.get(`/event/my-event/${statusMap[tab]}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEvents(res.data.result.data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [tab]);

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

  const openConfirmModal = (id: number) => {
    setSelectedEventId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) return;
    try {
      const token = localStorage.getItem('token');
      await apiCall.delete(`/event/${selectedEventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Event berhasil dihapus.');
      setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
    } catch (error) {
      showError(error);
    } finally {
      setShowConfirm(false);
      setSelectedEventId(null);
    }
  };

  return (
    <div className="w-full px-4 lg:px-12">
      {/* Tab Button */}
      <div className="flex justify-center md:justify-between max-w-5xl mx-auto backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-2 mb-8">
        {[
          { key: 'aktif', label: 'Event Aktif' },
          { key: 'draft', label: 'Event Draft' },
          { key: 'lalu', label: 'Event Lalu' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
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
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  tab === key
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-500/30 text-purple-100'
                }`}
              >
                {events.length}
              </div>
            </div>
            {tab === key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Event List */}
      {loading ? (
        <div className="text-center text-white mt-20">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-white mt-20">
          Belum ada event di tab ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => router.push(`/edit/${event.slug}`)}
              className="group relative cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/edit/${event.slug}`);
                  }}
                  className="p-2 rounded-full bg-yellow-400/20 border border-yellow-300/30 text-yellow-200 hover:bg-yellow-400/30"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmModal(event.id);
                  }}
                  className="p-2 rounded-full bg-red-400/20 border border-red-300/30 text-red-200 hover:bg-red-400/30"
                >
                  <Trash size={16} />
                </button>
              </div>

              <div className="relative overflow-hidden">
                <img
                  src={
                    event.banner ??
                    'https://static.thenounproject.com/png/1077596-200.png'
                  }
                  alt={event.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://static.thenounproject.com/png/1077596-200.png';
                  }}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {event.eventStatus === 'PAST' && (
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
                <p className="text-sm italic text-purple-300">
                  {event.category}
                </p>
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
                </div>

                <div className="flex pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/reporting/${event.slug}`);
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Reporting
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Button Buat Event Baru */}
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

      {/* Modal Konfirmasi Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/70 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Hapus Event
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus event ini? Tindakan ini tidak
              bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedEventId(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSaya;
