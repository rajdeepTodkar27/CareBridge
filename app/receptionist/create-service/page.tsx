'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface FormData {
  serviceName: string
  category: string
  department: string
  baseCost: number
  unit: string
  description: string
}

export default function CreateServicePage() {
  const { data: session } = useSession()
  const [centerId, setCenterId] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (session?.user?.centerId) {
      setCenterId(session.user.centerId)
    }
  }, [session])

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`/api/services/${centerId}`, { ...data, centerId })
      router.push('/receptionist/service') // go back to service list
    } catch (err) {
      console.error('Error creating service:', err)
    }
  }

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5 bg-slate-50 min-h-screen">
      <div className="layout-content-container flex flex-col w-full max-w-[960px] py-5">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight min-w-72">
            New Service
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Service Name */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Service Name</p>
              <input
                placeholder="Enter service name"
                {...register('serviceName', { required: true })}
                className="form-input w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] h-14 focus:outline-0"
              />
              {errors.serviceName && <p className="text-sm text-red-500">Required</p>}
            </label>
          </div>

    
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Category</p>
              <input
                placeholder="Enter category"
                {...register('category', { required: true })}
                className="form-input w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] h-14 focus:outline-0"
              />
              {errors.category && <p className="text-sm text-red-500">Required</p>}
            </label>
          </div>

          {/* Department */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Department</p>
              <input
                placeholder="Enter department"
                {...register('department', { required: true })}
                className="form-input w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] h-14 focus:outline-0"
              />
              {errors.department && <p className="text-sm text-red-500">Required</p>}
            </label>
          </div>

          {/* Base Cost */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Base Cost</p>
              <input
                type="number"
                {...register('baseCost', { required: true, min: 0 })}
                placeholder="Enter base cost"
                className="form-input w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] h-14 focus:outline-0"
              />
              {errors.baseCost && <p className="text-sm text-red-500">Enter valid cost</p>}
            </label>
          </div>

          {/* Unit */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Unit</p>
              <input
                placeholder="Enter unit"
                {...register('unit', { required: true })}
                className="form-input w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] h-14 focus:outline-0"
              />
              {errors.unit && <p className="text-sm text-red-500">Required</p>}
            </label>
          </div>

          {/* Description */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Description</p>
              <textarea
                placeholder="Enter description"
                {...register('description')}
                className="form-input min-h-36 w-full resize-none rounded-lg border border-[#cedbe8] bg-slate-50 p-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] focus:outline-0"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-stretch">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
