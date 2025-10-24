'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

export default function AddressSelection() {
  const [isOpen, setIsOpen] = useState(false);

  // Placeholder list of addresses
  const addresses = [
    { id: 1, label: '123 Main St, Phoenix, AZ 85001' },
    { id: 2, label: '456 Palm Dr, Mesa, AZ 85201' },
    { id: 3, label: '789 Sunset Blvd, Scottsdale, AZ 85250' },
  ];

  // Empty handler functions
  const handleAddressChange = (addressId: number) => {
    console.log('Selected Address ID:', addressId);
    // TODO: Add logic to update selected address
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Current Address */}
      <div className="text-gray-700 mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Current Destination Address</h2>
        <p className="text-sm text-gray-600 mt-1">123 Main St, Phoenix, AZ 85001</p>
      </div>

      {/* Change Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Change
      </button>

      {/* Address Selection Dialog */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Dialog panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-sm w-full p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <Dialog.Title className="text-base font-semibold text-gray-800">
                Select Address
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address List */}
            <ul className="divide-y divide-gray-200">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className="py-2 cursor-pointer text-sm text-gray-700 hover:bg-blue-50 px-2 rounded"
                  onClick={() => handleAddressChange(address.id)}
                >
                  {address.label}
                </li>
              ))}
            </ul>

            {/* Optional footer buttons */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClose}
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
