'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import GoogleButton from '@/libs/ui/components/GoogleButton';
type FormData = {
  email: string;
  password: string;
  Confirmpassword: string;
};

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const passwordvalue= watch('password')

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    try {
      const res = await axios.post('/api/auth/signup', data);
      if (res.status === 201) router.push('/auth/login');
      
    } catch (err) {
      alert('Signup error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  {/* Left - Branding */}
  <div className="hidden md:flex w-full md:w-1/2 bg-green-100 items-center justify-center">
    <div className="text-center px-8">
      <h1 className="text-4xl font-bold mb-4">Join the CareBridge Community</h1>
      <p className="text-gray-700">Bridge the gap between you and your care team — it starts with signing up.</p>
    </div>
  </div>

  {/* Right - Sign Up Form */}
  <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800">Sign Up to CareBridge 🏥</h2>

      <input
        {...register("email", { required: true })}
        placeholder="Email"
        type="email"
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

      <input
        {...register("password", { required: true })}
        placeholder="Password"
        type="password"
        className="w-full p-2 border rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

      <input
        {...register("Confirmpassword", {
          required: "Requires confirmation of the password",
          validate: (value) => value === passwordvalue || "Passwords do not match",
        })}
        placeholder="Confirm Password"
        type="password"
        className="w-full p-2 border rounded"
      />
      {errors.Confirmpassword && (
        <p className="text-red-500 text-sm">{errors.Confirmpassword.message}</p>
      )}

      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        Sign Up
      </button>

      <div className="text-center text-sm">
        Already have an account? <Link href="/auth/login" className="text-blue-500">Login</Link>
      </div>
    </form>

    {/* Divider and GoogleButton */}
    <div className="w-full max-w-md mt-6">
      <div className="divider">OR</div>
      <GoogleButton />
    </div>
  </div>
</div>

  );
}
