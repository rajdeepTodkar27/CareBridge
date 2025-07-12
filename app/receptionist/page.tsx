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
            title="Service Management"
            subtitle="View and manage patient services"
            icon="list_alt"
            navRoute="/receptionist/service"
          />
          <HomeCard
            title="Appointment Requests"
            subtitle="Manage new appointments and check booking status"
            icon="event_available"
            navRoute="/receptionist/appointmentReq"
          />
          <HomeCard
            title="Active Admission"
            subtitle="Assign staff and manage current admissions"
            icon="bed"
            navRoute="/receptionist/admission"
          />
          <HomeCard
            title="Regular Checkups"
            subtitle="Coordinate patient visits and treatment sessions"
            icon="favorite_border"
            navRoute="/receptionist/regular-checkup"
          />
          <HomeCard
            title="Past Admissions"
            subtitle="View history of discharged patients and records"
            icon="history"
            navRoute="/receptionist/admission-history"
          />
          <HomeCard
            title="Announcement & Community"
            subtitle="Respond to patient questions and share updates"
            icon="chat_bubble_outline"
            navRoute="/receptionist/community"
          />
        </div>
      </section>
    </main>
  )
}

export default Page
