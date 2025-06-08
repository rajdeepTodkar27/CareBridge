'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // for login session handling

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession(); // returns user info if logged in

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-green-500 text-gray-900 shadow-md">
      <div className="relative container mx-auto px-5 py-4">
        {/* Mobile: Logo and Hamburger */}
        
        <div className="flex items-center justify-between md:hidden">
            
          <Link href="/" className="text-xl font-bold tracking-wide">
            CareBridge
          </Link>
          <button
            aria-label="Toggle Menu"
            className="text-gray-900 hover:text-black focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          
        </div>

        {/* Slide-in Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-green-500 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <div className="flex flex-col p-5 space-y-4">
            <button
              className="self-end text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <Link href="/about-us" className="hover:text-black" >
              About us
            </Link>
            <Link href="/contact-us" className="hover:text-black" >
              Contact us
            </Link>
            <Link href="/h-services" className="hover:text-black" >
              Services
            </Link>
            <Link href="/faq" className="hover:text-black" >
              FAQ
            </Link>
            <Link href="/subscription-plans" className="hover:text-black" >
              Care plans
            </Link>
            {session ? (
              <Link
                href={`/${session?.user?.role}/profile`}
                className="btn border border-white bg-white hover:bg-gray-100 text-black rounded text-center transition"
                onClick={handleLinkClick}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="btn border border-white bg-white hover:bg-gray-100 text-black rounded text-center transition"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between">
            
          <Link href="/" className="text-xl font-bold tracking-wide">
            CareBridge
          </Link>
          <nav className="flex space-x-6">
            <Link href="/about-us" className="hover:text-black">About us</Link>
            <Link href="/contact-us" className="hover:text-black">Contact us</Link>
            <Link href="/h-services" className="hover:text-black">Services</Link>
            <Link href="/faq" className="hover:text-black">FAQ</Link>
            <Link href="/subscription-plans" className="hover:text-black">Care Plans</Link>
          </nav>
          {session ? (
            <Link
              href={`/${session?.user?.role}/profile`}
              className="btn border border-white bg-white hover:bg-gray-100 text-black rounded transition px-4 py-2"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="btn border border-white bg-white hover:bg-gray-100 text-black rounded transition px-4 py-2"
            >
              Login
            </Link>
            
          )}
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
