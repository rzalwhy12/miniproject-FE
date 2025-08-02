import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar, MapPin, Users, Star, TrendingUp, Clock, Plus } from 'lucide-react';

const dummyEvents = [
  {
    id: 1,
    title: 'Workshop React',
    date: '12 Agustus 2025',
    location: 'Jakarta',
    image: '/images/konser/dion.png',
    attendees: 150,
    status: 'active',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Seminar Web3',
    date: '25 September 2025',
    location: 'Bandung',
    image: '/images/konser/justin.png',
    attendees: 89,
    status: 'draft',
    rating: 0
  },
  {
    id: 3,
    title: 'Tech Conference',
    date: '3 Oktober 2025',
    location: 'Surabaya',
    image: '/images/konser/taylor.png',
    attendees: 320,
    status: 'completed',
    rating: 4.9
  }
];

const EventSaya = () => {
  const [tab, setTab] = useState<'aktif' | 'draft' | 'lalu'>('aktif');
  const router = useRouter();

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'aktif': return <TrendingUp className="w-5 h-5" />;
      case 'draft': return <Clock className="w-5 h-5" />;
      case 'lalu': return <Star className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="w-full px-4 lg:px-12">
      {/* Enhanced Tabs */}
      <div className="flex justify-center md:justify-between max-w-5xl mx-auto backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-2 mb-8">
        {[
          { key: 'aktif', label: 'Event Aktif', count: 1 },
          { key: 'draft', label: 'Event Draft', count: 1 },
          { key: 'lalu', label: 'Event Lalu', count: 1 }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            className={`group flex items-center gap-3 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 text-base font-medium tracking-wide relative overflow-hidden flex-1
              ${tab === key 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105' 
                : 'text-white hover:bg-white/10 hover:shadow-md'
              }`}
            onClick={() => setTab(key as 'aktif' | 'draft' | 'lalu')}
          >
            {/* Background glow for active tab */}
            {tab === key && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl"></div>
            )}
            
            <div className="relative z-10 flex items-center gap-3">
              {getTabIcon(key)}
              <span>{label}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                tab === key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-purple-500/30 text-purple-100'
              }`}>
                {count}
              </div>
            </div>
            
            {/* Active indicator */}
            {tab === key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      {/* Enhanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {dummyEvents
          .filter((event) => {
            if (tab === 'aktif') return event.status === 'active';
            if (tab === 'draft') return event.status === 'draft';
            if (tab === 'lalu') return event.status === 'completed';
            return true;
          })
          .map((event, index) => (
            <div
              key={event.id}
              className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden dashboard-card hover-lift glass-morphism"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Status badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
                  event.status === 'active' 
                    ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                    : event.status === 'draft'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                }`}>
                  {event.status === 'active' ? 'Aktif' : event.status === 'draft' ? 'Draft' : 'Selesai'}
                </div>
              </div>

              {/* Image with overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Rating for completed events */}
                {event.status === 'completed' && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{event.rating}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 relative z-10">
                <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-colors duration-300">
                  {event.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm font-medium">{event.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-200">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-200">
                    <Users className="w-4 h-4" />
                    <p className="text-sm font-medium">{event.attendees} peserta</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    {event.status === 'draft' ? 'Edit' : 'Lihat Detail'}
                  </button>
                  {event.status === 'active' && (
                    <button className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
                      Kelola
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Enhanced Create Event Button */}
      <div className="flex justify-center my-20">
        <button
          className="group relative bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl shadow-2xl px-12 py-6 text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl border border-white/20 backdrop-blur-sm overflow-hidden hover-lift glow-effect"
          onClick={() => router.push('/create')}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Button content */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Plus className="w-6 h-6" />
            </div>
            <span className="tracking-wide">Buat Event Baru</span>
          </div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
            <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EventSaya;
