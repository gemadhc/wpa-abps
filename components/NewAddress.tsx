'use client';

import { useState } from 'react';

export default function NewAddress({handleNew}) {
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    handleNew(formData)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow border border-gray-200"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          placeholder="e.g. Home, Office"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          placeholder="123 Main St"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black "
          placeholder="Phoenix"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          placeholder="AZ"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          placeholder="85001"
        />
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
