'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { formatRupiah } from '@/helper/formatRupiah';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
// Helper untuk mendapatkan label bulan dari week string
const getMonthLabelFromWeek = (isoWeek: string): string => {
  const [year, weekNum] = isoWeek.split('-W');
  // ISO week to date (approximate, for grouping)
  const date = new Date(parseInt(year), 0, (parseInt(weekNum) - 1) * 7 + 1);
  return format(date, 'MMMM yyyy', { locale: localeId });
};

const getMonthFromWeek = (isoWeek: string): string => {
  const [year, weekNum] = isoWeek.split('-W');
  const date = new Date(parseInt(year), 0, (parseInt(weekNum) - 1) * 7 + 1);
  return format(date, 'MM', { locale: localeId });
};

// Definisikan tipe data untuk kejelasan
interface ChartEntry {
  week: string; // Menggunakan 'week' bukan 'date'
  sales: number;
}

interface EventData {
  eventName: string;
  totalTickets: number;
  totalRevenue: number;
  chartData: ChartEntry[];
}

interface WeeklySummary {
  week: string;
  totalTickets: number;
  totalRevenue: number;
}

const Reporting = () => {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [yearFilter, setYearFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportingData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await apiCall.get(`/reporting-event/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.result?.data || [];
        if (Array.isArray(data)) {
          setEventData(data);
        } else {
          console.error('Data yang diterima bukan array:', data);
          setEventData([]);
        }
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportingData();
  }, []);

  // Memproses data untuk membuat ringkasan mingguan
  const weeklySummary = useMemo(() => {
    const weekMap: Record<string, WeeklySummary> = {};

    eventData.forEach((event) => {
      event.chartData?.forEach((entry) => {
        const ticketPrice = event.totalTickets > 0 ? event.totalRevenue / event.totalTickets : 0;
        const week = entry.week;

        if (!weekMap[week]) {
          weekMap[week] = {
            week,
            totalTickets: 0,
            totalRevenue: 0
          };
        }

        weekMap[week].totalTickets += entry.sales;
        weekMap[week].totalRevenue += entry.sales * ticketPrice;
      });
    });

    return Object.values(weekMap).sort((a, b) =>
      a.week.localeCompare(b.week)
    );
  }, [eventData]);

  // Filter data berdasarkan tahun & bulan
  const [monthFilter, setMonthFilter] = useState('');
  const filteredData = useMemo(() => {
    return weeklySummary.filter((data) => {
      const [year] = data.week.split('-W');
      const month = getMonthFromWeek(data.week);
      const matchYear = yearFilter ? year === yearFilter : true;
      const matchMonth = monthFilter ? month === monthFilter : true;
      return matchYear && matchMonth;
    });
  }, [weeklySummary, yearFilter, monthFilter]);

  // Opsi untuk filter tahun dan bulan
  const yearOptions = useMemo(() => {
    const years = new Set(weeklySummary.map((d) => d.week.split('-W')[0]));
    return [...years].sort((a, b) => b.localeCompare(a));
  }, [weeklySummary]);

  const monthOptions = useMemo(() => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months.map((name, index) => ({
      value: String(index + 1).padStart(2, '0'),
      label: name
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/30 via-slate-800/40 to-gray-900/50 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Laporan Penjualan Mingguan
        </h1>

        {/* Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <select
            className="bg-slate-800 text-white border border-slate-600 rounded-xl px-4 py-2"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Semua Tahun</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            className="bg-slate-800 text-white border border-slate-600 rounded-xl px-4 py-2"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Semua Bulan</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center text-slate-400 mt-10">Memuat laporan...</div>
        ) : (
          <>
            {/* Tampilkan jika tidak ada data */}
            {filteredData.length === 0 ? (
              <p className="text-center text-slate-400 mt-10">
                Tidak ada data penjualan untuk filter ini.
              </p>
            ) : (
              <>
                {/* Weekly Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  {filteredData.map((week) => (
                    <div
                      key={week.week}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 hover:scale-[1.02] transition-transform"
                    >
                      <h2 className="text-xl font-semibold text-purple-400 mb-2">
                        {getMonthLabelFromWeek(week.week)} - Minggu ke-{week.week.split('-W')[1]}
                      </h2>
                      <p className="text-white">
                        Total Tiket Terjual:{' '}
                        <span className="font-bold">{week.totalTickets}</span>
                      </p>
                      <p className="text-white">
                        Total Pendapatan:{' '}
                        <span className="font-bold text-green-400">
                          {formatRupiah(week.totalRevenue)}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium mb-4 text-center">
                    Grafik Penjualan Mingguan
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredData}>
                      <XAxis dataKey="week" stroke="#fff" tickFormatter={(tick) => {
                        const weekNum = tick.split('-W')[1];
                        return `Minggu ke-${weekNum}`;
                      }} />
                      <YAxis stroke="#fff" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none'
                        }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
                      <Bar
                        dataKey="totalTickets"
                        fill="#a78bfa"
                        name="Tiket Terjual"
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reporting;