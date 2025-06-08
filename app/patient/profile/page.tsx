'use client';

import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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
}

interface MedicalEntry {
  description?: string;
  condition?: string;
}

interface PaymentEntry {
  amount: number;
  date: string;
}

interface UserProfileResponse {
  data: ProfileFormInputs & {
    medicalHistory?: MedicalEntry[];
    paymentHistory?: PaymentEntry[];
  };
  message?: string;
}

const ProfilePage = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormInputs>();
  const { data: session } = useSession();
  const router = useRouter();

  const [medicalHistory, setMedicalHistory] = useState<MedicalEntry[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentEntry[]>([]);
  const [errMessage, setErrMessage] = useState("");

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
    axios.get<UserProfileResponse>('/api/patient/profile')
      .then(res => {
        const data = res.data.data;
        Object.keys(data).forEach((key) => {
          if (data[key as keyof ProfileFormInputs] !== undefined) {
            setValue(key as keyof ProfileFormInputs, data[key as keyof ProfileFormInputs]);
          }
        });
        if (data.medicalHistory) setMedicalHistory(data.medicalHistory.slice(0, 5));
        if (data.paymentHistory) setPaymentHistory(data.paymentHistory.slice(0, 5));
      })
      .catch(err => {
        setErrMessage("Failed to fetch profile.");
      });
  }, [setValue]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = (formData) => {
    setErrMessage("");
    axios.post('/api/patient/profile', formData)
      .then(res => alert(res.data.message))
      .catch(err => {
        setErrMessage(err?.response?.data?.message || "Something went wrong.");
      });
  };

  const handleLogout = () => {
    if(confirm("Are you sure to log out from CareBridge? ")){
        signOut({ callbackUrl: '/' });
    }
  }

  return (
    <main className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Patient Profile</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Full Name" name="fullName" register={register} errors={errors} required />
                <Input label="Aadhar Number" name="aadharNo" type="number" register={register} errors={errors} required />
                <Select label="Gender" name="gender" register={register} errors={errors} required options={["male", "female", "trans"]} />
                <Input label="Date of Birth" name="dateOfBirth" type="date" register={register} errors={errors} required />
                <Input label="Mobile Number" name="mobileNo" type="number" register={register} errors={errors} required />
                <Input label="Emergency Contact" name="emergencyContact" type="number" register={register} errors={errors} required />
                <Input label="Occupation" name="occupation" register={register} />
                <Input label="Lifestyle" name="lifestyle" register={register} />
                <Input label="Email" name="email" type="email" register={register} errors={errors} required />
              </div>
            </div>

            {/* Vitals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vitals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Input label="Weight (kg)" name="weight" type="number" register={register} />
                <Input label="Height (m)" name="height" type="number" register={register} />
                <Input label="BMI" name="bmi" type="number" readOnly register={register} />
                <Input label="Heart Rate" name="heartRate" type="number" register={register} />
                <Input label="Blood Sugar" name="bloodSugar" type="number" register={register} />
                <Input label="Blood Pressure" name="bloodPressure" register={register} />
                <Input label="Temperature (°C)" name="temperature" type="number" register={register} />
              </div>
            </div>

            {errMessage && <p className="text-red-600 font-medium">{errMessage}</p>}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
                Save Changes
              </button>
              <button type="button" onClick={handleLogout} className="w-full sm:w-auto px-6 py-2 border-2 border-red-600 text-red-600 rounded-md">
                Logout
              </button>
            </div>
          </form>
        </div>

        {/* Medical History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Medical History</h3>
          {medicalHistory.length > 0 ? (
            <>
              <ul className="list-disc pl-5 text-gray-700">
                {medicalHistory.map((item, idx) => (
                  <li key={idx}>{item.description || item.condition || "Entry"}</li>
                ))}
              </ul>
              <button onClick={() => router.push('/medical-history')} className="mt-2 text-blue-600 underline">
                View All
              </button>
            </>
          ) : <p className="text-gray-500">No medical history found.</p>}
        </div>

        {/* Payment History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment History</h3>
          {paymentHistory.length > 0 ? (
            <>
              <ul className="list-disc pl-5 text-gray-700">
                {paymentHistory.map((p, idx) => (
                  <li key={idx}>₹{p.amount} – {p.date?.slice(0, 10)}</li>
                ))}
              </ul>
              <button onClick={() => router.push('/payment-history')} className="mt-2 text-blue-600 underline">
                View All
              </button>
            </>
          ) : <p className="text-gray-500">No payment history found.</p>}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

// ---------- Utility Components ----------
const Input = ({ label, name, type = "text", readOnly = false, register, errors, required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...register(name, required ? { required: `${label} is required` } : {})}
      readOnly={readOnly}
      className={`w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 ${readOnly ? 'bg-gray-100' : ''}`}
    />
    {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
  </div>
);

const Select = ({ label, name, register, errors, options = [], required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select {...register(name, required ? { required: `${label} is required` } : {})}
      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white">
      <option value="">Select</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
  </div>
);
