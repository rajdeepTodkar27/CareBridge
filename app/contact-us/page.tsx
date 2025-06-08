'use client';

import { Mail, Phone,  } from 'lucide-react';

const ContactUsPage = () => {
  const hospitalName = 'CareBridge';

  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-green-50 py-16 px-6 lg:px-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Get in Touch with {hospitalName}</h1>
        <p className="text-lg max-w-3xl mx-auto">
          We’re here to assist you! Whether you have questions about our services, need help with appointments, or require further information, don’t hesitate to contact us. Our team is ready to support you.
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:px-8 grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
          <form className="grid gap-5">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-green-600" /> Call us at: <span className="font-medium">+91 xxxxx xxxxx</span>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-green-600" /> Email us at: <span className="font-medium">info@carebridge.com</span>
            </p>
          </div>

          
        </div>
      </section>

     
    </div>
  );
};

export default ContactUsPage;
