'use client';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import {
  userLogin,
  userLogout,
  setChecking
} from '@/lib/redux/features/accountSlice';
import { hideLoading, showLoading } from '@/lib/redux/features/loadingSlice';
import { useAppDispatch } from '@/lib/redux/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const checkLogin = async () => {
    dispatch(showLoading());
    dispatch(setChecking(true));

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const res = await apiCall.get('/auth/keep-login', {
          headers: { Authorization: `Bearer ${token}` }
        });

        dispatch(userLogin(res.data.result.data));
      } catch (error) {
        dispatch(userLogout());
        localStorage.removeItem('token');
        showError(error);
        router.replace('/');
      }
    } else {
      dispatch(userLogout());
      localStorage.removeItem('token');
      router.replace('/');
    }

    dispatch(hideLoading());
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return null;
};

export default AuthLogin;
