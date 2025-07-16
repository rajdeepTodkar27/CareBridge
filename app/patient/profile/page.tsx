"use client";

import { getSession, signOut, useSession } from 'next-auth/react';
import { LogOut, Save, Stethoscope, CreditCard, User } from 'lucide-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Section from "@/libs/ui/components/Section";
import Input from "@/libs/ui/components/Input";
import Select from "@/libs/ui/components/Select";
import Card from "@/libs/ui/components/Card";
import AvatarUpload from '@/libs/ui/components/AvtarUpload';
import { extractPublicId } from '@/libs/utils';
interface ProfileFormInputs {
  fullName: string;
  aadharNo: string;
  gender: string;
  dateOfBirth: string;
  mobileNo: string;
  emergencyContact: string;
  occupation?: string;
  lifestyle?: string;
  email: string;
  weight?: number;
  height?: number;
  bmi?: number;
  heartRate?: number;
  bloodSugar?: number;
  bloodPressure?: string;
  temperature?: number;
  avatarFile?: FileList;
  avatarUrl?: string;
}

const ProfilePage = () => {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProfileFormInputs>();
  const { data: session } = useSession();
  const router = useRouter();

  const [errMessage, setErrMessage] = useState("");

  const [imageSrc, setImageSrc] = useState<string>("");
  const [oldImageSrc, setOldImageSrc] = useState<string>("");
  const weight = watch('weight');
  const height = watch('height');
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(2);
      setValue('bmi', bmi);
    }
  }, [weight, height, setValue]);

  useEffect(() => {
  if (session?.user?.email) {
    setValue("email", session.user.email);
  }
}, [session, setValue]);

  useEffect(() => {
    axios.get('/api/patient/profile')
      .then(res => {
        const data = res.data.data;
        setValue("fullName", data.fullName);
        setImageSrc(data.avtarImg);
        setOldImageSrc(data.avtarImg);
        setValue("aadharNo", data.aadharNo);
        setValue("gender", data.gender);
        setValue("dateOfBirth", data.dateOfBirth?.slice(0, 10));
        setValue("mobileNo", data.mobileNo);
        setValue("emergencyContact", data.emergencyContact);
        setValue("occupation", data.occupation);
        setValue("lifestyle", data.lifestyle);

        if (data.vitals) {
          setValue("weight", data.vitals.weight);
          setValue("height", data.vitals.height);
          setValue("bmi", data.vitals.bmi);
          setValue("heartRate", data.vitals.heartRate);
          setValue("bloodSugar", data.vitals.bloodSugar);
          setValue("bloodPressure", data.vitals.bloodPressure);
          setValue("temperature", data.vitals.temperature);
        }
      })
      .catch(() => setErrMessage("Failed to fetch profile."));
  }, [setValue]);

 
  const onSubmit: SubmitHandler<ProfileFormInputs> = async (formData) => {
    try {
      setErrMessage("");

      let avatarUrl = oldImageSrc;

      if (formData.avatarFile && formData.avatarFile.length > 0) {
        const file = formData.avatarFile[0];

        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("folder", "avatar");
        const uploadRes = await axios.post("/api/upload", uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        avatarUrl = uploadRes.data.secure_url;

        if (oldImageSrc) {
          const publicId = extractPublicId(oldImageSrc);
          await axios.post("/api/cloudinary/delete", { publicId });
        }
        setImageSrc(avatarUrl);
        setOldImageSrc(avatarUrl);
      }

      const payload = {
        ...formData,
        avatarUrl,  
      };

      const res = await axios.post('/api/patient/profile', payload);
      alert(res.data.message);


    } catch (err: any) {
      console.error(err);
      setErrMessage(err?.response?.data?.message || "Something went wrong.");
    }
  };


  const handleLogout = () => {
    if (confirm("Are you sure to log out from CareBridge?")) {
      signOut({ callbackUrl: '/' });
    }
  };




  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 ">Patient Profile</h2>
          </div>



          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            
            <Controller
              name="avatarFile"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <AvatarUpload
                  value={field.value}
                  onChange={field.onChange}
                  initialImage={imageSrc}
                />
              )}
            />
            <Section title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Input label="Full Name" name="fullName" register={register} errors={errors} required />
                <Input label="Aadhar Number" name="aadharNo" type="number" register={register} errors={errors} required />
                <Select label="Gender" name="gender" register={register} errors={errors} required options={["male", "female", "trans"]} />
                <Input label="Date of Birth" name="dateOfBirth" type="date" register={register} errors={errors} required />
                <Input label="Mobile Number" name="mobileNo" type="number" register={register} errors={errors} required />
                <Input label="Emergency Contact" name="emergencyContact" type="number" register={register} errors={errors} required />
                <Input label="Occupation" name="occupation" register={register} errors={errors} />
                <Input label="Lifestyle" name="lifestyle" register={register} errors={errors} />
                <Input label="Email" name="email" type="email" register={register} errors={errors} readOnly />
              </div>
            </Section>

            {/* Vitals */}
            <Section title="Vitals">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Input label="Weight (kg)" name="weight" type="number" register={register} errors={errors} />
                <Input label="Height (cm)" name="height" type="number" register={register} errors={errors} />
                <Input label="BMI" name="bmi" type="number" readOnly register={register} errors={errors} />
                <Input label="Heart Rate" name="heartRate" type="number" register={register} errors={errors} />
                <Input label="Blood Sugar" name="bloodSugar" type="number" register={register} errors={errors} />
                <Input label="Blood Pressure" name="bloodPressure" register={register} errors={errors} />
                <Input label="Temperature (°C)" name="temperature" type="number" register={register} errors={errors} />
              </div>
            </Section>


            {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white rounded-lg">
                <Save className="w-5 h-5" /> Save Changes
              </button>
              <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 px-6 py-2 border-2 hover:cursor-pointer border-red-600 text-red-600 rounded-lg">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </form>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Medical History" icon={<Stethoscope className="w-6 h-6 text-green-600" />} onClick={() => router.push('/patient/medical-history')} />
          <Card title="Membership Details" icon={<CreditCard className="w-6 h-6 text-green-600" />} onClick={() => router.push('/patient/mymembership')} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

