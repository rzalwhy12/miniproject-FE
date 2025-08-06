import { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  bgClass: string;
  icon?: LucideIcon;
};

const ReportCard = ({ label, value, bgClass, icon: Icon }: Props) => {
  return (
    <div
      className={`p-6 rounded-xl border border-white/20 shadow-lg flex items-center gap-4 ${bgClass}`}
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
