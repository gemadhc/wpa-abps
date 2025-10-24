'use client'

import React, { forwardRef } from "react";

export type DateValue = string | null; // ISO date string (YYYY-MM-DD)
export interface DatePickerProps {
  id?: string;
  name?: string;
  label?: string;
  value?: DateValue;
  onChange?: (newDate: DateValue) => void;
  placeholder?: string;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  disabled?: boolean;
  required?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Simple, accessible DatePicker component using the native HTML date input under the hood.
 * - Expects and returns ISO date strings in the form `YYYY-MM-DD` (or null when cleared)
 * - Styled with Tailwind utility classes (no external CSS required)
 * - ForwardRef to the underlying <input type="date" />
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      name,
      label,
      value = null,
      onSelected,
      placeholder = "Select date",
      min,
      max,
      disabled = false,
      required = false,
      className = "",
      ariaLabel,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if(val){
        onSelected(val)
      }else{

      }
      
    };

    return (
      <div className={`inline-flex flex-col`}>
        <div className="relative inline-flex items-center w-full">
          <input
            ref={ref}
            id={id}
            name={name}
            aria-label={ariaLabel}
            type="date"
            value={value ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
            required={required}
            className={`appearance-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 placeholder-black text-sm ${
              disabled ? "bg-gray-100 text-white" : "bg-white"
            }`}
          />
        </div>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;

