import React from "react";

const HeroSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-yellow-100 to-yellow-300 text-center px-4 py-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-900">Beli Tiket Event Favoritmu!</h1>
            <p className="text-lg md:text-2xl text-yellow-800 mb-8 max-w-2xl">
                Dapatkan tiket untuk berbagai acara seru dengan mudah, cepat, dan aman. Jangan lewatkan kesempatan untuk menjadi bagian dari momen spesial bersama teman dan keluarga.
            </p>
            <a
                href="#beli-tiket"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 text-xl"
            >
                Beli Tiket Sekarang
            </a>
        </section>
    );
};

export default HeroSection;
