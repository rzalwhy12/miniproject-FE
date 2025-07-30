'use client';
import React, { useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { showError } from '@/helper/interceptor';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hook';
import { hideLoading, showLoading } from '@/lib/redux/features/loadingSlice';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/redux/features/accountSlice';
const SignIn: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const btSignIn = async () => {
    try {
      const identifier = identifierRef.current?.value?.trim() || '';
      const password = passwordRef.current?.value || '';

      if (!identifier || !password) {
        return toast.warning('Input required', {
          duration: 3000
        });
      }
      dispatch(showLoading());
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const payload = {
        email: isEmail ? identifier : undefined,
        username: !isEmail ? identifier : undefined,
        password,
        rememberMe
      };

      const res = await apiCall.post('/auth/login', payload);
      dispatch(hideLoading());
      toast.success(res.data.result.message, {
        duration: 3000
      });
      dispatch(signIn(res.data.result.data));
      const token = res.data.result.token;
      localStorage.setItem('token', token);
      router.push('/');
    } catch (error: unknown) {
      dispatch(hideLoading());
      showError(error);
    }
  };

  return (
    <form ref={formRef} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email or Username
        </label>
        <input
          name="identifier"
          placeholder="Enter your email or username"
          required
          ref={identifierRef}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          ref={passwordRef}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(value) => setRememberMe(Boolean(value))}
          />
          <Label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </Label>
        </div>

        <a href="#" className="text-sm text-indigo-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="button"
        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
        onClick={btSignIn}
      >
        Login
      </button>
    </form>
  );
};

export default SignIn;
