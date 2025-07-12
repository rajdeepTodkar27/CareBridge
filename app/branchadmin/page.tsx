"use client"
import React from 'react'
import HomeCard from '@/libs/ui/components/HomeCard'

const Page = () => {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800">Welcome back,</h1>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HomeCard 
            title="Create Care Centre"
            subtitle="Register a new care centre in the system"
            icon="store"
            navRoute="/branchadmin/create-carecenter"
          />
          <HomeCard 
            title="Assign Staff"
            subtitle="Link staff members to a care centre"
            icon="person_add"
            navRoute="/branchadmin/assign-staff"
          />
          <HomeCard 
            title="View Care Centres"
            subtitle="Browse all care centres and their assigned staff"
            icon="account_tree"
            navRoute="/branchadmin/view-carecenter"
          />
        </div>
      </section>
    </main>
  )
}

export default Page
