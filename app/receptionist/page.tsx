"use client"
import React from 'react'
import {BedDouble,CalendarCheck,MessageCircle,ClipboardList,HeartPulse } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <HomeCard
                    title="Appointment Requests"
                    subtitle="Manage new appointments and check booking status"
                    Icon={CalendarCheck}
                    navRoute="/Receptionist/appointment"
                />

                <HomeCard
                    title="Active Admission"
                    subtitle="Assign staff and manage current admissions"
                    Icon={BedDouble}
                    navRoute="/Receptionist/admission"
                />

                <HomeCard
                    title="Regular Checkups"
                    subtitle="Coordinate patient visits and treatment sessions"
                    Icon={HeartPulse}
                    navRoute="/Receptionist/view-carecenter"
                />

                <HomeCard
                    title="Past Admissions"
                    subtitle="View history of discharged patients and records"
                    Icon={ClipboardList}
                    navRoute="/Receptionist/admission-history"
                />

                <HomeCard
                    title="Announcement & Community"
                    subtitle="Respond to patient questions and share updates"
                    Icon={MessageCircle}
                    navRoute="/Receptionist/community"
                />


            </div>
        </div>
    )
}

export default Page
