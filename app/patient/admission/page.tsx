'use client';

import React from 'react';
import HomeCard from '@/libs/ui/components/HomeCard';

const HomePage = () => {
  return (
    <main className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen font-roboto">
      <div className="container mx-auto px-6 py-12">

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Manage Your Hospital Admissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HomeCard
              title="Active Admission"
              subtitle="View your current hospital admissions"
              navRoute="/patient/current-admission"
              icon="bed"
            />
            <HomeCard
              title="Previous Admission"
              subtitle="Review previous hospital admissions and treatments"
              navRoute="/patient/past-admission"
              icon="history"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
