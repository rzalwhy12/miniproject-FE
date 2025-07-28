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
} from 'lucide-react';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    setShowDropdown(false);
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
          className=" ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0 mt-25 lg:mt-0"
        >
          <Phone className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Contact us
        </a>
        {/* Tickets */}
        <a
          href="#tickets"
          className=" ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0"
        >
          <Ticket className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Tickets
        </a>
        {/* Blogs */}
        <a
          href="#blogs"
          className=" ml-5 flex items-center text-lg sm:text-xl text-gray-500 hover:text-pink-500 transition px-4 py-2 md:p-0"
        >
          <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Blogs
        </a>
        {/* Language Dropdown */}
        <div className="relative w-full lg:w-auto max-w-[200px] mb-25 lg:mb-0">
          <button
            className=" ml-5 flex items-center border rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-lg sm:text-xl text-gray-700 hover:border-pink-400 transition focus:outline-none w-full lg:w-auto justify-between"
            onClick={() => setShowDropdown((prev) => !prev)}
            type="button"
          >
            {selectedLang}
            <ChevronDown className="w-4 h-4 sm:w-3 sm:h-3 ml-2" />
          </button>
          {showDropdown && (
            <div className=" ml-5 absolute left-0 right-0 lg:right-0 lg:left-auto mt-2 min-w-full lg:min-w-[4rem] bg-white border rounded-xl shadow-lg z-20 overflow-hidden">
              <button
                className={`block w-full text-left px-4 py-2 text-lg sm:text-xl hover:bg-gray-100 ${selectedLang === 'EN' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('EN')}
              >
                EN
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-lg sm:text-xl hover:bg-gray-100 ${selectedLang === 'IND' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('IND')}
              >
                IND
              </button>
            </div>
          )}
        </div>
        {/* Login Button */}

        <Link href="/signin" className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-lg sm:text-xl text-white font-medium px-6 sm:px-9 py-3 sm:py-4 rounded-xl transition w-[200px] lg:w-auto justify-center ml-5">
          <User className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
