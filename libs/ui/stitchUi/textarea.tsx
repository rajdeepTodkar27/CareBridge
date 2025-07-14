// Textarea.tsx
import React from 'react';

interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  value = '',
  onChange,
  placeholder = '',
  label,
  className = '',
  rows = 4,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`flex flex-col min-w-40 flex-1 ${className}`}>
      {label && (
        <p className="text-[#121517] text-base font-medium leading-normal pb-2">
          {label}
        </p>
      )}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121517] focus:outline-0 focus:ring-0 border border-[#dde1e4] bg-white focus:border-[#dde1e4] placeholder:text-[#687882] p-[15px] text-base font-normal leading-normal"
      />
    </div>
  );
};

export default Textarea;