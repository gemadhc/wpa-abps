'use client';
import { useState } from 'react';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'email' | 'password';
  placeholder?: string;
  options?: { label: string; value: any }[]; // for select or custom radio options
  required?: boolean;
  full?: boolean; // if true, spans full width
};

type FormProps = {
  fields: Field[];
  title?: string;
  hasTitle?: boolean;
};

export default function Form({ fields, title, hasTitle = false }: FormProps) {
  const initialState = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') acc[field.name] = false;
    else if (field.type === 'radio') acc[field.name] = null;
    else acc[field.name] = '';
    return acc;
  }, {} as Record<string, any>);

  const [formData, setFormData] = useState(initialState);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      handleSave(updated); // auto-save
      return updated;
    });
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Auto-saved Data:', data);
  };

  return (
    <div className="flex flex-col gap-2">
      {hasTitle && title && (
        <h2 className="text-lg text-left font-semibold text-gray-800">{title}</h2>
      )}

      {/* Fields Grid */}
      <div className="grid grid-cols-2 gap-1">
        {fields.map((field) => {
          const isFull = field.full ?? false;
          const gridClass = isFull ? 'col-span-2' : '';

          const isTextField =
            field.type === 'text' ||
            field.type === 'number' ||
            field.type === 'email' ||
            field.type === 'password' ||
            field.type === 'textarea';

          // Checkbox
          if (field.type === 'checkbox') {
            return (
              <div
                key={field.name}
                className={`${gridClass} flex items-center gap-2`}
              >
                <input
                  type="checkbox"
                  checked={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 text-sm">{field.label}</span>
              </div>
            );
          }

          // Radio
          if (field.type === 'radio') {
            return (
              <div
                key={field.name}
                className={`${gridClass} flex items-center gap-0`}
              >
                <span className="text-gray-700 text-sm">{field.label}:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={field.name}
                    value="true"
                    checked={formData[field.name] === true}
                    onChange={() => handleChange(field.name, true)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  On
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={field.name}
                    value="false"
                    checked={formData[field.name] === false}
                    onChange={() => handleChange(field.name, false)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Off
                </label>
              </div>
            );
          }

          // Text, Number, Email, Password, Textarea
          return (
            <div
              key={field.name}
              className={`${gridClass} flex items-center gap-0`}
            >
              <span
                className={`${
                  isTextField ? 'bg-gray-200 px-2 py-1  w-14 mr-0' : ''
                } text-gray-700 text-sm w-14`}
              >
                {field.label}:
              </span>

              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleSave(formData)}
                  className="flex-1 border border-gray-300 rounded p-1 text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="flex-1 border border-gray-300 rounded p-1 text-sm"
                >
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleSave(formData)}
                  className="flex-1 border border-gray-300 rounded p-1 text-sm max-w-15"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
