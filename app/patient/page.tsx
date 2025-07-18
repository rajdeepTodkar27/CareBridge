'use client';

import React from 'react';
import HomeCard from '@/libs/ui/components/HomeCard';

const HomePage = () => {
  return (
    <main className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen font-roboto">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back,</h1>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HomeCard
              title="Care Centers"
              subtitle="Browse available care centers and facilities"
              navRoute="/patient/care-center"
              icon="store"
            />
            <HomeCard
              title="Appointment"
              subtitle="Book appointments and track their status"
              navRoute="/patient/appointment"
              icon="event"
            />
            <HomeCard
              title="Admission"
              subtitle="View your hospital admissions details"
              navRoute="/patient/admission"
              icon="bed"
            />
            <HomeCard
              title="Regular Checkups"
              subtitle="Track your checkup schedule and treatments"
              navRoute="/patient/regular-checkup"
              icon="favorite_border"
            />
            <HomeCard
              title="Announcement & Community"
              subtitle="Access health tips, updates, and discussions"
              navRoute="/patient/community"
              icon="campaign"
            />
            <HomeCard
              title="Chatbot"
              subtitle="Instant support for your health-related queries"
              navRoute="/patient/chatbot"
              icon="chat_bubble_outline"
            />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Health Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HomeCard
              title="Medication Routine"
              subtitle="Track your medication schedule"
              navRoute="/patient/medical-routine"
              icon="medication"
            />
            <HomeCard
              title="Meal Planner"
              subtitle="Personalized healthy meal suggestions"
              navRoute="/patient/meal-planner"
              icon="restaurant_menu"
            />
            <HomeCard
              title="Payment History"
              subtitle="Check your past payments and invoices"
              navRoute="/patient/payment-history"
              icon="receipt_long"
            />
            <HomeCard
              title="Medical History"
              subtitle="View your past diagnoses and treatments"
              navRoute="/patient/medical-history"
              icon="medical_services"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
