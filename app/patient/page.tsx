"use client"
import React from 'react'
import { Hospital,CalendarPlus,BedDouble,HeartPulse,Megaphone,ReceiptText,Utensils,Bot } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard
          title="Care Centers"
          subtitle="Browse available care centers and facilities"
          Icon={Hospital}
          navRoute="/patient/care-center"
        />

        <HomeCard
          title="Appointment"
          subtitle="Book appointments and track their status"
          Icon={CalendarPlus}
          navRoute="/patient/appointment"
        />

        <HomeCard
          title="Active Admission"
          subtitle="View your current hospital admissions"
          Icon={BedDouble}
          navRoute="/patient/admission"
        />

        <HomeCard
          title="Regular Checkups"
          subtitle="Track your checkup schedule and treatments"
          Icon={HeartPulse}
          navRoute="/patient/view-carecenter"
        />

        <HomeCard
          title="Announcement & Community"
          subtitle="Access health tips, updates, and discussions"
          Icon={Megaphone}
          navRoute="/patient/community"
        />

        <HomeCard
          title="Chatbot"
          subtitle="Instant support for your health-related queries"
          Icon={Bot}
          navRoute="/patient/chatboat"
        />

        <HomeCard
          title="Meal Planner"
          subtitle="Personalized healthy meal suggestions"
          Icon={Utensils}
          navRoute="/patient/meal-planner"
        />

        <HomeCard
          title="Payment History"
          subtitle="Check your past payments and invoices"
          Icon={ReceiptText}
          navRoute="/patient/payment-history"
        />

      </div>
    </div>
  )
}

export default Page
