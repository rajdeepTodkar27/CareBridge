import React from 'react'
import { signIn } from 'next-auth/react'
const GoogleButton = () => {
    return (
        <div className="w-full flex justify-center sm:justify-start px-4 sm:px-0">
      <button
        className="btn w-full  flex items-center justify-center gap-2 bg-white text-black border border-[#e5e5e5] hover:bg-gray-100 transition duration-200"
        onClick={() => signIn('google')}
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
          </g>
        </svg>
        <span className="text-sm sm:text-base font-medium">Login with Google</span>
      </button>
    </div>
    )
}

export default GoogleButton
