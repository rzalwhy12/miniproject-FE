'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Ticket,
  Newspaper,
  ChevronDown,
  User,
  Menu,
  X,
  Plus,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const ShowNavbar = () => {
  const pathname = usePathname();

  if (
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname.startsWith('/verify')
  )
    return null;
  return <Navbar />;
};

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-8 lg:px-8 xl:px-16 py-4 sm:py-6 lg:py-4 xl:py-8 bg-white relative z-10">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/images/logo/lokaAdicaralogo.png"
          alt="LokaAdicara Logo"
          className="h-12 sm:h-20 lg:h-16 xl:h-28 w-auto object-contain"
        />
      </div>
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden flex items-center text-gray-700 focus:outline-none z-50"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        type="button"
      >
        {mobileMenuOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <Menu className="w-8 h-8" />
        )}
      </button>
      {/* Menu */}
      <div
        className={`
          flex-col
          fixed top-0 left-0 h-screen w-4/5 max-w-xs bg-white shadow-md z-20 transition-transform duration-[2000ms] ease-in-out transform
          ${mobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}
          lg:static lg:flex lg:flex-row lg:items-center lg:h-auto lg:w-auto lg:max-w-none lg:bg-transparent lg:shadow-none lg:z-auto lg:transition-none lg:transform-none lg:translate-x-0
          gap-4 sm:gap-8 lg:gap-12
        `}
        style={{ transitionProperty: 'transform' }}
      >
        {/* Contact us */}
        <a
          href="#contact"
          className="ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0 mt-20 lg:mt-0"
        >
          <Phone className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Contact us
        </a>
        {/* Tickets */}
        <a
          href="#tickets"
          className="ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0"
        >
          <Ticket className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Tickets
        </a>
        {/* Blogs */}
        <a
          href="#blogs"
          className="ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0"
        >
          <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Blogs
        </a>
        {/* Language Dropdown */}
        <div className="relative w-full lg:w-auto max-w-[200px] mb-8 lg:mb-0">
          <button
            className="ml-5 flex items-center border rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-base lg:text-lg xl:text-xl text-gray-700 hover:border-pink-400 transition focus:outline-none w-full lg:w-auto justify-between"
            onClick={() => setShowDropdown((prev) => !prev)}
            type="button"
          >
            {selectedLang}
            <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-2" />
          </button>
          {showDropdown && (
            <div className="ml-5 absolute left-0 right-0 lg:right-0 lg:left-auto mt-2 min-w-full lg:min-w-[4rem] bg-white border rounded-xl shadow-lg z-20 overflow-hidden mb-20">
              <button
                className={`block w-[50px] text-left px-4 py-2 text-lg sm:text-xl hover:bg-gray-100 ${selectedLang === 'EN' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('EN')}
              >
                EN
              </button>
              <button
                className={`block w-[50px] text-left px-4 py-2 text-lg sm:text-xl hover:bg-gray-100 ${selectedLang === 'IND' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('IND')}
              >
                IND
              </button>
            </div>
          )}
        </div>

        {/* Create Event Button */}
        {isAuthenticated ? (
          <Link
            href="/create"
            className="flex items-center bg-pink-500 hover:bg-pink-600 text-base lg:text-lg xl:text-xl text-white font-medium px-3 lg:px-4 xl:px-6 py-2 lg:py-2 xl:py-3 rounded-lg lg:rounded-xl transition w-[200px] lg:w-auto justify-center mx-5 mt-4 mb-3 lg:mt-0 lg:mb-0 lg:mx-0"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1 lg:mr-2" />
            <span className="text-sm lg:text-base xl:text-lg">Create Event</span>
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center bg-pink-500 hover:bg-pink-600 text-base lg:text-lg xl:text-xl text-white font-medium px-3 lg:px-4 xl:px-6 py-2 lg:py-2 xl:py-3 rounded-lg lg:rounded-xl transition w-[200px] lg:w-auto justify-center mx-5 mt-4 mb-3 lg:mt-0 lg:mb-0 lg:mx-0"
            title="Login required to create events"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1 lg:mr-2" />
            <span className="text-sm lg:text-base xl:text-lg">Create Event</span>
          </Link>
        )}

        {/* Login/Profile Button */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-base lg:text-lg xl:text-xl text-white font-medium px-3 lg:px-4 xl:px-6 py-2 lg:py-2 xl:py-3 rounded-lg lg:rounded-xl transition w-full lg:w-auto justify-center mx-5 mb-6 lg:mb-0 lg:mx-0"
            >
              <UserCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1 lg:mr-2" />
              <span className="text-sm lg:text-base xl:text-lg">{user?.name || user?.username || 'Profile'}</span>
              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-base lg:text-lg xl:text-xl text-white font-medium px-3 lg:px-4 xl:px-6 py-2 lg:py-2 xl:py-3 rounded-lg lg:rounded-xl transition w-full lg:w-auto justify-center mx-5 mb-6 lg:mb-0 lg:mx-0"
          >
            <User className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1 lg:mr-2" />
            <span className="text-sm lg:text-base xl:text-lg">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
