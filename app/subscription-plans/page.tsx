'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
type tplan = {
  _id: string,
  planName: string;
  description: string;
  billingCycle: string;
  pharmacyDiscount: number;
  freeConsultions: number;
  price: number
}

const PricingSection: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [allplans, setallplans] = useState<tplan[]>([])
   const router = useRouter();
  useEffect(() => {
    const fetchplans = async () => {
      try {
        const res = await axios.get("/api/subscription-plans")
        setallplans(res.data.data)

      } catch (error) {
        console.log("failed to fetch the subscription plans " + error)
      }
    }
    fetchplans()
  }, [])


  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Subscription plans</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-700">
            Affordable plans with exclusive consultations, discounts, and wellness benefits. Stay healthy with ease!
          </p>
          <div className="flex mx-auto border-2 border-green-500 rounded overflow-hidden mt-6">
            <button
              onClick={() => setBilling('monthly')}
              className={`py-1 px-4 ${billing === 'monthly' ? 'bg-green-500 text-white' : ''} focus:outline-none`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`py-1 px-4 ${billing === 'yearly' ? 'bg-green-500 text-white' : ''} focus:outline-none`}
            >
              Yearly
            </button>

          </div>
        </div>

        {/* Replace this with a map for better reusability */}
        <div className="flex flex-wrap justify-center -m-4">
          {allplans.filter(plan => plan.billingCycle === billing)
          .map((plan, index) => (
            <div key={index} className="p-4 xl:w-1/4 md:w-1/2 w-full">
              <div
                className={`h-full p-6 rounded-lg border-2 border-green-500
                   flex flex-col relative overflow-hidden`}
              >

                <h2 className="text-sm tracking-widest title-font mb-1 font-medium">{plan.planName}</h2>
                <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                  <span>₹{plan.price}</span>
                  {(plan.billingCycle == 'monthly') ? (
                    <span className="text-lg ml-1 font-normal text-gray-500">/mo</span>
                  ) : (
                    <span className="text-lg ml-1 font-normal text-gray-500">/yr</span>
                  )}
                </h1>
                {[['Pharmacy discount(%): ', plan.pharmacyDiscount], ['No of free consultions: ', plan.freeConsultions]].map((feature, i) => (
                  <p key={i} className="flex items-center text-gray-600 mb-2">
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {feature[0] + "" + feature[1]}
                  </p>
                ))}
                <button
                  className={`flex items-center mt-auto text-white bg-green-500 hover:bg-green-600 border-0 py-2 px-4 w-full focus:outline-none rounded`}
                  onClick={() => router.push('/patient/subscribe')}
                >
                  Subscribe
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-auto"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
