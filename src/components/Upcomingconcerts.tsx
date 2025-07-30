import React from "react";

const concerts = [
    {
        name: "Taylor Swift",
        city: "San Diego",
        venue: "Petco Park",
        date: "Dec 14, 21:00",
        image: "/images/konser/taylor.png",
        price: "From $150",
    },
    {
        name: "Celine Dion",
        city: "USA, New York City",
        venue: "Beacon Theatre",
        date: "Dec 13, 21:00",
        image: "/images/konser/dion.png",
        price: "From $120",
    },
    {
        name: "Justin Bieber",
        city: "San Francisco",
        venue: "Chase Center",
        date: "Dec 16, 20:00",
        image: "/images/konser/justin.png",
        price: "From $110",
    },
    {
        name: "Sila Gencoglu",
        city: "Boston",
        venue: "TD Garden",
        date: "Dec 18, 22:00",
        image: "/images/konser/sila.png",
        price: "From $90",
    },
];

const UpcomingConcerts = () => {
    return (
        <section className="px-8 py-10 max-w-[1300px] mx-auto ">
            <div className="flex justify-between items-center mb-8 mt-8 ">
                <h2 className="text-3xl font-semibold">Featured Events</h2>
                <a href="#" className="text-gray-600 hover:underline text-lg">
                    See All
                </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[1300px] mx-auto">
                {concerts.map((concert, idx) => (
                    <div
                        key={idx}
                        className="group bg-white rounded-2xl shadow border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-300"
                    >
                        <div className="relative">
                            <img
                                src={concert.image}
                                alt={concert.name}
                                className="w-full h-70 object-cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center">
                                <div className="mb-8 text-center w-full">
                                    <h3 className="font-semibold text-2xl mb-1 text-gray-900">{concert.name}</h3>
                                    <p className="text-gray-700">
                                        {concert.city}
                                        {concert.venue && <><br />{concert.venue}</>}
                                    </p>
                                    <p className="text-gray-600 mt-1">{concert.date}</p>
                                    {concert.price && (
                                        <p className="mt-2 text-pink-500 font-semibold text-lg">{concert.price}</p>
                                    )}
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
        </section>
    );
};

export default UpcomingConcerts;