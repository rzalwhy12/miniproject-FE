import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center bg-[url('/images/sign')] bg-cover bg-center px-4">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-xl overflow-hidden">
          test
        </div>
      </div>
    </>
  );
};

export default SignUp;
