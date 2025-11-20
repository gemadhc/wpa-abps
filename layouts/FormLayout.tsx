// components/Form.jsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from '../contexts/FormProvider';
import { useReport } from '../contexts/ReportContext'
import { useNumberPad } from '../contexts/NumberPadContext';

export default function Form({ fields, title, hasTitle = false, totalRows = 2 }) {
  const { targetName, setTarget, fieldValue } = useNumberPad();
  const { updateField, formData} = useReport(); 

  useEffect(()=>{
    console.log("Form Data in layout: ", formData)
  }, [formData])

  useEffect(() => {
    console.log(fieldValue, targetName)
    updateField(targetName, fieldValue)
  }, [fieldValue, targetName]);

  // no local form state — we read/write directly to the context
  const onFocusField = (field) => {
    if (!field.noKeyboard) return;
    const current = formData?.[field.name] ?? '';
    setTarget(field.name, current === null || current === undefined ? '' : String(current));
  };

  const inputBase =
    'peer w-full border border-gray-300 rounded-md p-5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400';

  return (
    <div className="flex flex-col gap-4 w-full">
      {hasTitle && title && <h3 className="text-left">{title}</h3>}

      <div className={`grid grid-cols-${totalRows} gap-0`}>
        {fields.map((field) => {
          const isFull = field.full === true ? `col-span-${totalRows}` : 'col-span-1';

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={`${isFull} flex items-center gap-2`}>
                <input
                  type="checkbox"
                  checked={!!formData?.[field.name]}
                  onChange={(e) => updateField(field.name, e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>{field.label}</span>
              </div>
            );
          }

          if (field.type === 'radio') {
            return (
              <div key={field.name} className={`${isFull} flex items-center gap-2`}>
                <span className="text-sm">{field.label}:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={field.name}
                    checked={formData?.[field.name] === true || formData?.[field.name] === 1 }
                    onChange={() => updateField(field.name, true)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  On
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={field.name}
                    checked={formData?.[field.name] === false || formData?.[field.name] === 0}
                    onChange={() => updateField(field.name, false)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Off
                </label>
              </div>
            );
          }

          const sharedProps = {
            id: field.name,
            name: field.name,
            value: formData?.[field.name] ?? '',
            placeholder: ' ',
            readOnly: field.noKeyboard || false,
            inputMode: field.noKeyboard ? 'none' : undefined,
            onFocus: () => onFocusField(field),
            onChange: (e) => updateField(field.name, e.target.value),
            className: inputBase,
          };

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={`${isFull} relative`}>
                <textarea {...sharedProps} className={`${inputBase} min-h-[140px] min-w-[300px]`} />
                <label className="absolute left-5 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm">
                  {field.label}
                </label>
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className={`${isFull} relative`}>
                <select {...sharedProps} className={`${inputBase} pr-10`}>
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label className="absolute left-5 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm">
                  {field.label}
                </label>
              </div>
            );
          }

          return (
            <div key={field.name} className={`${isFull} relative`}>
              <input {...sharedProps} type={field.type || 'text'} />
              <label className="absolute left-5 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm">
                {field.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
