'use client';

import React from 'react';
import Link from 'next/link';

const hospitalName = 'CareBridge';
const contactEmail = 'info@carebridge.com'; // update as needed
const effectiveDate = 'June 5, 2025';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-white text-gray-900">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-green-700">{hospitalName} Privacy Policy</h1>
      <p className="text-center text-gray-600 mb-12">
        Effective Date: <span className="font-semibold">{effectiveDate}</span>
      </p>

      <section className="mb-10 space-y-6">
        <p>
          At <strong>{hospitalName}</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
        </p>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Personal Identification:</strong> Name, phone number, email address, and other personal details.</li>
            <li><strong>Medical Information:</strong> Health history, symptoms, diagnoses, and treatment details.</li>
            <li><strong>Appointment Data:</strong> Information about your appointments, including date, time, and doctor’s details.</li>
            <li><strong>Payment Information:</strong> For billing purposes, we may collect payment details when necessary.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Provide healthcare services, including appointment scheduling and medical consultations.</li>
            <li>Process payments and billing.</li>
            <li>Improve our services and website performance.</li>
            <li>Communicate with you about your appointments and care.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">3. How We Protect Your Information</h2>
          <p>We implement security measures to protect your personal and medical information from unauthorized access. This includes encryption, firewalls, and secure data storage.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">4. Sharing Your Information</h2>
          <p className="mb-3">We do not share your personal information with third parties except in the following cases:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>With your consent, such as sharing information with specialists or healthcare providers.</li>
            <li>When required by law or to protect our legal rights.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-green-300 pb-2">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Access, update, or delete your personal information.</li>
            <li>Withdraw consent for data collection at any time (subject to legal limitations).</li>
          </ul>
          <p className="mt-5 text-gray-800">
            For any questions regarding your privacy, please <strong>contact us</strong> at{' '}
            <span className="font-mono bg-green-100 px-2 py-1 rounded">{contactEmail}</span>.
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
