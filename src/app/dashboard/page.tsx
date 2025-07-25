"use client";

import { Calendar, Info, Settings, LogOut, ArrowRightLeft, ChartColumn, ReceiptIcon, ReceiptText } from "lucide-react";
import IconSideNav from "./componets/IconSideNav";
import Header from "./componets/Header";
import EventSaya from "./componets/EventSaya";

const DashboardPage = () => {
    return (
        <><div className="flex">
            <aside className="bg-blue-800 text-white h-screen w-64 flex flex-col justify-between p-4">
                {/* Logo */}
                <div>
                    <div className="text-xl font-bold mb-6">
                        <h1>Lorem ipsum dolor </h1>
                    </div>
                    <p className="text-sm font-normal my-2">
                        Dashboard
                    </p>

                    {/* Menu Utama */}
                    <nav className="space-y-1">
                        <IconSideNav icon={<Calendar size={18} />} label="Event Saya" active={true} />
                        <IconSideNav icon={<ChartColumn size={18} />} label="Reporting" />
                        <IconSideNav icon={<ReceiptText size={18} />} label="Order" />
                    </nav>

                    {/* Divider */}
                    <div className="border-t border-blue-600 my-4" />

                    {/* Menu Akun */}
                    <nav className="space-y-1">
                        <IconSideNav icon={<Info size={18} />} label="Informasi Dasar" />
                        <IconSideNav icon={<Settings size={18} />} label="Pengaturan" />
                    </nav>
                </div>

                {/* Mode User dan Logout */}
                <div className="space-y-2">
                    <IconSideNav icon={<ArrowRightLeft size={18} />} label="Beralih Ke Customer" />
                    <IconSideNav icon={<LogOut size={18} />} label="Logout" />
                </div>
            </aside>
            <div className="w-full h-fit space-y-12">
            <div className="border-blue-800 w-full border-b-2 h-fit shadow-2xl">
                <Header />
            </div>
            <div>
                <EventSaya/>
            </div>
            </div>
        </div>
        </>
    );

}

export default DashboardPage;