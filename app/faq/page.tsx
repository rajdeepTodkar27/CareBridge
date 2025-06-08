'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const hospitalName = 'CareBridge';

  const faqs = [
    {
      question: 'How can I book an appointment?',
      answer: `You can easily book an appointment through our website by visiting the 'Book Appointment' section or directly reaching at our hospital nearest distance from your location`,
    },
    {
      question: 'What should I bring to my first appointment?',
      answer: 'Please bring a valid ID, insurance details (if applicable), and any relevant medical records or prescriptions.',
    },
    {
      question: 'Do you accept insurance?',
      answer: "Yes, we accept a variety of insurance plans. Please check our 'Insurance' section on the website or contact us for more details.",
    },
    {
      question: 'What is the process for a blood donation?',
      answer: 'You can donate blood at our Blood Bank during operating hours. Visit the Blood Bank section for more details on eligibility and timing.',
    },
    {
      question: 'What services do you offer for emergency care?',
      answer: "Our emergency department is open 24/7, providing immediate medical care for urgent situations. Visit our 'Emergency Services' section for more information.",
    },
    {
      question: 'Can I access my medical records online?',
      answer: 'Yes, once you register and log in to our Patient Portal, you can view your medical history, test results, and appointments.',
    },
    {
      question: "What is your hospital's visitor policy?",
      answer: 'Our visitor policy ensures a safe and comfortable experience for patients. Please refer to the visitor guidelines on the website or contact us directly.',
    },
    {
      question: 'Is parking available at the hospital?',
      answer: 'Yes, we have ample parking available for patients and visitors.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white text-gray-800 max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <p className="text-center mb-12 text-gray-700 max-w-xl mx-auto">
        Here are some of the most commonly asked questions about our hospital and services. If you can’t find what you’re looking for, feel free to contact us directly.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggle(i);
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              {openIndex === i ? (
                <ChevronUp className="w-5 h-5 text-green-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            {openIndex === i && <p className="mt-3 text-gray-700">{faq.answer}</p>}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-700">
  <p>
    If you have further questions, feel free to reach out through our{' '}
    <Link href="/contact-us" className="text-green-600 font-semibold hover:underline">
      Contact Us
    </Link>{' '}
    page.
  </p>
</div>

    </div>
  );
};

export default FAQPage;
