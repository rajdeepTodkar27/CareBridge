"use client"
import React from 'react'
import { ReceiptText,Megaphone,ClipboardList } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard
          title="Prescriptions"
          subtitle="View and dispense active patient prescriptions"
          Icon={ClipboardList }
          navRoute="/pharmasist"
        />

        <HomeCard
          title="Payment History"
          subtitle="Track billing records for dispensed medicines"
          Icon={ReceiptText}
          navRoute="/pharmasist/payment-history"
        />
        <HomeCard
          title="Announcement & Community"
          subtitle="Share and explore billing policies, tips, and notices"
          Icon={Megaphone}
          navRoute="/pharmasist/community"
        />
      </div>
    </div>  
  )
}

export default Page
