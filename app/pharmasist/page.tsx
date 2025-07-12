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
            title="Prescriptions"
            subtitle="View and dispense active patient prescriptions"
            icon="note_add"
            navRoute="/pharmasist"
          />
          <HomeCard
            title="Payment History"
            subtitle="Track billing records for dispensed medicines"
            icon="receipt_long"
            navRoute="/pharmasist/payment-history"
          />
          <HomeCard
            title="Announcement & Community"
            subtitle="Share and explore billing policies, tips, and notices"
            icon="campaign"
            navRoute="/pharmasist/community"
          />
        </div>
      </section>
    </main>
  )
}

export default Page
