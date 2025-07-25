"use client";

import { Home, Calendar, Info, Settings, FileText, Banknote, LogOut, ArrowRightLeft } from "lucide-react";


    const IconSideNav = ({
      icon,
      label,
      active,
    }: {
      icon: React.ReactNode;
      label: string;
      active?: boolean;
    }) => {
      return (
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium
          ${active ? "bg-white text-blue-800" : "hover:bg-blue-700"}`}
        >
          {icon}
          <span>{label}</span>
        </div>
      );
    };





export default IconSideNav;
