
import { toast } from 'sonner';
import AppError from './AppError';

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
