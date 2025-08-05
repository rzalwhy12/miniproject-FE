'use client';

import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { useRouter } from 'next/navigation';
import {
  EventDetail,
  Ticket,
  Voucher,
  categoryOptions,
  statusOptions
} from '../../../../types/types';

interface EventDetailsClientProps {
  eventData: EventDetail;
}

const EventDetailsClient: React.FC<EventDetailsClientProps> = ({
  eventData
}) => {
  const router = useRouter();

  const [selectedTicketType, setSelectedTicketType] = useState<Ticket | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null); // State baru untuk voucher

  // Data voucher simulasi (jika tidak ada di eventData)
  // Jika eventData.vouchers sudah ada, gunakan itu sebagai sumber utama
  const availableVouchers: Voucher[] = useMemo(() => {
    if (eventData.vouchers && eventData.vouchers.length > 0) {
      return eventData.vouchers;
    }
    // Data dummy jika eventData tidak menyediakan voucher
    return [
      {
        discount: 0.1,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z'
      }, // 10% diskon
      {
        discount: 0.05,
        startDate: '2025-07-01T00:00:00Z',
        endDate: '2025-09-30T23:59:59Z'
      }, // 5% diskon
      {
        discount: 0.2,
        startDate: '2025-08-01T00:00:00Z',
        endDate: '2025-08-10T23:59:59Z'
      } // 20% diskon (promo singkat)
    ];
  }, [eventData.vouchers]); // Dependensi ke eventData.vouchers

  // Filter voucher yang valid berdasarkan tanggal saat ini
  const validVouchers = useMemo(() => {
    const now = new Date();
    return availableVouchers.filter((voucher) => {
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      return now >= startDate && now <= endDate;
    });
  }, [availableVouchers]);

  useEffect(() => {
    if (!selectedTicketType && eventData.ticketTypes.length > 0) {
      const firstAvailableTicket = eventData.ticketTypes.find(
        (ticket) => ticket.stock > 0
      );
      setSelectedTicketType(firstAvailableTicket || null);
    }
  }, [eventData, selectedTicketType]);

  // Hitung harga dasar sebelum diskon
  const basePrice = useMemo(() => {
    if (!selectedTicketType) return 0;
    const price = parseFloat(selectedTicketType.price);
    return isNaN(price) ? 0 : price * quantity;
  }, [selectedTicketType, quantity]);

  // Hitung total harga setelah diskon
  const totalPrice = useMemo(() => {
    let price = basePrice;
    if (selectedVoucher) {
      // Asumsi: discount adalah persentase (e.g., 0.10 for 10%)
      price = price * (1 - selectedVoucher.discount);
    }
    return price;
  }, [basePrice, selectedVoucher]);

  const handleTicketSelect = (ticket: Ticket) => {
    if (ticket.stock <= 0) {
      alert('Tiket ini sudah habis.');
      return;
    }
    setSelectedTicketType(ticket);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    if (selectedTicketType && value > selectedTicketType.stock) {
      value = selectedTicketType.stock;
    }
    setQuantity(value);
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const discountValue = parseFloat(e.target.value);
    if (isNaN(discountValue)) {
      setSelectedVoucher(null); // Jika memilih "Tidak Ada Voucher"
    } else {
      const voucher = validVouchers.find((v) => v.discount === discountValue);
      setSelectedVoucher(voucher || null);
    }
  };

  const handleCheckoutClick = () => {
    if (!selectedTicketType || quantity <= 0) {
      alert('Harap pilih tipe tiket dan jumlah yang valid.');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    if (!eventData || !selectedTicketType) return;

    console.log('Melanjutkan Checkout:', {
      eventId: eventData.id,
      eventName: eventData.name,
      ticketType: selectedTicketType.name,
      quantity: quantity,
      basePrice: basePrice,
      discountApplied: selectedVoucher
        ? (basePrice * selectedVoucher.discount).toLocaleString('id-ID')
        : 0,
      voucherUsed: selectedVoucher
        ? `${selectedVoucher.discount * 100}%`
        : 'None',
      totalPrice: totalPrice
    });

    alert('Proses checkout dilanjutkan! (Ini adalah simulasi)');
    setShowCheckoutModal(false);
    router.push(
      `/checkout?eventId=${eventData.id}&ticketTypeId=${selectedTicketType.id}&qty=${quantity}&voucher=${selectedVoucher?.discount || ''}`
    );
  };

  const getStatusLabel = (value: string) => {
    return (
      statusOptions.find((option) => option.value === value)?.label || value
    );
  };

  const getCategoryLabel = (value: string) => {
    return (
      categoryOptions.find((option) => option.value === value)?.label || value
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleTimeString('id-ID', options);
  };

  const formattedStartDate = formatDate(eventData.startDate);
  const formattedEndDate = formatDate(eventData.endDate);
  const formattedStartTime = formatTime(eventData.startDate);
  const formattedEndTime = formatTime(eventData.endDate);

  return (
    <div className="container mx-auto p-0 max-w-6xl font-sans my-5 shadow-xl rounded-xl overflow-hidden bg-white">
      {/* Bagian Banner Event */}
      {eventData.banner && (
        <img
          src={eventData.banner}
          alt={eventData.name}
          className="w-full max-h-[450px] object-cover rounded-t-xl"
        />
      )}

      <div className="p-8">
        {/* Bagian Detail Event */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 border-b-2 border-gray-100 pb-3">
          {eventData.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 mb-8 text-gray-700 text-lg">
          <p>
            <strong>Organizer:</strong> {eventData.organizer || 'N/A'}
          </p>
          <p>
            <strong>Lokasi:</strong> {eventData.location}
          </p>
          <p>
            <strong>Tanggal:</strong> {formattedStartDate} - {formattedEndDate}
          </p>
          <p>
            <strong>Waktu:</strong> {formattedStartTime} - {formattedEndTime}{' '}
            WIB
          </p>
          <p>
            <strong>Kategori:</strong> {getCategoryLabel(eventData.category)}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`font-bold ${eventData.eventStatus === 'PUBLISHED' ? 'text-green-600' : eventData.eventStatus === 'CANCELLED' ? 'text-red-600' : 'text-gray-500'}`}
            >
              {getStatusLabel(eventData.eventStatus)}
            </span>
          </p>
        </div>

        {/* Deskripsi Event */}
        <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800 border-b border-gray-200 pb-2">
          Deskripsi Event
        </h2>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              eventData.description ||
              '<p>Tidak ada deskripsi untuk event ini.</p>'
          }}
        />

        {/* Syarat dan Ketentuan */}
        <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800 border-b border-gray-200 pb-2">
          Syarat dan Ketentuan
        </h2>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              eventData.syaratKetentuan ||
              '<p>Tidak ada syarat dan ketentuan khusus.</p>'
          }}
        />

        {/* Menu Checkout Event - Pilihan Tiket dalam Card */}
        <hr className="my-12 border-t-2 border-dashed border-gray-300" />
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Pesan Tiket
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {eventData.ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketSelect(ticket)}
              className={`
                                relative p-6 rounded-lg shadow-md border-2 transition-all duration-300 ease-in-out cursor-pointer
                                ${
                                  selectedTicketType?.id === ticket.id
                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                    : 'border-transparent bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                                }
                                ${
                                  ticket.stock <= 0
                                    ? 'opacity-60 cursor-not-allowed bg-gray-200 filter grayscale'
                                    : ''
                                }
                            `}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {ticket.name}
              </h3>
              <p className="text-xl font-semibold text-blue-600 mb-2">
                Rp{parseFloat(ticket.price).toLocaleString('id-ID')}
              </p>
              <p className="text-gray-600 text-base mb-3">
                {ticket.description}
              </p>
              <p className="text-gray-500 text-sm italic">
                {ticket.stock > 0 ? `${ticket.stock} tersedia` : 'Habis'}
              </p>
              {ticket.stock <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-70 text-white text-3xl font-bold rotate-[-25deg] pointer-events-none rounded-lg">
                  SOLD OUT
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTicketType && selectedTicketType.stock > 0 && (
          <div className="bg-gray-100 p-8 rounded-lg shadow-inner flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full justify-center">
              {/* Quantity Control */}
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="font-bold text-lg text-gray-700"
                >
                  Jumlah Tiket:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={selectedTicketType.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-24 p-3 rounded-lg border border-gray-300 text-lg text-center bg-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Voucher Selection */}
              {validVouchers.length > 0 && (
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="voucher"
                    className="font-bold text-lg text-gray-700"
                  >
                    Pilih Voucher:
                  </label>
                  <select
                    id="voucher"
                    onChange={handleVoucherChange}
                    value={selectedVoucher?.discount || ''}
                    className="p-3 rounded-lg border border-gray-300 text-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tidak Ada Voucher</option>
                    {validVouchers.map((voucher, index) => (
                      <option key={index} value={voucher.discount}>
                        Diskon {(voucher.discount * 100).toFixed(0)}%
                        {/* Anda bisa menambahkan tanggal berlaku jika mau */}
                        {` (Berlaku hingga ${new Date(voucher.endDate).toLocaleDateString('id-ID')})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Harga Sebelum Diskon (Opsional, untuk transparansi) */}
            {selectedVoucher && basePrice > totalPrice && (
              <p className="text-lg text-gray-600 line-through">
                Harga Awal: Rp{basePrice.toLocaleString('id-ID')}
              </p>
            )}

            {/* Total Harga */}
            <p className="text-3xl font-bold text-gray-800 mt-2">
              Total Harga:{' '}
              <span className="text-green-600">
                Rp{totalPrice.toLocaleString('id-ID')}
              </span>
            </p>
            <button
              onClick={handleCheckoutClick}
              disabled={quantity <= 0 || selectedTicketType.stock <= 0}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-80 transform hover:-translate-y-1"
            >
              Pesan Sekarang
            </button>
          </div>
        )}
        {selectedTicketType && selectedTicketType.stock <= 0 && (
          <p className="text-center text-red-600 text-lg mt-5 p-4 bg-red-50 rounded-lg border border-red-200">
            Tiket yang Anda pilih sudah habis.
          </p>
        )}
      </div>

      {/* Modal Konfirmasi Checkout */}
      {showCheckoutModal && selectedTicketType && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-10 rounded-xl max-w-lg w-full text-center shadow-2xl animate-scale-in">
            <h3 className="text-3xl font-bold mb-5 text-gray-900">
              Konfirmasi Pesanan Anda
            </h3>
            <p className="mb-3 text-lg text-gray-700">Anda akan memesan:</p>
            <p className="text-4xl font-extrabold text-blue-700 mb-4">
              {quantity}x{' '}
              <span className="text-gray-800">{selectedTicketType.name}</span>
            </p>
            {selectedVoucher && (
              <p className="text-lg text-green-600 mb-2">
                Dengan Voucher:{' '}
                <span className="font-bold">
                  {(selectedVoucher.discount * 100).toFixed(0)}% Diskon
                </span>
              </p>
            )}
            <p className="mb-6 text-lg text-gray-700">
              untuk event{' '}
              <strong className="text-blue-600">{eventData.name}</strong>
            </p>
            {selectedVoucher && basePrice > totalPrice && (
              <p className="text-xl text-gray-500 line-through mb-2">
                Harga Awal: Rp{basePrice.toLocaleString('id-ID')}
              </p>
            )}
            <p className="text-5xl font-bold text-green-700 mt-5 mb-8">
              Total: Rp{totalPrice.toLocaleString('id-ID')}
            </p>
            <div className="flex flex-col sm:flex-row justify-around gap-4">
              <button
                onClick={handleConfirmCheckout}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition duration-300 ease-in-out flex-1"
              >
                Konfirmasi & Lanjutkan Pembayaran
              </button>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition duration-300 ease-in-out flex-1"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Animasi untuk modal - tambahkan ke globals.css */}
      <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventDetailsClient;
