'use client';

import Link from 'next/link';

const AboutPage = () => {
  const hospitalName = 'CareBridge';
  const establishedYear = '2010';

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-green-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About {hospitalName} – Your Trusted Healthcare Provider
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {hospitalName} is dedicated to providing the highest standard of healthcare with compassion, expertise, and convenience.
              Established in {establishedYear}, we have grown into a leading healthcare provider in the community, committed to the well-being of our patients.
            </p>
          </div>
        </div>
      </div>

      {/* Values + Vision + Mission */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is simple: to provide comprehensive, high-quality care to individuals and families, treating every patient with respect and compassion.
              We believe in making healthcare accessible, efficient, and personalized to meet the unique needs of each person.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To become the most trusted healthcare institution, known for our excellence in service, cutting-edge medical technologies, and commitment to patient care.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Compassion:</strong> We treat every patient with care and empathy.</li>
              <li><strong>Excellence:</strong> We offer the highest standard of healthcare through skilled professionals and state-of-the-art facilities.</li>
              <li><strong>Integrity:</strong> We are honest, transparent, and accountable in all our practices.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600">
              Our team consists of highly skilled doctors, nurses, technicians, and support staff. Together, we create a compassionate and professional environment where patients receive top-notch care.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Comprehensive services under one roof</h3>
              <p>From diagnostics to consultation — we offer everything in one place.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Advanced medical technologies</h3>
              <p>We use the latest tools and procedures for accurate treatment.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Experienced medical professionals</h3>
              <p>Our doctors and staff are experts in their respective fields.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Easy online appointment booking</h3>
              <p>Book appointments from the comfort of your home.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Patient-first approach</h3>
              <p>Your comfort, safety, and well-being are always our priority.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div>Learn More About </div>
            
            <Link href="/h-services">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium rounded-full transition">
                Our Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
