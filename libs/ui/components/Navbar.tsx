// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react'; // for login session handling

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { data: session } = useSession(); // returns user info if logged in

//   const handleLinkClick = () => {
//     setMobileMenuOpen(false);
//   };

//   return (
//     <header className="bg-green-500 text-gray-900 shadow-md">
//       <div className="relative container mx-auto px-5 py-4">
//         {/* Mobile: Logo and Hamburger */}
        
//         <div className="flex items-center justify-between md:hidden">
            
//           <Link href="/" className="text-xl font-bold tracking-wide">
//             CareBridge
//           </Link>
//           <button
//             aria-label="Toggle Menu"
//             className="text-gray-900 hover:text-black focus:outline-none"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//               viewBox="0 0 24 24"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               {mobileMenuOpen ? (
//                 <path d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
          
          
//         </div>

//         {/* Slide-in Mobile Menu */}
//         <div
//           className={`fixed top-0 right-0 h-full w-64 bg-green-500 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
//             mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           } md:hidden`}
//         >
//           <div className="flex flex-col p-5 space-y-4">
//             <button
//               className="self-end text-xl"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               ✕
//             </button>
//             <Link href="/about-us" className="hover:text-black" >
//               About us
//             </Link>
//             <Link href="/contact-us" className="hover:text-black" >
//               Contact us
//             </Link>
//             <Link href="/h-services" className="hover:text-black" >
//               Services
//             </Link>
//             <Link href="/faq" className="hover:text-black" >
//               FAQ
//             </Link>
//             <Link href="/subscription-plans" className="hover:text-black" >
//               Care plans
//             </Link>
//             {session ? (
//               <Link
//                 href={`/${session?.user?.role}/profile`}
//                 className="btn border border-white bg-white hover:bg-gray-100 text-black rounded text-center transition"
//                 onClick={handleLinkClick}
//               >
//                 Profile
//               </Link>
//             ) : (
//               <Link
//                 href="/auth/login"
//                 className="btn border border-white bg-white hover:bg-gray-100 text-black rounded text-center transition"
//                 onClick={handleLinkClick}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* Desktop Navbar */}
//         <div className="hidden md:flex items-center justify-between">
            
//           <Link href="/" className="text-xl font-bold tracking-wide">
//             CareBridge
//           </Link>
//           <nav className="flex space-x-6">
//             <Link href="/about-us" className="hover:text-black">About us</Link>
//             <Link href="/contact-us" className="hover:text-black">Contact us</Link>
//             <Link href="/h-services" className="hover:text-black">Services</Link>
//             <Link href="/faq" className="hover:text-black">FAQ</Link>
//             <Link href="/subscription-plans" className="hover:text-black">Care Plans</Link>
//           </nav>
//           {session ? (
//             <Link
//               href={`/${session?.user?.role}/profile`}
//               className="btn border border-white bg-white hover:bg-gray-100 text-black rounded transition px-4 py-2"
//             >
//               Profile
//             </Link>
//           ) : (
//             <Link
//               href="/auth/login"
//               className="btn border border-white bg-white hover:bg-gray-100 text-black rounded transition px-4 py-2"
//             >
//               Login
//             </Link>
            
//           )}
          
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

// components/Navbar.tsx


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-green-700"><Link href="/">CareBridge</Link></span>

        <nav className="hidden md:flex items-center space-x-8 text-gray-600">
          <Link href="/about-us" className="hover:text-primary">About us</Link>
          <Link href="/contact-us" className="hover:text-primary">Contact us</Link>
          <Link href="/h-services" className="hover:text-primary">Services</Link>
          <Link href="/subscription-plans" className="hover:text-primary">Care Plans</Link>
        </nav>

        <div className="hidden md:flex items-center">
          {session ? (
            <Link
              href={`/${session.user?.role}/profile`}
              className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-accent transition duration-300"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-accent transition duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4">
          <Link href="/about-us" className="block hover:text-primary" onClick={closeMenu}>About us</Link>
          <Link href="/contact-us" className="block hover:text-primary" onClick={closeMenu}>Contact us</Link>
          <Link href="/h-services" className="block hover:text-primary" onClick={closeMenu}>Services</Link>
          <Link href="/subscription-plans" className="block hover:text-primary" onClick={closeMenu}>Care Plans</Link>
          {session ? (
            <Link
              href={`/${session.user?.role}/profile`}
              className="block bg-green-700 text-white px-6 py-2 rounded-full hover:bg-accent transition duration-300"
              onClick={closeMenu}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="block bg-green-700 text-white px-6 py-2 rounded-full hover:bg-accent transition duration-300"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
