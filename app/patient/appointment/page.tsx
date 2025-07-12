"use client"
import React from "react"
import HomeCard from "@/libs/ui/components/HomeCard"

const Page = () => {
  return (
    <main className="container mx-auto px-6 py-12">

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Manage Appointments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HomeCard
            title="Get Appointment"
            subtitle="Book a new appointment with doctors"
            icon="event_available"
            navRoute="/patient/appointment/get-appointment"
          />
          <HomeCard
            title="Check Status"
            subtitle="View the status of your appointments"
            icon="event_note"
            navRoute="/patient/appointment/status"
          />
          <HomeCard
            title="Appointment History"
            subtitle="Review your past appointments"
            icon="history"
            navRoute="/patient/appointment/history"
          />
        </div>
      </section>
    </main>
  )
}

export default Page
