'use client';
import { useState, useEffect } from 'react';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'email' | 'password';
  placeholder?: string;
  options?: { label: string; value: any }[];
  required?: boolean;
  full?: boolean;
  noKeyboard?: boolean; // suppress keyboard
  getTargetName?: (name: string) => void; // called on focus when noKeyboard
};

type FormProps = {
  fields: Field[];
  title?: string;
  hasTitle?: boolean;
  totalRows?: number;
  initialValues?: Record<string, any>;
};

export default function Form({
  fields,
  title,
  hasTitle = false,
  totalRows = 2,
  initialValues = {},
}: FormProps) {
  const defaultState = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') acc[field.name] = false;
    else if (field.type === 'radio') acc[field.name] = null;
    else acc[field.name] = '';
    return acc;
  }, {} as Record<string, any>);

  const mergedInitial = { ...defaultState, ...initialValues };
  const [formData, setFormData] = useState(mergedInitial);

  useEffect(() => {
    setFormData({ ...defaultState, ...initialValues });
  }, [initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      console.log('Auto-saved Data:', updated);
      return updated;
    });
  };

  // ✅ handleSave now does the same as handleChange
  const handleSave = (name: string, value: any) => {
    handleChange(name, value);
  };

  const handleFocus = (field: Field) => {
    if (field.noKeyboard && field.getTargetName) {
      field.getTargetName(field.name);
    }
  };

  return (
    <div className="flex flex-col gap-0 w-full">
      {hasTitle && title && (
        <h2 className="text-lg text-left font-semibold text-gray-800">{title}</h2>
      )}

      <div className={`grid grid-cols-${totalRows} gap-1 w-full`}>
        {fields.map((field) => {
          const isFull = Boolean(field.full);
          const gridClass = isFull ? `col-span-${totalRows}` : 'col-span-1';

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={`${gridClass} flex items-center gap-2`}>
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 text-sm">{field.label}</span>
              </div>
            );
          }

          if (field.type === 'radio') {
            return (
              <div key={field.name} className={`${gridClass} flex items-center gap-2`}>
                <span className="text-gray-700 text-sm">{field.label}:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={field.name}
                    value="true"
                    checked={Boolean(formData[field.name]) === true}
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
                    checked={Boolean(formData[field.name]) === false}
                    onChange={() => handleChange(field.name, false)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Off
                </label>
              </div>
            );
          }

          const commonProps = {
            id: field.name,
            value: formData[field.name] || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              handleChange(field.name, e.target.value),
            onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              handleSave(field.name, e.currentTarget.value),
            onFocus: () => handleFocus(field),
            placeholder: ' ',
            readOnly: field.noKeyboard || false,
            inputMode: field.noKeyboard ? 'none' : undefined,
            className:
              'peer w-full border border-gray-300 rounded-md p-2 pt-5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400',
          };

          return (
            <div key={field.name} className={`${gridClass} relative`}>
              {field.type === 'textarea' ? (
                <div className="relative">
                  <textarea {...commonProps} />
                  <label
                    htmlFor={field.name}
                    className="absolute left-2 top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    {field.label}
                  </label>
                </div>
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select {...commonProps}>
                    <option value="">Select</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor={field.name}
                    className="absolute left-2 top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:text-blue-600"
                  >
                    {field.label}
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <input {...commonProps} type={field.type || 'text'} />
                  <label
                    htmlFor={field.name}
                    className="absolute left-2 top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    {field.label}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
