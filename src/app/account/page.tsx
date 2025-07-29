'use client';
import React, { useState } from 'react';
import Login from '@/app/account/components/Login';
import SignUp from './components/SignUp';

const AccountPage: React.FC = () => {
  const [page, setPage] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-full font-semibold transition-all duration-300 ${
              page === 'login'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
            }`}
            onClick={() => setPage('login')}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-r-full font-semibold transition-all duration-300 ${
              page === 'signup'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setPage('signup')}
          >
            Sign Upe
          </button>
        </div>
        <div className="animate-fade-in">
          {page === 'login' ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
