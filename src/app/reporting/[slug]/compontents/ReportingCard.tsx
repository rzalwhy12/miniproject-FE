import React from 'react';
import { LucideIcon } from 'lucide-react';

type ReportCardProps = {
  label: string;
  value: string | number;
  bgClass: string; // Tailwind class untuk background
  icon?: LucideIcon; // Optional icon
};

const ReportCard = ({ label, value, bgClass, icon: Icon }: ReportCardProps) => {
  return (
    <div
      className={`p-6 rounded-xl border border-white/20 shadow-lg ${bgClass} flex items-center gap-4`}
    >
      {Icon && (
        <div className="p-3 bg-white/10 rounded-full text-white">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <p className="text-sm text-gray-300 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default ReportCard;
