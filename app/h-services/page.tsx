'use client';

import Link from 'next/link';
import { HeartPulse, Stethoscope, Hospital, FlaskConical, Syringe, Baby, Pill } from 'lucide-react';

const ServicesPage = () => {
  const hospitalName = 'CareBridge';
  const specialties = ['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics'];

  const services = [
    {
      title: 'General Consultation',
      icon: <Stethoscope className="w-8 h-8 text-green-600" />,
      description:
        'Routine check-ups and general health guidance from experienced physicians to keep you healthy and informed.',
    },
    {
      title: 'Specialized Care',
      icon: <HeartPulse className="w-8 h-8 text-green-600" />,
      description: `Expert consultations in specialties like ${specialties.join(', ')} and more.`,
    },
    {
      title: 'Emergency Services',
      icon: <Hospital className="w-8 h-8 text-green-600" />,
      description:
        '24/7 emergency care unit, equipped and staffed to respond rapidly to urgent medical needs.',
    },
    {
      title: 'Blood Bank Services',
      icon: <Syringe className="w-8 h-8 text-green-600" />,
      description:
        'Safe and timely transfusions available anytime with our fully-equipped blood bank.',
    },
    {
      title: 'Diagnostic & Lab Services',
      icon: <FlaskConical className="w-8 h-8 text-green-600" />,
      description:
        'Accurate diagnostics through modern imaging, pathology, and lab testing solutions.',
    },
    {
      title: 'Surgical Services',
      icon: <Hospital className="w-8 h-8 text-green-600" />,
      description:
        'Equipped for both minor and complex surgeries using advanced technology and expert surgeons.',
    },
    {
      title: 'Maternity & Baby Care',
      icon: <Baby className="w-8 h-8 text-green-600" />,
      description:
        'Safe and supportive maternity care, including prenatal, delivery, and postnatal services.',
    },
    {
      title: 'Pharmacy & Physiotherapy',
      icon: <Pill className="w-8 h-8 text-green-600" />,
      description:
        'Get prescribed medicines conveniently in-house and recover faster with expert physiotherapy.',
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-50 py-20 px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            Comprehensive Healthcare Services for Every Need
          </h1>
          <p className="text-lg text-gray-700">
            At {hospitalName}, we provide a wide range of healthcare services designed to meet the diverse needs of our patients. Our dedicated medical team ensures you receive the highest quality care with the most advanced technologies and treatments.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/patient/appointment">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium rounded-full transition">
              Book an Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
