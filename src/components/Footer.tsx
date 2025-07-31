'use client';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePathname } from 'next/navigation';
import { InstagramIcon, FacebookIcon, X, YoutubeIcon } from 'lucide-react';

export const ShowFooter = () => {
  const pathname = usePathname();

  if (
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/dashboard')
  )
    return null;
  return <Footer />;
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Let's keep in touch</h3>
            <p className="text-gray-300 mb-6 text-sm">
              Stay updated with Concert Hub's latest news and exclusive offers!
            </p>
            <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
                Subscribe Now
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              By subscribing, you agree to our terms & conditions & Privacy
              Policy
            </p>
          </div>

          {/* Concert Hub Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Loka Adicara</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Event organizers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Getting there
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Looking For Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Looking For Help</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Customer Service
                </a>
              </li>
            </ul>
          </div>

          {/* Looking For More Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Looking For More</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cancelled Concerts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cancellation Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rescheduled Events
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-6">
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Twitter"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Share"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="Instagram"
                >
                  <X className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © Loka Adicara All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
