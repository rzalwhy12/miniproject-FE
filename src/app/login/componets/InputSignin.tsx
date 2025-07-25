"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

const FormSignIn = () => {


  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-xl overflow-hidden">

        <div className="bg-white p-8 flex flex-col items-center justify-center text-center">
          <Image
            src="/article.jpg"
            alt="Event Illustration"
            width={300}
            height={300}
          />
          <h2 className="text-xl font-semibold mt-6">
            Lorem ipsum dolor</h2>
          <p className="text-gray-500 mt-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>


        <div className="bg-gray-50 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-black">Masuk ke akunmu</h2>
          <p className="text-sm text-gray-500 mb-6">
            Belum punya akun?
            <Link href="/register" className="text-blue-600 font-medium">
              Daftar
            </Link>
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"


              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" >
              Masuk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSignIn;
