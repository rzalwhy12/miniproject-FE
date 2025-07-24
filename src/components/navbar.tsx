'use client';
import React, { useState } from 'react';
import { Phone, Ticket, Newspaper, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    setShowDropdown(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-16 py-8 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/images/logo/lokaAdicaralogo.png"
          alt="LokaAdicara Logo"
          className="h-28 w-auto object-contain"
        />
      </div>
      {/* Menu */}
      <div className="flex items-center gap-12">
        {/* Contact us */}
        <a
          href="#contact"
          className="flex items-center text-xl text-gray-500 hover:text-pink-500 transition"
        >
          <Phone className="w-7 h-7 mr-2" />
          Contact us
        </a>
        {/* Tickets */}
        <a
          href="#tickets"
          className="flex items-center text-xl text-gray-500 hover:text-pink-500 transition"
        >
          <Ticket className="w-7 h-7 mr-2" />
          Tickets
        </a>
        {/* Blogs */}
        <a
          href="#blogs"
          className="flex items-center text-xl text-gray-500 hover:text-pink-500 transition"
        >
          <Newspaper className="w-7 h-7 mr-2" />
          Blogs
        </a>
        {/* Language Dropdown */}
        <div className="relative">
          <button
            className="flex items-center border rounded-xl px-6 py-3 text-xl text-gray-700 hover:border-pink-400 transition focus:outline-none"
            onClick={() => setShowDropdown((prev) => !prev)}
            type="button"
          >
            {selectedLang}
            <ChevronDown className="w-6 h-6 ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg z-10">
              <button
                className={`block w-full text-left px-4 py-2 text-xl hover:bg-gray-100 rounded-t-xl ${selectedLang === 'EN' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('EN')}
              >
                EN
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-xl hover:bg-gray-100 rounded-b-xl ${selectedLang === 'IND' ? 'font-bold text-pink-500' : ''}`}
                onClick={() => handleLangSelect('IND')}
              >
                IND
              </button>
            </div>
          )}
        </div>
        {/* Login Button */}
        <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-xl text-white font-medium px-9 py-4 rounded-xl transition">
          <User className="w-7 h-7 mr-2" />
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
