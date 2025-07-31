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

import { useAuth } from '@/contexts/AuthContext';


import { signIn } from '@/lib/redux/features/accountSlice';

const SignIn: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { login } = useAuth();
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


      console.log('Full response:', res);
      console.log('Response data:', res.data);
      console.log('Response data result:', res.data?.result);

      // Handle different response structures
      let token = null;
      let user = null;
      let message = 'Login successful';

      // Based on the actual response structure:
      // res.data.result contains: { success: true, message: "...", data: {...}, token: "..." }
      if (res.data?.result) {
        console.log('Using result structure');
        token = res.data.result.token;
        user = res.data.result.data; // User data is in 'data' field, not 'user'
        message = res.data.result.message || message;

        console.log('Token from result:', token);
        console.log('User from result.data:', user);

        // If user is not in data field, maybe the result itself contains user data
        if (!user && res.data.result.id) {
          console.log('User data found directly in result');
          user = res.data.result;
        }
      }
      // Fallback: check if data directly contains user info
      else if (res.data?.id) {
        console.log('Using direct data structure');
        user = res.data;
        token = res.data.token;
        message = res.data.message || message;
      }
      // Another fallback
      else if (res.data?.token) {
        console.log('Using token-based structure');
        token = res.data.token;
        user = res.data.user || res.data;
        message = res.data.message || message;
      }

      console.log('Extracted token:', token);
      console.log('Extracted user:', user);

      // Save token to localStorage
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      }

      // Save user data to auth context
      if (user && (user.id || user.username)) {
        // If user data doesn't have id, we can extract it from token
        let userId = user.id;
        let userEmail = user.email;

        // Try to extract id and email from JWT token if not in user data
        if (!userId || !userEmail) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);
            userId = userId || tokenPayload.id;
            userEmail = userEmail || tokenPayload.email;
          } catch (e) {
            console.warn('Could not parse token payload:', e);
          }
        }

        const userData = {
          id: userId || 0, // fallback to 0 if no id found
          name: user.name || user.username,
          email: userEmail || 'unknown@email.com', // fallback email
          avatar: user.avatar || user.profileImage,
          username: user.username
        };

        console.log('User data to save:', userData);
        login(userData);

        toast.success(message, {
          duration: 3000
        });
        router.push('/');
      } else {
        console.error('No valid user data found in response');
        console.error('Expected user object with id or username, got:', user);
        toast.error('Login failed: Invalid user data received');
        return;
      }

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
