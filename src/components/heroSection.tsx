'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { apiCall } from '@/helper/apiCall';

interface EventData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  note: string;
  banner: string;
  tags: string[];
  slug?: string;
}

const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<{ artists: any[]; events: any[]; venues: any[] }>({ artists: [], events: [], venues: [] });
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Gunakan ref untuk melacak elemen modal agar bisa menyembunyikannya saat user klik di luar
  const searchContainerDesktopRef = useRef<HTMLDivElement>(null);
  const searchContainerMobileRef = useRef<HTMLDivElement>(null);

  // useEffect untuk mengambil 5 event terbaru saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await apiCall.get('/event');
        let data = res.data.result.data || [];
        // Urutkan berdasarkan ID secara descending untuk mendapatkan event terbaru
        data = data.sort((a: EventData, b: EventData) => (b.id ?? 0) - (a.id ?? 0));
        // Ambil 5 event terbaru saja
        setEvents(data.slice(0, 5));
      } catch (err) {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // useEffect untuk menangani saran pencarian dengan debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Hanya jalankan pencarian jika searchTerm tidak kosong
      if (!searchTerm) {
        setSearchResults({ artists: [], events: [], venues: [] });
        setShowModal(false);
        return;
      }

      try {
        // Ambil data event dari API berdasarkan searchTerm
        const eventRes = await apiCall.get(`/event?search=${searchTerm}`);
        setSearchResults({
          artists: [],
          events: eventRes.data.result.data || [],
          venues: []
        });
        // Tampilkan modal hanya jika ada hasil yang ditemukan
        if (eventRes.data.result.data.length > 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      } catch (err) {
        setSearchResults({ artists: [], events: [], venues: [] });
        setShowModal(false);
      }
    };

    // Debounce: Tunda eksekusi selama 300ms
    const timeout = setTimeout(fetchSuggestions, 300);
    // Cleanup function untuk menghapus timeout sebelumnya
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // useEffect untuk menangani klik di luar modal pencarian
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (searchContainerDesktopRef.current && !searchContainerDesktopRef.current.contains(event.target as Node)) &&
        (searchContainerMobileRef.current && !searchContainerMobileRef.current.contains(event.target as Node))
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerDesktopRef, searchContainerMobileRef]);

  const event = events[activeIndex];

  const goToPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  const goToNext = () =>
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));

  return (
    <section className="w-full flex flex-col items-center justify-center bg-white mt-[105px]">
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Main Content & Image */}
        {isLoading ? (
          <div className="w-full text-center py-20 text-gray-400">Loading events...</div>
        ) : event ? (
          <div className="flex flex-col xl:flex-row items-center justify-between w-full max-w-full sm:max-w-2xl md:max-w-[1500px] mx-auto py-2 sm:py-4 gap-2 sm:gap-6 mt-2 sm:mt-4 md:mt-8 z-1 relative">
            {/* Right: Image & Pagination */}
            <div className="order-1 xl:order-2 relative flex-1 flex items-center justify-center w-full max-w-[95vw] sm:max-w-md md:max-w-lg xl:max-w-[1300px]">
              <img
                src={event.banner}
                alt={event.title}
                className="rounded-tr-2xl sm:rounded-tr-3xl md:rounded-tr-[40px] object-cover w-full h-[420px] xs:h-[280px] sm:h-[520px] md:h-[520px] xl:h-[695px] shadow-xl relative z-1"
                style={{
                  aspectRatio: '3/4',
                  background: '#eee',
                  marginTop: '-16px',
                  ...(typeof window !== 'undefined' && window.innerWidth >= 1280
                    ? { marginTop: '-32px' }
                    : {})
                }}
              />
              {/* Pagination Dots & Arrows */}
              <div className="absolute right-0 sm:right-[5px] translate-x-1/2 top-2/3 sm:top-3/4 -translate-y-1/2 flex flex-col items-center bg-white rounded-full shadow-lg py-2 sm:py-4 px-1 sm:px-2 z-20">
                {/* Up Arrow */}
                <button
                  onClick={goToPrev}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mb-1 sm:mb-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Previous slide"
                  disabled={events.length === 0}
                >
                  <span className="text-gray-400 text-base sm:text-lg">
                    <ChevronUp size={16} className="sm:hidden" />
                    <ChevronUp size={20} className="hidden sm:inline" />
                  </span>
                </button>
                {/* Dots */}
                {events.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 my-0.5 sm:my-1 rounded-full border-2 flex items-center justify-center transition-all ${
                      activeIndex === idx
                        ? 'bg-pink-500 border-pink-500 scale-110'
                        : 'bg-gray-200 border-gray-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {activeIndex === idx && (
                      <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    )}
                  </button>
                ))}
                {/* Down Arrow */}
                <button
                  onClick={goToNext}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mt-1 sm:mt-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Next slide"
                  disabled={events.length === 0}
                >
                  <span className="text-gray-400 text-base sm:text-lg">
                    <ChevronDown size={16} className="sm:hidden" />
                    <ChevronDown size={20} className="hidden sm:inline" />
                  </span>
                </button>
              </div>
            </div>
            {/* Kiri: Konten Utama */}
            <div className="order-2 xl:order-1 flex-1 flex flex-col items-center xl:items-start justify-center ml-0 sm:ml-2 xl:ml-[25px] px-2 xs:px-3 sm:px-4 xl:px-0 w-full max-w-full text-center xl:text-left">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4 md:mb-6 w-full break-words">
                {event.title}
              </h1>
              <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 mb-2 xs:mb-2.5 sm:mb-3 md:mb-5 w-full break-words">
                {event.subtitle}
              </h2>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-2 xs:mb-2.5 sm:mb-3 md:mb-5 w-full break-words">
                {event.description}
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-400 mb-3 sm:mb-4 md:mb-6 lg:mb-10 w-full break-words">
                {event.note}
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 xs:px-6 xs:py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-14 lg:py-6 xl:px-16 xl:py-7 rounded-2xl text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold shadow-lg mb-4 xs:mb-6 sm:mb-10 md:mb-14 lg:mb-30 xl:mb-[180px] min-w-[90px] xs:min-w-[110px] sm:min-w-[140px] md:min-w-[180px] lg:min-w-[220px] xl:min-w-[260px] transition-all duration-200 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto xl:mx-0">
                Get Ticket
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full text-center py-20 text-gray-400">No events found.</div>
        )}
        {/* Search & Tags - DESKTOP (absolute) */}
        <div className="hidden xl:flex xl:absolute xl:top-[507px] xl:left-0 w-full bg-gray-800 py-2 xl:px-10 flex-col items-start xl:h-[28vh] min-h-[180px] xl:min-h-0">
          <div className="w-full xl:w-[540px] xl:max-w-3xl xl:ml-22 z-10">
            <span className="text-gray-400 text-lg xl:text-2xl mb-2 xl:mb-3 block pt-2 xl:pt-3">
              <p>Search by Artist, Event or Venue</p>
            </span>
            <div ref={searchContainerDesktopRef} className="flex items-center bg-gray-700 rounded-2xl px-4 py-3 xl:px-10 xl:py-6 mt-2 xl:mt-4 relative">
              <span className="text-gray-400 pr-2 xl:pr-6 text-lg xl:text-2xl">
                <Search size={28} />
              </span>
              <input
                type="text"
                placeholder="Search by Artist, Event or Venue"
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400 text-base xl:text-xl"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowModal(true)}
              />
              {/* Modal Search Suggestions */}
              {showModal && searchResults.events.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 p-4 max-h-[320px] overflow-y-auto">
                  <div className="mb-3">
                    <div className="font-bold text-pink-600 mb-1">Events</div>
                    <ul>
                      {searchResults.events
                        .filter((ev: any) => {
                          const term = searchTerm.toLowerCase();
                          const title = (ev.title || '').toLowerCase();
                          const organizer = typeof ev.organizerName === 'object' && ev.organizerName?.name
                            ? ev.organizerName.name.toLowerCase()
                            : typeof ev.organizer === 'object' && ev.organizer?.name
                            ? ev.organizer.name.toLowerCase()
                            : typeof ev.organizerName === 'string'
                            ? ev.organizerName.toLowerCase()
                            : typeof ev.organizer === 'string'
                            ? ev.organizer.toLowerCase()
                            : '';
                          const location = (ev.location || ev.venue || '').toLowerCase();
                          return title.includes(term) || organizer.includes(term) || location.includes(term);
                        })
                        .map((ev: any) => (
                          <li
                            key={ev.id}
                            className="py-2 px-2 hover:bg-pink-50 rounded cursor-pointer text-gray-700 flex flex-col gap-1"
                            onClick={() => router.push(`/adicara/${ev.slug ?? ev.id}`)}
                          >
                            <span className="font-semibold text-pink-700">
                              {typeof ev.organizerName === 'object' && ev.organizerName?.name
                                ? ev.organizerName.name
                                : typeof ev.organizer === 'object' && ev.organizer?.name
                                ? ev.organizer.name
                                : typeof ev.organizerName === 'string'
                                ? ev.organizerName
                                : typeof ev.organizer === 'string'
                                ? ev.organizer
                                : '-'}
                            </span>
                            <span className="text-base font-bold">{ev.title}</span>
                            <span className="text-sm text-gray-500">{ev.location || ev.venue || '-'}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {/* Tags section, dipindahkan agar menjadi saudara (sibling) dari container input pencarian */}
            <div className="flex flex-wrap gap-2 xl:gap-4 mt-2 xl:mt-4">
              {(event?.tags ?? []).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-700 text-gray-200 px-3 py-2 xl:px-6 xl:py-3 rounded-full text-l xl:text-base font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Search & Tags - MOBILE/TABLET (static, di bawah) */}
        <div className=" xl:hidden w-full bg-gray-800 py-4 px-2 sm:px-4 md:px-8 flex flex-col items-center mt-4">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg ml-0 z-0">
            <span className="text-gray-400 text-base sm:text-lg md:text-xl mb-2 sm:mb-4 md:mb-6 block pt-2 sm:pt-4 md:pt-6">
              <p>Search by Artist, Event or Venue</p>
            </span>
            <div ref={searchContainerMobileRef} className="flex items-center bg-gray-700 rounded-2xl px-3 py-2 sm:px-6 sm:py-4 md:px-10 md:py-6 mt-2 sm:mt-4 md:mt-6 w-full relative">
              <span className="text-gray-400 pr-2 sm:pr-4 md:pr-6 text-base sm:text-lg md:text-xl">
                <Search size={18} className="sm:hidden" />
                <Search size={22} className="hidden sm:inline md:hidden" />
                <Search size={26} className="hidden md:inline" />
              </span>
              <input
                type="text"
                placeholder="Search by Artist, Event or Venue"
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm sm:text-base md:text-lg"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowModal(true)}
              />
              {/* Modal Search Suggestions for mobile/tablet */}
              {showModal && searchResults.events.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 p-4 max-h-[320px] overflow-y-auto">
                  <div className="mb-3">
                    <div className="font-bold text-pink-600 mb-1">Events</div>
                    <ul>
                      {searchResults.events
                        .filter((ev: any) => {
                          const term = searchTerm.toLowerCase();
                          const title = (ev.title || '').toLowerCase();
                          const organizer = typeof ev.organizerName === 'object' && ev.organizerName?.name
                            ? ev.organizerName.name.toLowerCase()
                            : typeof ev.organizer === 'object' && ev.organizer?.name
                            ? ev.organizer.name.toLowerCase()
                            : typeof ev.organizerName === 'string'
                            ? ev.organizerName.toLowerCase()
                            : typeof ev.organizer === 'string'
                            ? ev.organizer.toLowerCase()
                            : '';
                          const location = (ev.location || ev.venue || '').toLowerCase();
                          return title.includes(term) || organizer.includes(term) || location.includes(term);
                        })
                        .map((ev: any) => (
                          <li
                            key={ev.id}
                            className="py-2 px-2 hover:bg-pink-50 rounded cursor-pointer text-gray-700 flex flex-col gap-1"
                            onClick={() => router.push(`/adicara/${ev.slug ?? ev.id}`)}
                          >
                            <span className="font-semibold text-pink-700">
                              {typeof ev.organizerName === 'object' && ev.organizerName?.name
                                ? ev.organizerName.name
                                : typeof ev.organizer === 'object' && ev.organizer?.name
                                ? ev.organizer.name
                                : typeof ev.organizerName === 'string'
                                ? ev.organizerName
                                : typeof ev.organizer === 'string'
                                ? ev.organizer
                                : '-'}
                            </span>
                            <span className="text-base font-bold">{ev.title}</span>
                            <span className="text-sm text-gray-500">{ev.location || ev.venue || '-'}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 mt-2 sm:mt-3 md:mt-4 w-full">
              {(event?.tags ?? []).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-700 text-gray-200 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold truncate max-w-[90vw]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;