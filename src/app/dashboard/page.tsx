'use client';

import {
  Calendar,
  Info,
  Settings,
  LogOut,
  ArrowRightLeft,
  ChartColumn,
  ReceiptText
} from 'lucide-react';
import IconSideNav from './componets/IconSideNav';
import Header from './componets/Header';
import EventSaya from './componets/EventSaya';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { apiCall } from '@/helper/apiCall';
import { useRouter } from 'next/navigation';
import { showError } from '@/helper/interceptor';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const verifyRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.replace('/');
      await apiCall.get('/auth/role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error: unknown) {
      showError(error);
    }
  };

  useEffect(() => {
    verifyRole();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 lg:static bg-pink-800 text-white h-full w-64 flex flex-col justify-between p-4 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div>
          {/* Logo */}
          <div className="text-xl font-bold mb-6">
            <h1>Lorem ipsum dolor</h1>
          </div>
          <p className="text-sm font-normal my-2">Dashboard</p>

          {/* Menu Utama */}
          <nav className="space-y-1">
            <IconSideNav
              icon={<Calendar size={18} />}
              label="Event Saya"
              active
            />
            <IconSideNav icon={<ChartColumn size={18} />} label="Reporting" />
            <IconSideNav icon={<ReceiptText size={18} />} label="Order" />
          </nav>

          <div className="border-t border-pink-500 my-4" />

          {/* Menu Akun */}
          <nav className="space-y-1">
            <IconSideNav icon={<Info size={18} />} label="Informasi Dasar" />
            <IconSideNav icon={<Settings size={18} />} label="Pengaturan" />
          </nav>
        </div>

        {/* Mode User dan Logout */}
        <div className="space-y-2">
          <IconSideNav
            icon={<ArrowRightLeft size={18} />}
            label="Beralih Ke Customer"
          />
          <IconSideNav icon={<LogOut size={18} />} label="Logout" />
        </div>
      </aside>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="w-full border-b-2 border-pink-800 shadow-xl">
          <div className="flex items-center justify-between p-4 lg:p-6">
            {/* Toggle Sidebar Button for Mobile */}
            <button
              className="lg:hidden text-pink-800"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Header />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
          <EventSaya />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
