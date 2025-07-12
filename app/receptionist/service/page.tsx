"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/libs/ui/shadcn/button"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

interface Service {
    _id: string
    serviceName: string
    category: string
    department: string
    baseCost: number
    unit: string
    description?: string  // optional since it's not always required
    isActive: boolean     // still needed for toggling active/inactive
}

const ServiceListPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [showModal, setShowModal] = useState(false)

    const router = useRouter()
    const { data: session } = useSession()
    const [centerId, setcenterId] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Service>()

    useEffect(() => {
        if (session?.user?.centerId) {
            setcenterId(session.user.centerId)
        }
    }, [session])

    useEffect(() => {
        if (centerId) fetchServices()
    }, [centerId])

    const fetchServices = async () => {
        try {
            const res = await axios.get(`/api/services/${centerId}`)
            setServices(res.data.data)
        } catch (error) {
            console.error("Failed to fetch services", error)
        }
    }

    const updateService = async (data: Service) => {
        try {
            await axios.put(`/api/services/${centerId}`, data)
            console.log(data);

            setShowModal(false)
            fetchServices()
        } catch (err) {
            console.error("Failed to update service")
        }
    }

    const handleEditClick = (service: Service) => {
        setSelectedService(service)
        reset(service)
        setShowModal(true)
    }

    const toggleActive = async (service: Service) => {
        try {
            const updatedService = { ...service, isActive: !service.isActive }
            await axios.put(`/api/services/${centerId}`, updatedService)
            fetchServices()
        } catch (err) {
            console.error("Failed to update service status")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-5">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0d141c]">Services</h1>

                <Button
                    className="bg-[#e7edf4] text-[#0d141c] hover:bg-[#cbd1d7] text-sm font-medium h-8 px-3 sm:px-4"
                    onClick={() => router.push('/receptionist/create-service')}
                >
                    Create New Service
                </Button>

            </div>

            <div className="overflow-x-auto rounded-lg border border-[#cedbe8] bg-white">
                <table className="w-full min-w-[500px]">

                    <thead>
                        <tr className="bg-slate-50">
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Service Name</th>
                            <th className="hidden md:table-cell text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Category</th>
                            <th className="hidden md:table-cell text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Department</th>
                            <th className="hidden md:table-cell text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Base Cost</th>
                            <th className="hidden md:table-cell text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Unit</th>
                            <th className="hidden md:table-cell text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#0d141c]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id} className="border-t border-[#cedbe8]">
                                <td
                                    className="px-4 py-3 text-sm text-[#0d141c] cursor-pointer underline"
                                    onClick={() => handleEditClick(service)}
                                >
                                    {service.serviceName}
                                </td>
                                <td className="hidden md:table-cell px-4 py-3 text-sm text-[#49739c]">{service.category}</td>
                                <td className="hidden md:table-cell px-4 py-3 text-sm text-[#49739c]">{service.department}</td>
                                <td className="hidden md:table-cell px-4 py-3 text-sm text-[#49739c]">₹{service.baseCost}</td>
                                <td className="hidden md:table-cell px-4 py-3 text-sm text-[#49739c]">{service.unit}</td>
                                <td className="hidden md:table-cell px-4 py-3 text-sm">
                                    <span className="inline-block bg-[#e7edf4] text-[#0d141c] px-4 py-1 rounded-lg">
                                        {service.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm font-bold text-[#49739c] cursor-pointer">
                                    <button onClick={() => toggleActive(service)}>
                                        {service.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showModal && selectedService && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4 sm:mx-auto">

                        <h2 className="text-lg font-bold mb-4">Edit Service</h2>
                        <form onSubmit={handleSubmit(updateService)} className="space-y-4">
                            {/* Hidden input for _id */}
                            <input type="hidden" {...register("_id")} />

                            <div>
                                <label className="block mb-1 text-sm">Service Name</label>
                                <input
                                    type="text"
                                    {...register("serviceName", { required: true })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.serviceName && <p className="text-red-500 text-sm">Required</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Category</label>
                                <input
                                    type="text"
                                    {...register("category", { required: true })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.category && <p className="text-red-500 text-sm">Required</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Department</label>
                                <input
                                    type="text"
                                    {...register("department", { required: true })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.department && <p className="text-red-500 text-sm">Required</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Base Cost</label>
                                <input
                                    type="number"
                                    {...register("baseCost", { required: true, min: 0 })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.baseCost && <p className="text-red-500 text-sm">Must be a positive number</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Unit</label>
                                <input
                                    type="text"
                                    {...register("unit", { required: true })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.unit && <p className="text-red-500 text-sm">Required</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Description</label>
                                <textarea
                                    {...register("description")}
                                    className="w-full border px-3 py-2 rounded resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-200 text-black hover:bg-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-green-500 text-white hover:bg-green-600">
                                    Save
                                </Button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}

export default ServiceListPage
