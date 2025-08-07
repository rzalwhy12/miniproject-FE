"use client"
import React, { useState } from "react";

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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (testimonials.length - 2));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + (testimonials.length - 2)) % (testimonials.length - 2));
    };

    return (
        <section className="py-16 px-4 bg-gray-50">
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
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        style={{ marginLeft: '-20px' }}
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        style={{ marginRight: '-20px' }}
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Testimonials Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="w-1/3 flex-shrink-0 px-4">
                                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative h-80">
                                        {/* Profile Section */}
                                        <div className="flex items-center mb-6">
                                            <div className="relative">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                                {/* Colored background circle */}
                                                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full -z-10"></div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {testimonial.name}
                                                </h3>
                                                <div className="text-pink-500 text-2xl font-bold">
                                                    {testimonial.rating}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Text */}
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            {testimonial.review}
                                        </p>

                                        {/* Quote Icon */}
                                        <div className="absolute bottom-6 right-6">
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
                    </div>
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
