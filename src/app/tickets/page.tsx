"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiCall } from "@/helper/apiCall";

interface Ticket {
    id: string;
    name: string;
    location: string;
    category: string;
    startDate: string;
    image: string;
    description: string;
    slug: string;
    endDate: string;
    eventStatus: string;
    organizerId: number;
}

const TicketsPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filtered, setFiltered] = useState<Ticket[]>([]);
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCount, setShowCount] = useState(16);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        apiCall.get("/event")
            .then(res => {
                console.log("Raw response from /event:", res); // Log untuk melihat seluruh response
                // Mengambil data dari res.data.result.data sesuai struktur response backend
                const dataArray = Array.isArray(res.data?.result?.data) 
                    ? res.data.result.data
                    : [];

                if (dataArray.length === 0) {
                    console.log("Tidak ada event ditemukan dari backend.");
                    // Jangan set error jika memang datanya kosong, biarkan pesan "Tidak ada event" yang muncul
                }
                
                // Mapping sesuai skema Event Prisma
                const mapped = dataArray.map((e: any) => ({
                    id: e.id,
                    name: e.name,
                    location: e.location,
                    category: typeof e.category === 'string' ? e.category : (e.category?.name || ''),
                    startDate: e.startDate,
                    image: e.banner || "/default.jpg",
                    description: e.description || '',
                    slug: e.slug || '',
                    endDate: e.endDate,
                    eventStatus: e.eventStatus || '',
                    organizerId: e.organizerId,
                }));
                setTickets(mapped);
                setFiltered(mapped);
            })
            .catch(err => {
                console.error('Gagal fetch /event:', err);
                setError("Gagal memuat data. Silakan coba lagi nanti.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let data = [...tickets];
        if (searchTerm) {
            data = data.filter(e => 
                e.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (location) data = data.filter(e => e.location === location);
        if (category) data = data.filter(e => e.category === category);
        if (date && typeof window !== "undefined") {
            data = data.filter(e => new Date(e.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) === date);
        }
        setFiltered(data);
        // Debug log
        console.log({ tickets, filtered: data, location, category, date, searchTerm });
    }, [location, category, date, tickets, searchTerm]);

    // Ambil unique value untuk filter
    const locations = Array.from(new Set(tickets.map(e => e.location)));
    const categories = Array.from(new Set(tickets.map(e => e.category)));
    // Hindari SSR mismatch: hanya format tanggal di client
    const dates = typeof window !== "undefined"
        ? Array.from(new Set(tickets.map(e => new Date(e.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }))))
        : [];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-4 mb-8 items-center">
                    <input 
                        type="text"
                        placeholder="Cari event..."
                        className="border rounded px-3 py-2 flex-grow"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select className="border rounded px-3 py-2" value={location} onChange={e => setLocation(e.target.value)}>
                        <option value="">Lokasi</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select className="border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Kategori</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)}>
                        <option value="">Tanggal</option>
                        {dates.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && !error && filtered.length === 0 && (
                    <p className="text-center">Tidak ada event yang cocok dengan filter Anda.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {filtered.slice(0, showCount).map(ticket => {
                        const formattedDate = typeof window !== "undefined"
                            ? new Date(ticket.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                            : '';
                        const formattedDateTime = typeof window !== "undefined"
                            ? `${formattedDate}, ${new Date(ticket.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
                            : '';

                        return (
                            <Link href={`/adicara/${ticket.slug}`} key={ticket.id}>
                                <div
                                    className="group w-full bg-white rounded-2xl shadow border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-300 cursor-pointer h-full"
                                >
                                    <div className="relative">
                                        <img
                                            src={ticket.image}
                                            alt={ticket.name}
                                            className="w-full h-72 object-cover"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center">
                                            <div className="mb-8 text-center w-full px-2">
                                                <h3 className="font-semibold text-2xl mb-1 text-gray-900">{ticket.name}</h3>
                                                <p className="text-gray-700">
                                                    {ticket.location}
                                                </p>
                                                <p className="text-gray-600 mt-1">{formattedDateTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Default card content */}
                                    <div className="p-5 text-center group-hover:opacity-0 transition-opacity duration-300 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1">{ticket.name}</h3>
                                            <p className="text-gray-600">{ticket.location}</p>
                                        </div>
                                        <p className="text-gray-500 mt-1">{formattedDate}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {!loading && !error && showCount < filtered.length && (
                    <div className="flex justify-center mt-8">
                        <button onClick={() => setShowCount(showCount + 8)} className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Lihat lebih banyak</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsPage;