"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Save } from "lucide-react";
import Input from "@/libs/ui/components/Input";
import Select from "@/libs/ui/components/Select";
import Section from "@/libs/ui/components/Section";
import MapPicker from "@/libs/ui/components/MapPicker";
import { useSession } from "next-auth/react";

interface AllCareFormInputs {
    centerId: string;
    branchId: string;
    name: string;
    type: 'hospital' | 'medical store' | 'blood bank' | 'pathology lab';
    address: string;
    city: string;
    state: string;
    email: string;
    phoneNo: number;
    latitude: number;
    longitude: number;
}

const AllCareFormPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AllCareFormInputs>();
    const [errMessage, setErrMessage] = useState("");
    const {data: session, status}= useSession()

      useEffect(() => {
        if (session?.user?.centerId) {
          setValue("branchId", session.user.centerId);
        }
      }, [session, setValue]);

    const onSubmit: SubmitHandler<AllCareFormInputs> = async (formData) => {
        try {
            setErrMessage("");
            const res = await axios.post("/api/admin/createBranchH", formData);
            alert("success fully created the new care center");
            reset({
                latitude: 28.6139,
                longitude: 77.2090
            })
        } catch (err: any) {
            console.error(err);
            setErrMessage(err?.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Care Center</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        <Section title="Center Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <Input label="Center ID" name="centerId" register={register} errors={errors} required />
                                <Input label="Branch ID" name="branchId" register={register} errors={errors} required readOnly/>
                                <Input label="Name" name="name" register={register} errors={errors} required />
                                <Select label="Type" name="type" register={register} errors={errors} required
                                    options={['hospital', 'medical store', 'blood bank', 'pathology lab']} />
                                <Input label="Address" name="address" register={register} errors={errors} required />
                                <Input label="City" name="city" register={register} errors={errors} required />
                                <Input label="State" name="state" register={register} errors={errors} required />
                            </div>
                        </Section>

                        <Section title="Contact Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <Input label="Email" name="email" type="email" register={register} errors={errors} required />
                                <Input label="Phone Number" name="phoneNo" type="number" register={register} errors={errors} required />
                            </div>
                        </Section>

                        <Section title="Pick Location on Map">
                            <MapPicker
                                onLocationSelect={(lat, lng) => {
                                    setValue('latitude', lat);
                                    setValue('longitude', lng);
                                }}
                                defaultCenter={{ lat: 28.6139, lng: 77.2090 }}
                            />
                        </Section>
                        <Section title="Location">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <Input
                                    label="Latitude"
                                    name="latitude"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    required
                                    readOnly
                                />
                                <Input
                                    label="Longitude"
                                    name="longitude"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    required
                                    readOnly
                                />
                            </div>
                        </Section>

                        {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                <Save className="w-5 h-5" /> Save Center
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AllCareFormPage;
