"use client";
import { useFormContext } from "react-hook-form";

interface CheckboxFieldProps {
  name: string;
  label: string;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex items-center space-x-2 py-2">
      <input
        type="checkbox"
        id={name}
        {...register(name)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={name} className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}
