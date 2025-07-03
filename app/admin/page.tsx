"use client"
import React from 'react'
import { Building2, UserPlus, ListTree } from 'lucide-react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HomeCard 
          title="Create Care Centre"
          subtitle="Register a new care centre in the system"
          Icon={Building2}
          navRoute="/admin/create-carecenter"
        />
        <HomeCard 
          title="Assign Staff"
          subtitle="Link staff members to a care centre"
          Icon={UserPlus}
          navRoute="/admin/assign-staff"
        />
        <HomeCard 
          title="View Care Centres"
          subtitle="Browse all care centres and their assigned staff"
          Icon={ListTree}
          navRoute="/admin/view-carecenter"
        />
      </div>
    </div>
  )
}

export default Page
