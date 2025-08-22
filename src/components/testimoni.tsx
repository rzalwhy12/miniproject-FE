"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    rating: string;
    review: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sousan Cruse",
        avatar: "/images/dami1.png",
        rating: "100",
        review: "highly recommended ! Here I can send my friends gift cards so they can buy their favourite concerts! This is how I surprised my gf <3 <3"
    },
    {
        id: 2,
        name: "Paula Green",
        avatar: "/images/dami2.png",
        rating: "100",
        review: "I have bought my tickets many times from here, the experience is great, having the ticket saved in my application was calming."
    },
    {
        id: 3,
        name: "Alastair Bard",
        avatar: "/images/dami1.png",
        rating: "100",
        review: "Buying n searching for tickets has never been easier! The website had the best prices compared to other ticket selling platforms."
    },
    {
        id: 4,
        name: "Sarah Johnson",
        avatar: "/images/dami2.png",
        rating: "100",
        review: "Amazing service! Quick and easy ticket purchasing process. Will definitely use again for future events."
    },
    {
        id: 5,
        name: "Mike Davis",
        avatar: "/images/dami1.png",
        rating: "100",
        review: "Great platform with excellent customer service. Found tickets for sold-out concerts at reasonable prices."
    }
];

const Testimoni: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth < 640) {
                setCardsPerView(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    const totalPages = Math.ceil(testimonials.length / cardsPerView);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        What our customers say
                    </h2>
                    <p className="text-lg text-gray-600">
                        Real reviews from concert enthusiasts who love our service
                    </p>
                </div>

                {/* Testimonials Slider */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50"
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50"
                        disabled={currentIndex >= totalPages - 1}
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Testimonials Container */}
                    <div className="overflow-hidden w-full">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                                <div key={pageIndex} className="w-full flex-shrink-0 flex">
                                    {testimonials.slice(pageIndex * cardsPerView, (pageIndex + 1) * cardsPerView).map(testimonial => (
                                        <div key={testimonial.id} className="w-full sm:w-1/2 lg:w-1/3 p-2 sm:p-3">
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col justify-between aspect-square">
                                                {/* Profile Section */}
                                                <div className="flex items-center mb-4">
                                                    <div className="relative">
                                                        <Image
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            width={56}
                                                            height={56}
                                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-4 border-white shadow-lg"
                                                        />
                                                        <div className="absolute -top-1.5 -right-1.5 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full -z-10"></div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                                                            {testimonial.name}
                                                        </h3>
                                                        <div className="text-pink-500 text-xl sm:text-2xl font-bold">
                                                            {testimonial.rating}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                                        {testimonial.review}
                                                    </p>
                                                </div>

                                                {/* Quote Icon */}
                                                <div className="mt-4 flex items-center justify-end">
                                                    <svg
                                                        className="w-8 h-8 text-pink-300"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                currentIndex === index ? 'bg-purple-500' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-gray-600 text-lg">Have a thought?</span>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimoni;