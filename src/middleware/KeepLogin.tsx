'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hook';
import { apiCall } from '@/helper/apiCall';
import { showError } from '@/helper/interceptor';
import { userLogin, userLogout } from '@/lib/redux/features/accountSlice';

const KeepLoginProvider = () => {
  const dispatch = useAppDispatch();

  const checkLogin = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await apiCall.get('/auth/keep-login', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(userLogin(res.data.result.data));
    } catch (error) {
      dispatch(userLogout());
      localStorage.removeItem('token');
      showError(error);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return null;
};

export default KeepLoginProvider;
