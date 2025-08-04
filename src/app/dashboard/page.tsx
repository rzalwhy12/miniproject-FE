'use client';

import {
  Calendar,
  Info,
  Settings,
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
import { useEffect, useState } from 'react';
import { apiCall } from '@/helper/apiCall';
import { useRouter } from 'next/navigation';
import { showError } from '@/helper/interceptor';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'event' | 'informasi' | 'reporting' | 'order'
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
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Background effect */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-30 animate-pulse -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full filter blur-3xl opacity-25 animate-pulse -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse -z-10"></div>

      <aside
        className={`bg-gradient-to-b from-indigo-800/90 via-purple-700/90 to-pink-600/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 fixed z-40 lg:static text-white h-full w-72 flex flex-col justify-between transition-all duration-500 ease-in-out border border-white/20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Loka Adicara
              </h1>
              <p className="text-xs text-purple-200 font-normal">
                Event Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            <p className="text-sm font-medium text-purple-200">Dashboard</p>
          </div>

          {/* Sidebar Navigation */}
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

          <div className="border-t border-gradient-to-r from-pink-400/30 to-purple-400/30 my-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent h-px"></div>
          </div>

          <nav className="space-y-1">
            <IconSideNav
              icon={<Info size={18} />}
              label="Informasi Dasar"
              active={activeSection === 'informasi'}
              onClick={() => setActiveSection('informasi')}
            />
            <IconSideNav
              icon={<Settings size={18} />}
              label="Pengaturan"
              onClick={() => handleNav('/dashboard/settings')}
            />
          </nav>
        </div>

        {/* Bottom Menu */}
        <div className="space-y-2">
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
          className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Konten utama */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent">
        {/* Header */}
        <div className="w-full backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <button
              className="lg:hidden text-white bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Header />
          </div>
        </div>

        {/* Konten berdasarkan menu aktif */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
          <div className="relative z-10">
            {activeSection === 'event' && <EventSaya />}
            {activeSection === 'informasi' && <EditProfileForm />}
            {activeSection === 'reporting' && (
              <div className="text-white">[Reporting Section Placeholder]</div>
            )}
            {activeSection === 'order' && (
              <div className="text-white">[Order Section Placeholder]</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
