"use client"
import React from 'react'
import { Megaphone,BedDouble,HeartPulse,Stethoscope } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard
          title="Dashboard"
          subtitle="Visual insights on patient trends and health data"
          Icon={Stethoscope}
          navRoute="/doctor/dashboard"
        />

        <HomeCard
          title="Regular Checkups"
          subtitle="Manage outpatient appointments and patient records"
          Icon={HeartPulse}
          navRoute="/doctor/regular-checkup"
        />

        <HomeCard
          title="Admitted Patients"
          subtitle="View and manage inpatients under care"
          Icon={BedDouble}
          navRoute="/doctor/admitted-patient"
        />

        <HomeCard
          title="Announcement & Community"
          subtitle="Share and explore health tips and research insights"
          Icon={Megaphone}
          navRoute="/doctor/community"
        />


      </div>
    </div>
  )
}

export default Page
