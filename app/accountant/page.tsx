"use client"
import React from 'react'
import { LayoutDashboard,Hospital,HeartPulse,ReceiptText,Megaphone } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard 
          title="Dashboard"
          subtitle="Overview of hospital billing and recent activity"
          Icon={LayoutDashboard}
          navRoute="/accountant/dashboard"
        />
        <HomeCard 
          title="Regular Checkup"
          subtitle="Pending invoices for outpatient visits"
          Icon={HeartPulse}
          navRoute="/accountant/regular-checkup"
        />
        <HomeCard 
          title="Admitted Patient"
          subtitle="Bills due for currently or previously admitted patients"
          Icon={Hospital}
          navRoute="/accountant/admitted-patient"
        />
        <HomeCard 
          title="Payment History"
          subtitle="Track and review all past transactions"
          Icon={ReceiptText}
          navRoute="/accountant/payment-history"
        />
        <HomeCard
          title="Announcement & Community"
          subtitle="Share and explore billing policies, tips, and notices"
          Icon={Megaphone}
          navRoute="/accountant/community"
        />
      </div>
    </div>
  )
}

export default page
