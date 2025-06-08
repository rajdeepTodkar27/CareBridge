'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleRoleSelect = (role: 'patient' | 'staff') => {
    if (role === 'patient') {
      router.push('/patient/dashboard');
    } else if (role === 'staff') {
      router.push('/staff/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Staff */}
      <div className="flex-1 flex flex-col items-center justify-center bg-green-100 p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">For Staff 👨‍⚕️</h2>
        <p className="mb-8 max-w-sm text-center text-gray-700">
          Access patient records, manage appointments, and collaborate with your team.
        </p>
        <button
          onClick={() => handleRoleSelect('staff')}
          className="px-8 py-3 md:px-10 md:py-4 bg-white text-green-600 font-semibold rounded hover:bg-gray-100 transition hover:cursor-pointer"
        >
          Continue as Staff
        </button>
      </div>

      {/* Right side - Patient */}
      <div className="flex-1 flex flex-col items-center justify-center  p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-green-600">For Patient</h2>
        <p className="mb-8 max-w-sm text-center text-gray-700">
          View your medical history, book appointments, and communicate with your care team.
        </p>
        <Link href="/auth/login" passHref>
          <button
            type="button"
            className="w-full md:w-auto px-8 py-3 md:px-10 md:py-4 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition hover:cursor-pointer"
          >
            Login
          </button>
        </Link>

        <div className="text-center text-sm mt-6">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
