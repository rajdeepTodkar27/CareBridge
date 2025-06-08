'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import GoogleButton from '@/libs/ui/components/GoogleButton';
import { getSession } from 'next-auth/react';
type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (res?.ok){ 
      const session = await getSession()
      router.push(`/${session?.user?.role}/dashboard`);}
    else alert('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  {/* Left - Login Form */}
  <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800">Login to CareBridge</h2>

      <input
        {...register('email', { required: true })}
        placeholder="Email"
        type="email"
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

      <input
        {...register('password', { required: true })}
        placeholder="Password"
        type="password"
        className="w-full p-2 border rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        Login
      </button>

      <div className="text-center text-sm">
        Don’t have an account? <Link href="/auth/signup" className="text-blue-500">Sign up</Link>
      </div>
    </form>

    {/* Divider and GoogleButton outside the form */}
    <div className="w-full max-w-md mt-6">
      <div className="divider">OR</div>
      <GoogleButton />
    </div>
  </div>

  {/* Right - Branding */}
  <div className="hidden md:flex w-full md:w-1/2 bg-green-100 text-white items-center justify-center">
    <div className="text-center px-8">
      <h1 className="text-4xl text-black font-bold mb-4">Welcome Back to CareBridge</h1>
      <p className="text-gray-700">Your health journey continues here — securely and smoothly.</p>
    </div>
  </div>
</div>

  );
}
