'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

const events = [
  {
    title: 'Beyoncé Live in Concert!',
    subtitle: 'A Night to Remember!',
    description:
      'Get ready for an extraordinary night with Beyoncé with breathtaking performances and unforgettable moments.',
    note: "Don't wait – secure your tickets",
    image: '/images/dami1.png',
    tags: ['#Summer', '#Jazz', '#TaylorSwift', '#NewYork']
  },
  {
    title: 'Taylor Swift Eras Tour',
    subtitle: 'Experience Every Era!',
    description:
      'Join Taylor Swift for a magical journey through her musical eras. Unforgettable performances await!',
    note: 'Tickets are selling fast – grab yours now!',
    image: '/images/dami2.png',
    tags: ['#Pop', '#Live', '#TaylorSwift', '#LA']
  }
];

const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const event = events[activeIndex];

  const goToPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  const goToNext = () =>
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));

  return (
    <section className="w-full flex flex-col items-center justify-center bg-white">
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Search & Tags */}
        <div className="absolute top-[507px] left-0 w-full h-[28vh] bg-gray-800 py-2 px-10 flex flex-col items-start  ">
          <div className="w-[600px] max-w-3xl ml-22 z-10">
            <span className="text-gray-400 text-2xl mb-6 block pt-6">
              <p>Search by Artist, Event or Venue</p>
            </span>
            <div className="flex items-center bg-gray-700 rounded-2xl px-10 py-6 mt-4 ">
              <span className="text-gray-400 pr-6 text-2xl">
                <Search size={28} />
              </span>
              <input
                type="text"
                placeholder="Search by Artist, Event or Venue"
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400 text-xl"
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-700 text-gray-200 px-6 py-3 rounded-full text-base font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Main Content & Image, di atas Search & Tags */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1500px] mx-auto py-4 gap-8 mt-8 z-0 relative">
          {/* Kiri: Konten Utama (diperbesar sedikit) */}
          <div className="flex-1 flex flex-col items-start justify-center ml-[25px]">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">
              {event.subtitle}
            </h2>
            <p className="text-2xl text-gray-500 mb-5">{event.description}</p>
            <p className="text-2xl text-gray-400 mb-10">{event.note}</p>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-16 py-7 rounded-2xl text-3xl font-semibold shadow-lg mb-[280px] min-w-[260px]">
              Get Ticket
            </Button>
          </div>
          {/* Right: Image & Pagination */}
          <div className="relative flex-1 flex items-center justify-center ">
            <img
              src={event.image}
              alt={event.title}
              className="rounded-t-[40px] object-cover w-full max-w-[1300px] h-[756px] shadow-xl relative z-1"
              style={{
                aspectRatio: '3/4',
                background: '#eee',
                marginTop: '-32px'
              }}
            />
            {/* Pagination Dots & Arrows */}
            <div className="absolute right-[5px] translate-x-1/2 top-3/4 -translate-y-1/2 flex flex-col items-center bg-white rounded-full shadow-lg py-4 px-2 z-20">
              {/* Up Arrow */}
              <button
                onClick={goToPrev}
                className="w-7 h-7 flex items-center justify-center mb-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Previous slide"
              >
                <span className="text-gray-400 text-lg">
                  <ChevronUp size={20} />
                </span>
              </button>
              {/* Dots */}
              {events.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-4 h-4 my-1 rounded-full border-2 flex items-center justify-center transition-all ${
                    activeIndex === idx
                      ? 'bg-pink-500 border-pink-500 scale-110'
                      : 'bg-gray-200 border-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {activeIndex === idx && (
                    <span className="block w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
              {/* Down Arrow */}
              <button
                onClick={goToNext}
                className="w-7 h-7 flex items-center justify-center mt-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Next slide"
              >
                <span className="text-gray-400 text-lg">
                  <ChevronDown size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
