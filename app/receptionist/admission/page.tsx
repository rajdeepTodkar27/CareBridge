"use client"
import React from "react"
import HomeCard from "@/libs/ui/components/HomeCard"

const Page = () => {
    return (
        <main className="container mx-auto px-6 py-12">

            <section className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                    Manage Admissions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <HomeCard
                        title="Register Admission"
                        subtitle="Initiate admission for a new patient"
                        icon="person_add"
                        navRoute="/receptionist/admission/register-admission"
                    />

                    <HomeCard
                        title="Admitted Patients"
                        subtitle="Monitor current inpatients and their details"
                        icon="local_hospital"
                        navRoute="/receptionist/admission/admitted-patients"
                    />

                    <HomeCard
                        title="Room & Ward Availability"
                        subtitle="Check vacant rooms and special ward options"
                        icon="hotel"
                        navRoute="/patient/appointment/room-availability"
                    />

                </div>
            </section>
        </main>
    )
}

export default Page
