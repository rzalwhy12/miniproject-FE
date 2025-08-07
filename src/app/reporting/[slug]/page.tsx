'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import ReportCard from './compontents/ReportingCard';
import PieChartCard from './compontents/PieChartCard';
import BarChartCard from './compontents/BarChartCard';
import { Users, Wallet, ReceiptText, ArrowLeft } from 'lucide-react';

type Participant = {
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
};

type ReportingData = {
  eventName: string;
  totalParticipants: number;
  totalRevenue: number;
  totalTransactions: number;
  participants: Participant[];
};

const ReportingPage = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [data, setData] = useState<null | ReportingData>(null);

  useEffect(() => {
    const fetchReporting = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiCall.get(`/reporting-event/reporting/${slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.result.data);
      } catch (error) {
        showError(error);
      }
    };

    if (slug) fetchReporting();
  }, [slug]);

  if (!data)
    return (
      <div className="text-white p-8 text-center text-lg">
        Loading report...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-white hover:text-purple-300 transition"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Laporan Event:{' '}
          <span className="text-purple-400">{data.eventName}</span>
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ReportCard
            label="Total Peserta"
            value={data.totalParticipants}
            bgClass="bg-gradient-to-br from-pink-500/20 to-purple-500/20"
            icon={Users}
          />
          <ReportCard
            label="Total Pendapatan"
            value={`Rp ${data.totalRevenue.toLocaleString('id-ID')}`}
            bgClass="bg-gradient-to-br from-green-500/20 to-teal-500/20"
            icon={Wallet}
          />
          <ReportCard
            label="Total Transaksi"
            value={data.totalTransactions}
            bgClass="bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
            icon={ReceiptText}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChartCard
            data={[
              { name: 'Peserta', value: data.totalParticipants },
              { name: 'Transaksi', value: data.totalTransactions }
            ]}
          />
          <BarChartCard label="Pendapatan" value={data.totalRevenue} />
        </div>

        {/* Participant List */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Daftar Peserta</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white/50 text-black rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">No</th>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Jenis Tiket</th>
                  <th className="px-4 py-2 text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.participants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center px-4 py-4 text-gray-500"
                    >
                      Tidak ada peserta terdaftar.
                    </td>
                  </tr>
                ) : (
                  data.participants.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 hover:bg-gray-100"
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.email}</td>
                      <td className="px-4 py-2">{p.ticketType}</td>
                      <td className="px-4 py-2">{p.quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingPage;
