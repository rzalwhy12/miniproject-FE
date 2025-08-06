'use client';

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

type Props = {
  data: { name: string; value: number }[];
};

const PieChartCard = ({ data }: Props) => {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-md">
      <h2 className="text-lg font-semibold text-white mb-4">
        Distribusi Peserta vs Transaksi
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartCard;
