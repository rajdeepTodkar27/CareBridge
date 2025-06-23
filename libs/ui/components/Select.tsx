import React from "react";

interface SelectProps {
  label: string;
  name: string;
  register: any;
  errors: any;
  options: string[];
  required?: boolean;
}

const Select = ({ label, name, register, errors, options = [], required = false }: SelectProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, required ? { required: `${label} is required` } : {})}
      className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
  </div>
);

export default Select;
