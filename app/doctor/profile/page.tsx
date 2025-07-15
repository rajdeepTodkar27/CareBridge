"use client";

import { useSession, signOut } from 'next-auth/react';
import { Save, LogOut, Stethoscope, User, ClipboardList } from 'lucide-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler,Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Section from "@/libs/ui/components/Section";
import Input from "@/libs/ui/components/Input";
import Select from "@/libs/ui/components/Select";
import Card from "@/libs/ui/components/Card";
import AvatarUpload from '@/libs/ui/components/AvtarUpload';
import { extractPublicId } from '@/libs/utils';

interface DoctorProfileInputs {
  fullName: string;
  empId: string;
  mobileNo: string;
  gender: string;
  medicalSpeciality: string;
  experience: number;
  administrativeTitle?: string;
  licenseNo: string;
  licenseAuthority: string;
  email?: string;
  avatarFile?: FileList;
  avatarUrl?: string;
}

const DoctorProfilePage = () => {
  const { register, handleSubmit, setValue,control, formState: { errors } } = useForm<DoctorProfileInputs>();
  const { data: session } = useSession();
  const router = useRouter();
  const [errMessage, setErrMessage] = useState("");


  const [imageSrc, setImageSrc] = useState<string>("");
  const [oldImageSrc, setOldImageSrc] = useState<string>("");

  useEffect(() => {
    if (session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [session, setValue]);

  useEffect(() => {
    axios.get('/api/doctor/profile')
      .then(res => {
        const data = res.data.data;
        setValue("fullName", data.fullName);
        setValue("mobileNo", data.mobileNo);
        setValue("gender", data.gender);
        setValue("medicalSpeciality", data.medicalSpeciality);
        setValue("experience", data.experience);
        setValue("administrativeTitle", data.administrativeTitle);
        setValue("licenseNo", data.licenseNo);
        setValue("licenseAuthority", data.licenseAuthority);
        setValue("empId", data.empId);
        setImageSrc(data.avtarImg);
        setOldImageSrc(data.avtarImg);
        if (data.user?.email) setValue("email", data.user.email);
      })
      .catch(() => setErrMessage("Failed to fetch profile."));
  }, [setValue]);


    const onSubmit: SubmitHandler<DoctorProfileInputs> = async (formData) => {
    try {
      setErrMessage("");

      let avatarUrl = oldImageSrc;

      if (formData.avatarFile && formData.avatarFile.length > 0) {
        const file = formData.avatarFile[0];

        const uploadForm = new FormData();
        uploadForm.append("file", file);

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

      const res = await axios.post('/api/doctor/profile', payload);
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
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Doctor Profile</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            <Section title="Professional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Input label="Full Name" name="fullName" register={register} errors={errors} required />
                <Input label="Mobile Number" name="mobileNo" type="text" register={register} errors={errors} required />
                <Select label="Gender" name="gender" register={register} errors={errors} required options={['male', 'female', 'trans']} />
                <Input label="Medical Speciality" name="medicalSpeciality" register={register} errors={errors} required />
                <Input label="Experience (Years)" name="experience" type="number" register={register} errors={errors} required />
                <Input label="Administrative Title" name="administrativeTitle" register={register} errors={errors} readOnly />
                <Input label="License Number" name="licenseNo" register={register} errors={errors} required />
                <Input label="License Authority" name="licenseAuthority" register={register} errors={errors} required />
                <Input label="Email" name="email" type="email" register={register} errors={errors} readOnly />
                <Input label="Employee Id" name="empId" type="empId" register={register} errors={errors} readOnly />
              </div>
            </Section>

            {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Regular Checkups" icon={<Stethoscope className="w-6 h-6 text-green-600" />} onClick={() => router.push('/doctor/regular-checkups')} />
          <Card title="Addmitted Patients" icon={<ClipboardList className="w-6 h-6 text-green-600" />} onClick={() => router.push('/doctor/admitted-patients')} />
        </div>
      </div>
    </main>
  );
};

export default DoctorProfilePage;

