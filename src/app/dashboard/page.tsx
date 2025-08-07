'use client';

import {
  Calendar,
  Info,
  Settings as SettingsIcon,
  LogOut,
  ArrowRightLeft,
  ChartColumn,
  ReceiptText,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

import IconSideNav from './componets/IconSideNav';
import Header from './componets/Header';
import EventSaya from './componets/EventSaya';
import EditProfileForm from './componets/InformasiDasar';
import Reporting from './componets/Reporting';
import Order from './componets/Order';
import Settings from './componets/Settings';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLogin from '@/middleware/Auth';
import AuthOrganizer from '@/middleware/AuthOrganizer';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'event' | 'informasi' | 'reporting' | 'order' | 'setting'
  >('event');

  const router = useRouter();

  const handleNav = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/sign-in');
  };

  useEffect(() => {
    // verifyRole();
  }, []);

  return (
    <>
      <AuthOrganizer />
      <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        {/* Sidebar */}
        <aside
          className={`bg-white/10 backdrop-blur-md shadow-xl border border-white/20 p-4 fixed z-40 lg:static text-white h-full w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out rounded-r-3xl ${
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div>
            {/* Header Sidebar */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1
                    className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => router.push('/')}
                  >
                    Loka Adicara
                  </h1>
                  <p className="text-xs text-purple-200">Event Management</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <IconSideNav
                icon={<Calendar size={18} />}
                label="Event Saya"
                active={activeSection === 'event'}
                onClick={() => setActiveSection('event')}
              />
              <IconSideNav
                icon={<ChartColumn size={18} />}
                label="Reporting"
                active={activeSection === 'reporting'}
                onClick={() => setActiveSection('reporting')}
              />
              <IconSideNav
                icon={<ReceiptText size={18} />}
                label="Order"
                active={activeSection === 'order'}
                onClick={() => setActiveSection('order')}
              />
            </nav>

            <div className="my-6 border-t border-white/10" />

            <nav className="space-y-1">
              <IconSideNav
                icon={<Info size={18} />}
                label="Informasi Dasar"
                active={activeSection === 'informasi'}
                onClick={() => setActiveSection('informasi')}
              />
              <IconSideNav
                icon={<SettingsIcon size={18} />}
                label="Pengaturan"
                active={activeSection === 'setting'}
                onClick={() => setActiveSection('setting')}
              />
            </nav>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <IconSideNav
              icon={<ArrowRightLeft size={18} />}
              label="Beralih Ke Customer"
              onClick={() => handleNav('/')}
            />
            <IconSideNav
              icon={<LogOut size={18} />}
              label="Logout"
              onClick={handleLogout}
            />
          </div>
        </aside>

        {/* Overlay untuk mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          <header className="w-full bg-white/10 backdrop-blur border-b border-white/20 shadow-md">
            <div className="flex items-center justify-between p-4 lg:p-6">
              <button
                className="lg:hidden text-white bg-white/20 p-2 rounded-xl hover:bg-white/30 transition border border-white/30"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Header />
            </div>
          </header>

          <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
            <div className="relative z-10">
              {activeSection === 'event' && <EventSaya />}
              {activeSection === 'informasi' && <EditProfileForm />}
              {activeSection === 'reporting' && <Reporting />}
              {activeSection === 'order' && <Order />}
              {activeSection === 'setting' && <Settings />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
