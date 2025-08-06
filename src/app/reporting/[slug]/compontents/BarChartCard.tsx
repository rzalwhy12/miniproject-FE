'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type Props = {
  label: string;
  value: number;
};

const BarChartCard = ({ label, value }: Props) => {
  const data = [
    {
      name: label,
      [label]: value
    }
  ];

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-md">
      <h2 className="text-lg font-semibold text-white mb-4">Total {label}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey={label} fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
