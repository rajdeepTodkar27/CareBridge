"use client"
import React from 'react'
import {Megaphone,HeartPulse,BedDouble } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard
          title="Admitted Patients"
          subtitle="Manage care for actively admitted patients"
          Icon={BedDouble}
          navRoute="/nurse/create-carecenter"
        />

        <HomeCard
          title="Regular Checkup"
          subtitle="Support and track outpatient visits"
          Icon={HeartPulse}
          navRoute="/nurse/regular-checkup"
        />

        <HomeCard
          title="Announcement & Community"
          subtitle="Health posts and updates for nursing staff"
          Icon={Megaphone}
          navRoute="/nurse/community"
        />

      </div>
    </div>
  )
}

export default Page
