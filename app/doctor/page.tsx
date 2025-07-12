"use client"
import React from "react"
import HomeCard from "@/libs/ui/components/HomeCard"

const Page = () => {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800">Welcome back,</h1>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HomeCard
            title="Dashboard"
            subtitle="Visual insights on patient trends and health data"
            icon="monitor_heart"
            navRoute="/doctor/dashboard"
          />
          <HomeCard
            title="Regular Checkups"
            subtitle="Manage outpatient appointments and patient records"
            icon="favorite_border"
            navRoute="/doctor/regular-checkup"
          />
          <HomeCard
            title="Admitted Patients"
            subtitle="View and manage inpatients under care"
            icon="bed"
            navRoute="/doctor/admitted-patient"
          />
          <HomeCard
            title="Announcement & Community"
            subtitle="Share and explore health tips and research insights"
            icon="campaign"
            navRoute="/doctor/community"
          />
        </div>
      </section>
    </main>
  )
}

export default Page
