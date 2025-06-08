"use client"

import Navbar from '@/libs/ui/components/Navbar'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';

const images = [
  '/p-1.jpg',
    '/p-2.jpg',
    '/p-3.jpg',
    
];
const page = () => {
  const router = useRouter()
  const handleNavigate =()=>{
    router.push("/access-account")
  }
    const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
     <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
           Trusted Healthcare, Made Easy
          </h1>
          <p className="mb-8 leading-relaxed">
            At CareBridge, manage your healthcare with ease — book doctor appointments, access lab reports, consult specialists, and get diagnostic services — all from one simple, secure platform.
            Accessible anytime, anywhere — no long queues or paperwork.
            Your complete care, right at your fingertips.</p>
          <div className="flex justify-center">
            <button
              onClick={handleNavigate}
              className="inline-flex text-black bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 hover:cursor-pointer rounded text-lg"
            >
              Get Started
            </button>
            
          </div>
        </div>
           <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 overflow-hidden rounded shadow-lg">
      <img
        className="object-cover object-center w-full h-full transition-opacity duration-700 ease-in-out"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
      />
    </div>
      </div>
    </section>
    </div>
  )
}

export default page
