"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/helper/apiCall";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";

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

const TicketsPageClient = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filtered, setFiltered] = useState<Ticket[]>([]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const [showCount, setShowCount] = useState(16);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const { executeWithLoading } = useAsyncWithLoading();

  useEffect(() => {
    if (isInitialized) return;
    const fetchTickets = async () => {
      setError(null);
      const searchQuery = searchParams.get("search") || "";
      const categoryQuery = searchParams.get("category") || "";
      if (searchQuery) setSearchTerm(searchQuery);
      if (categoryQuery) setCategory(categoryQuery);
      try {
        const res = await apiCall.get("/event");
        const dataArray = Array.isArray(res.data?.result?.data)
          ? res.data.result.data
          : [];
        const mapped = dataArray.map((e: any) => ({
          id: e.id,
          name: e.name,
          location: e.location,
          category:
            typeof e.category === "string" ? e.category : e.category?.name || "",
          startDate: e.startDate,
          image: e.banner || "/default.jpg",
          description: e.description || "",
          slug: e.slug || "",
          endDate: e.endDate,
          eventStatus: e.eventStatus || "",
          organizerId: e.organizerId,
        }));
        setTickets(mapped);
        setFiltered(mapped);
        setIsInitialized(true);
      } catch (err) {
        console.error("Gagal fetch /event:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
        throw err;
      }
    };
    executeWithLoading(fetchTickets, "Loading events...");
  }, [searchParams, executeWithLoading, isInitialized]);

  const retryLoadData = async () => {
    setError(null);
    setIsInitialized(false);
    const fetchTickets = async () => {
      try {
        const res = await apiCall.get("/event");
        const dataArray = Array.isArray(res.data?.result?.data)
          ? res.data.result.data
          : [];
        const mapped = dataArray.map((e: any) => ({
          id: e.id,
          name: e.name,
          location: e.location,
          category:
            typeof e.category === "string" ? e.category : e.category?.name || "",
          startDate: e.startDate,
          image: e.banner || "/default.jpg",
          description: e.description || "",
          slug: e.slug || "",
          endDate: e.endDate,
          eventStatus: e.eventStatus || "",
          organizerId: e.organizerId,
        }));
        setTickets(mapped);
        setFiltered(mapped);
        setIsInitialized(true);
      } catch (err) {
        console.error("Gagal fetch /event:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
        throw err;
      }
    };
    await executeWithLoading(fetchTickets, "Reloading events...");
  };

  useEffect(() => {
    const filterData = () => {
      setIsFiltering(true);
      let data = [...tickets];
      if (searchTerm) {
        data = data.filter((e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (location) data = data.filter((e) => e.location === location);
      if (category) data = data.filter((e) => e.category === category);
      if (date && typeof window !== "undefined") {
        data = data.filter(
          (e) =>
            new Date(e.startDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) === date
        );
      }
      setFiltered(data);
      setShowCount(16);
      setIsFiltering(false);
    };
    if (searchTerm) {
      setIsFiltering(true);
      const timeoutId = setTimeout(filterData, 300);
      return () => clearTimeout(timeoutId);
    } else {
      filterData();
    }
  }, [location, category, date, tickets, searchTerm]);

  const locations = Array.from(new Set(tickets.map((e) => e.location)));
  const categories = Array.from(new Set(tickets.map((e) => e.category)));
  const dates = typeof window !== "undefined"
    ? Array.from(
        new Set(
          tickets.map((e) =>
            new Date(e.startDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          )
        )
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari event..."
              className="border rounded px-3 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isFiltering && searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <select
            className="border rounded px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Lokasi</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Tanggal</option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={retryLoadData}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && isInitialized && filtered.length === 0 && (
          <p className="text-center">Tidak ada event yang cocok dengan filter Anda.</p>
        )}

        {!isInitialized && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isInitialized && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {filtered.slice(0, showCount).map((ticket) => {
              const formattedDate =
                typeof window !== "undefined"
                  ? new Date(ticket.startDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "";
              const formattedDateTime =
                typeof window !== "undefined"
                  ? `${formattedDate}, ${new Date(ticket.startDate).toLocaleTimeString(
                      "id-ID",
                      { hour: "2-digit", minute: "2-digit" }
                    )}`
                  : "";
              return (
                <Link href={`/adicara/${ticket.slug}`} key={ticket.id}>
                  <div className="group w-full bg-white rounded-2xl shadow border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-300 cursor-pointer h-full">
                    <div className="relative">
                      <img
                        src={ticket.image}
                        alt={ticket.name}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center">
                        <div className="mb-8 text-center w-full px-2">
                          <h3 className="font-semibold text-2xl mb-1 text-gray-900">
                            {ticket.name}
                          </h3>
                          <p className="text-gray-700">{ticket.location}</p>
                          <p className="text-gray-600 mt-1">{formattedDateTime}</p>
                        </div>
                      </div>
                    </div>
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
        )}

        {isInitialized && !error && showCount < filtered.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowCount(showCount + 8)}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Lihat lebih banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPageClient;
