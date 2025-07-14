// Updated Select.tsx component
import React from 'react';
declare module 'react' {
  interface CSSProperties {
    '--select-button-svg'?: string;
  }
}
interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`
        form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl 
        text-[#121517] focus:outline-0 focus:ring-0 border border-[#dde1e4] 
        bg-white focus:border-[#dde1e4] h-14 placeholder:text-[#687882] 
        p-[15px] text-base font-normal leading-normal
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(104,120,130)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
        backgroundImage: 'var(--select-button-svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 15px center',
        appearance: 'none', // Important for custom select styling
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;