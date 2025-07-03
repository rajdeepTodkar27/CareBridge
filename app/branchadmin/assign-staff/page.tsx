"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Save } from "lucide-react";
import Input from "@/libs/ui/components/Input";
import Select from "@/libs/ui/components/Select";
import Section from "@/libs/ui/components/Section";
import { useSession } from "next-auth/react";

interface AssignStaffFormInputs {
  email: string;
  password: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'pharmasist';
  centerId: string;
}

interface Carecenter {
  centerId: string;
  name: string;
}

const AssignStaffForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AssignStaffFormInputs>();
  const [errMessage, setErrMessage] = useState("");
  const [centers, setCenters] = useState<Carecenter[]>([]);
  const {data: session, status} = useSession()
  const branchadminBId = session?.user?.centerId

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setErrMessage("");
        const res = await axios.get("/api/admin/createBranchH");
        let centersList: Carecenter[] =[]
         res.data.data.map((e: any) =>{
          if(e.branchId===branchadminBId){
            centersList.push({centerId: e.centerId,name: e.name})}
           
            });
        setCenters(centersList);
      } catch (error: any) {
        console.error(error);
        setErrMessage(error?.response?.data?.message || "Something went wrong.");
      }
    };

    fetchCenters();
  }, []);

  const onSubmit: SubmitHandler<AssignStaffFormInputs> = async (formData) => {
    try {
      setErrMessage("");
      const res = await axios.post("/api/admin/createstaff", formData);
      alert(res.data.message);
      reset();
    } catch (err: any) {
      console.error(err);
      setErrMessage(err?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Assign Staff to Care Center</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Section title="Staff Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Email" name="email" type="email" register={register} errors={errors} required />
                <Input label="Password" name="password" type="password" register={register} errors={errors} required />
                <Select
                  label="Role"
                  name="role"
                  register={register}
                  errors={errors}
                  required
                  options={['doctor', 'nurse', 'receptionist', 'pharmasist']}
                />

                <div>
                  <label className="block mb-1 font-medium">
                    Center Id
                  </label>
                  <select {...register("centerId", { required: true })} className="w-full p-2 border rounded">
                    <option value="">Select Center</option>
                    {
                    centers.map((center) => (
                      <option key={center.centerId} value={center.centerId}>
                        {center.name} ({center.centerId})
                      </option>
                    ))}
                  </select>
                  {errors.centerId && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
              </div>
            </Section>

            {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

            <div className="flex justify-end">
              <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                <Save className="w-5 h-5" /> Assign Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AssignStaffForm;
