'use client';

import { useState } from 'react';

type FormData = {
  label: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function NewAddress({ handleNew }: any) {
  const [formData, setFormData] = useState<FormData>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.label.trim()) newErrors.label = 'Label is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (!formData.zipcode.trim()) {
      newErrors.zipcode = 'Zipcode is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
      newErrors.zipcode = 'Invalid zipcode format';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error as user types
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Submitted:', formData);
    handleNew(formData);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-6 bg-white rounded-lg shadow border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Add New Address
      </h2>

      {/* Label */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          className={inputClass('label')}
          placeholder="e.g. Home, Office"
        />
        {errors.label && (
          <p className="text-red-500 text-xs mt-1">{errors.label}</p>
        )}
      </div>

      {/* Street */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className={inputClass('street')}
          placeholder="123 Main St"
        />
        {errors.street && (
          <p className="text-red-500 text-xs mt-1">{errors.street}</p>
        )}
      </div>

      {/* City */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={inputClass('city')}
          placeholder="Phoenix"
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      {/* State */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className={inputClass('state')}
          placeholder="AZ"
        />
        {errors.state && (
          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
        )}
      </div>

      {/* Zipcode */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Zipcode
        </label>
        <input
          type="text"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          className={inputClass('zipcode')}
          placeholder="85001"
        />
        {errors.zipcode && (
          <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        Save Address
      </button>
    </form>
  );
}