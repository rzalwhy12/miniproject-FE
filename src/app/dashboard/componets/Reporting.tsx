'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';

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
  month: string; // "2025-08"
  totalTickets: number;
  totalRevenue: number;
}

const Reporting = () => {
  const [reportList, setReportList] = useState<ReportingData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulasi data dummy
    const dummyData: ReportingData[] = [
      {
        eventName: 'Hackathon 2025',
        status: 'Selesai',
        startDate: '2025-08-01',
        endDate: '2025-08-03',
        totalTickets: 120,
        totalRevenue: 3600000,
        chartData: [
          { date: '2025-08-01', sales: 30 },
          { date: '2025-08-02', sales: 50 },
          { date: '2025-08-03', sales: 40 }
        ]
      },
      {
        eventName: 'Startup Expo',
        status: 'Selesai',
        startDate: '2025-07-10',
        endDate: '2025-07-12',
        totalTickets: 100,
        totalRevenue: 3000000,
        chartData: [
          { date: '2025-07-10', sales: 40 },
          { date: '2025-07-11', sales: 30 },
          { date: '2025-07-12', sales: 30 }
        ]
      }
    ];

    setReportList(dummyData);

    // Grouping per bulan
    const monthMap: Record<string, MonthlySummary> = {};

    dummyData.forEach((event) => {
      event.chartData.forEach((entry) => {
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
          entry.sales * (event.totalRevenue / event.totalTickets);
      });
    });

    const summary = Object.values(monthMap).sort((a, b) =>
      a.month > b.month ? 1 : -1
    );
    setMonthlyData(summary);
  }, []);

  const filtered = monthlyData.filter((data) =>
    data.month.includes(searchQuery)
  );

  return (
    <div className="space-y-12">
      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Cari bulan (contoh: 2025-08)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Tidak ada data penjualan bulan ini.
        </p>
      )}

      {filtered.map((month, index) => (
        <Card key={index}>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold">Bulan: {month.month}</h2>
            <p>Total Tiket Terjual: {month.totalTickets}</p>
            <p>
              Total Pendapatan:{' '}
              <span className="font-medium text-primary">
                Rp {month.totalRevenue.toLocaleString('id-ID')}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Grafik Penjualan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtered}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalTickets" fill="#6366f1" name="Tiket Terjual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reporting;
