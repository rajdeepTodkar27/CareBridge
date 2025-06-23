import React from "react";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  readOnly?: boolean;
  register: any;
  errors: any;
  required?: boolean;
}

const Input = ({ label, name, type = "text", readOnly = false, register, errors, required = false }: InputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, required ? { required: `${label} is required` } : {})}
      readOnly={readOnly}
      className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
    />
    {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
  </div>
);

export default Input;
