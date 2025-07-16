"use client";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Section from "@/libs/ui/components/Section";
import Input from "@/libs/ui/components/Input";
import Select from "@/libs/ui/components/Select";
import Card from "@/libs/ui/components/Card";
import { Save, LogOut, User, Stethoscope, LayoutDashboard } from "lucide-react";
import AvatarUpload from '@/libs/ui/components/AvtarUpload';
import { extractPublicId } from '@/libs/utils';

interface ProfileFormInputs {
    fullName: string;
    mobileNo: string;
    gender: string;
    administrativeTitle?: string;
    qualification: string;
    institute: string;
    email?: string;
    empId: string;
    avatarFile?: FileList;
    avatarUrl?: string;
}

const Page = () => {
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ProfileFormInputs>();
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
        axios.get('/api/staff/profile')
            .then(res => {
                const data = res.data.data;
                setValue("fullName", data.fullName);
                setValue("empId", data.empId);
                setValue("mobileNo", data.mobileNo);
                setValue("gender", data.gender);
                setValue("administrativeTitle", data.administrativeTitle);
                setValue("qualification", data.qualification);
                setValue("institute", data.institute);
                setValue("email", data?.user?.email);
                setImageSrc(data.avtarImg);
                setOldImageSrc(data.avtarImg);
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

            const res = await axios.post('/api/staff/profile', payload);
            alert(res.data.message);


        } catch (err: any) {
            console.error(err);
            setErrMessage(err?.response?.data?.message || "Something went wrong.");
        }
    };


    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            signOut({ callbackUrl: "/" });
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <User className="w-8 h-8 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Receptionist Profile</h2>
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
                        <Section title="Receptionist Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <Input label="Full Name" name="fullName" register={register} errors={errors} required />
                                <Input label="Mobile Number" name="mobileNo" type="number" register={register} errors={errors} required />
                                <Select label="Gender" name="gender" register={register} errors={errors} required options={["male", "female", "trans"]} />
                                <Input label="Administrative Title" name="administrativeTitle" register={register} errors={errors} readOnly />
                                <Input label="Qualification" name="qualification" register={register} errors={errors} required />
                                <Input label="Institute" name="institute" register={register} errors={errors} required />
                                <Input label="Email" name="email" type="email" register={register} errors={errors} readOnly />
                                <Input label="Employee Id" name="empId" type="empId" register={register} errors={errors} readOnly />
                            </div>
                        </Section>

                        {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

                        <div className="flex flex-col md:flex-row gap-4">
                            <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:cursor-pointer hover:bg-green-700 text-white rounded-lg">
                                <Save className="w-5 h-5" /> Save Changes
                            </button>
                            <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 px-6 py-2 border-2 hover:cursor-pointer border-red-600 text-red-600 rounded-lg">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Addmitted Patients" icon={<Stethoscope className="w-6 h-6 text-green-600" />} onClick={() => router.push('/receptionist/admitted-patients')} />
                    <Card title="Dashboard" icon={<LayoutDashboard className="w-6 h-6 text-green-600" />} onClick={() => router.push('/receptionist/dashboard')} />
                </div>
            </div>
        </main>
    );
};

export default Page;


