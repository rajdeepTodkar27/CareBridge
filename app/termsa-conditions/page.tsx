'use client';

import React from 'react';
import Link from 'next/link';

const hospitalName = 'CareBridge';
const effectiveDate = 'June 5, 2025';

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-white text-gray-900">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-green-700">{hospitalName} Terms & Conditions</h1>
      <p className="text-center text-gray-600 mb-12">
        Effective Date: <span className="font-semibold">{effectiveDate}</span>
      </p>

      <section className="mb-10 space-y-6">
        <p>
          By using the services provided by <strong>{hospitalName}</strong>, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">1. Use of Services</h2>
          <p>You agree to use our website and services for lawful purposes only. You are responsible for the accuracy of the information you provide, including personal and medical details.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">2. Appointments and Medical Services</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Appointments:</strong> You may schedule appointments with our healthcare providers via our website. It is your responsibility to ensure the accuracy of appointment details.
            </li>
            <li>
              <strong>Medical Services:</strong> All medical treatments provided by {hospitalName} are subject to availability of our healthcare professionals and facilities.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">3. Payment and Fees</h2>
          <p>
            You agree to pay any applicable fees for the medical services provided. Payment can be made through the payment methods offered on our website. Prices are subject to change, and you will be notified if there are any changes before your appointment.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">4. User Accounts</h2>
          <p>
            To use certain services, you may need to create an account. You are responsible for maintaining the confidentiality of your account details. Please notify us immediately if you suspect any unauthorized access to your account.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">5. Limitation of Liability</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>The use or inability to use the website or services.</li>
            <li>Errors or omissions in the content provided.</li>
            <li>Delays or interruptions in service.</li>
          </ul>
          <p className="mt-4">
            {hospitalName} will not be liable for any damages arising from these causes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">6. Modification of Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. All changes will be effective when posted on this page, and it is your responsibility to review these terms periodically.
          </p>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          href="/contact-us"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}
