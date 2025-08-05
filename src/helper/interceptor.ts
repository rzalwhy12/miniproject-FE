import { toast } from 'sonner';
import { apiCall } from './apiCall';
import AppError from './AppError';

//buat nangkap error dari BE
apiCall.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data.result;

    throw new AppError(data?.message, error.response?.status);
  }
);

export const showError = (error: unknown) => {
  if (error instanceof AppError) {
    if (
      error.message === 'Token expired' ||
      error.message === 'jwt malformed'
    ) {
      return;
    }
    toast.error(error.message);
  } else if (error instanceof Error) {
    console.log(error);
    toast.error(error.message);
  } else {
    toast.error('something went wrong');
  }
};
