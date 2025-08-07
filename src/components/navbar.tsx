'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  UserCircle,
  Repeat
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { toast } from 'sonner';
import { userLogin, userLogout } from '@/lib/redux/features/accountSlice';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';

export const ShowNavbar = () => {
  const pathname = usePathname();
  if (
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname.startsWith('/verify') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/reporting')
  )
    return null;

  return <Navbar />;
};

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isLogin, name, role } = useAppSelector((state) => state.account);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    dispatch(userLogout());
    setShowDropdown(false);
    setMobileMenuOpen(false);
    toast.success('Signed Out');
  };

  const handleSwitchRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const targetRoleId = role.trim().toUpperCase() === 'ORGANIZER' ? 1 : 2;

      const res = await apiCall.get(`/auth/switch-role/${targetRoleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('token', res.data.result.token);
      dispatch(userLogin(res.data.result.data));
      setShowDropdown(false);

      const roleName = res.data.result.data.role.toLowerCase();
      toast.success(`You're now a ${roleName}`);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm transition-all">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo/lokaAdicaralogo.png"
            alt="LokaAdicara"
            className="h-10 sm:h-12 object-contain"
          />
        </Link>

        {/* Hamburger */}
        <button
          className="lg:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Menu */}
        <div
          className={`fixed top-0 left-0 h-screen w-4/5 bg-white z-40 shadow-md flex flex-col pt-20 gap-4 px-6 transition-transform duration-300 ease-in-out transform
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:static lg:translate-x-0 lg:flex lg:flex-row lg:items-center lg:justify-end lg:h-auto lg:w-auto lg:bg-transparent lg:shadow-none lg:pt-0 lg:gap-6 xl:gap-8
          `}
        >
          {/* Left Nav */}
          <a
            href="/contact"
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 text-sm sm:text-base"
          >
            <Phone className="w-5 h-5" />
            Contact
          </a>
          <a
            href="/tickets"
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 text-sm sm:text-base 
            "
          >
            <Ticket className="w-5 h-5" />
            Tickets
          </a>
          <a
            href="#blogs"
            className="flex items-center gap-2 text-gray-600 hover:text-pink-500 text-sm sm:text-base"
          >
            <Newspaper className="w-5 h-5" />
            Blogs
          </a>

          {/* Action Buttons */}
          {isLogin && role === 'ORGANIZER' && (
            <Link
              href="/create"
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              <Plus className="w-4 h-4" />
              Create
            </Link>
          )}

          {isLogin && role === 'CUSTOMER' && (
            <Link
              href="/my-tickets"
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              <Ticket className="w-4 h-4" />
              My Tickets
            </Link>
          )}

          {/* Profile/Login */}
          {isLogin ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md max-w-[150px] sm:max-w-[200px]"
              >
                <UserCircle className="w-4 h-4 shrink-0" />
                <span className="truncate whitespace-nowrap overflow-hidden">
                  {name}
                </span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Ticket className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSwitchRole}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Repeat className="w-4 h-4" />
                    Switch to {role === 'CUSTOMER' ? 'Organizer' : 'Customer'}
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-1.5 rounded-md"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
