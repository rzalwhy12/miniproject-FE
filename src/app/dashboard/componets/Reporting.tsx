'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';

interface ChartData {
  date: string;
  sales: number;
}

interface ReportingData {
  eventName: string;
  status: string;
  startDate: string;
  endDate: string;
  totalTickets: number;
  totalRevenue: number;
  chartData: ChartData[];
}

interface MonthlySummary {
  month: string;
  totalTickets: number;
  totalRevenue: number;
}

const Reporting = () => {
  const [reportList, setReportList] = useState<ReportingData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    const fetchReportingAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiCall.get('/event/reporting-all', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.result?.data || [];

        if (!Array.isArray(data)) {
          console.error('Response data bukan array:', data);
          return;
        }

        setReportList(data);

        const monthMap: Record<string, MonthlySummary> = {};

        data.forEach((event) => {
          event.chartData?.forEach((entry: any) => {
            const month = format(parseISO(entry.date), 'yyyy-MM');

            if (!monthMap[month]) {
              monthMap[month] = {
                month,
                totalTickets: 0,
                totalRevenue: 0
              };
            }

            monthMap[month].totalTickets += entry.sales;
            monthMap[month].totalRevenue +=
              entry.sales * (event.totalRevenue / event.totalTickets || 1);
          });
        });

        const summary = Object.values(monthMap).sort((a, b) =>
          a.month > b.month ? 1 : -1
        );
        setMonthlyData(summary);
      } catch (error) {
        showError(error);
      }
    };

    fetchReportingAll();
  }, []);

  const filtered = monthlyData.filter((data) => {
    const [year, month] = data.month.split('-');
    const matchYear = yearFilter ? year === yearFilter : true;
    const matchMonth = monthFilter ? month === monthFilter : true;
    return matchYear && matchMonth;
  });

  const yearOptions = [
    ...new Set(monthlyData.map((d) => d.month.split('-')[0]))
  ];
  const monthOptions = [
    ...new Set(monthlyData.map((d) => d.month.split('-')[1]))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/30 via-slate-800/40 to-gray-900/50 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Laporan Penjualan Bulanan
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
              <option key={year}>{year}</option>
            ))}
          </select>

          <select
            className="bg-slate-800 text-white border border-slate-600 rounded-xl px-4 py-2"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Semua Bulan</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">
            Tidak ada data penjualan untuk filter ini.
          </p>
        ) : (
          <>
            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {filtered.map((month, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 hover:scale-[1.02] transition-transform"
                >
                  <h2 className="text-xl font-semibold text-purple-400 mb-2">
                    Bulan: {month.month}
                  </h2>
                  <p className="text-white">
                    Total Tiket Terjual:{' '}
                    <span className="font-bold">{month.totalTickets}</span>
                  </p>
                  <p className="text-white">
                    Total Pendapatan:{' '}
                    <span className="font-bold text-green-400">
                      Rp {month.totalRevenue.toLocaleString('id-ID')}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10">
              <h3 className="text-lg font-medium mb-4 text-center">
                Grafik Penjualan Bulanan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filtered}>
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
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
      </div>
    </div>
  );
};

export default Reporting;
