import { apiCall } from '@/helper/apiCall';
import React, { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const formSignUpRef = useRef<HTMLFormElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onBtSignUp = async () => {
    try {
      if (formSignUpRef.current) {
        const inputSignUp = new FormData(formSignUpRef.current);
        const password = inputSignUp.get('password')?.toString() || '';
        const confirmPassword =
          inputSignUp.get('confirmPassword')?.toString() || '';

        if (password !== confirmPassword) {
          alert('Password dan Konfirmasi Password tidak sama');
          return;
        }

        const payload = {
          name: inputSignUp.get('name'),
          username: inputSignUp.get('username'),
          email: inputSignUp.get('email'),
          password,
          referralCode: inputSignUp.get('referralCode') || null
        };

        const res = await apiCall.post('/auth/sign-up', payload);
        if (res.data?.result?.success) {
          alert('Berhasil');
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Gagal');
    }
  };

  const inputClass =
    'w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:outline-none transition';

  return (
    <form ref={formSignUpRef} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          name="name"
          placeholder="Enter your full name"
          required
          className={inputClass + ' focus:ring-indigo-400'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          name="username"
          placeholder="Choose a username"
          required
          className={inputClass + ' focus:ring-indigo-400'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className={inputClass + ' focus:ring-indigo-400'}
        />
      </div>

      {/* Password Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          required
          className={inputClass + ' focus:ring-indigo-400'}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          required
          className={inputClass + ' focus:ring-pink-400'}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-gray-500"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Referral Code{' '}
          <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <input
          name="referralCode"
          placeholder="Enter referral code (optional)"
          className={inputClass + ' focus:ring-gray-400'}
        />
      </div>

      <button
        type="button"
        onClick={onBtSignUp}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center justify-center"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
