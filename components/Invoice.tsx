'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, DollarSign, Ban, RotateCcw } from 'lucide-react';
import LineItems from './LineItems';
import PaymentApp from "./PaymentApp"

export default function Invoice({ items = [], billing, invoice}) {
  const [isVoided, setIsVoided] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  // Handlers
  const handleToggleVoid = () => setIsVoided((prev) => !prev);
  const handleOpenPayment = () => setOpenPaymentDialog(true);
  const handleClosePayment = () => setOpenPaymentDialog(false);

  const statusText = invoice.status;
  const statusColor = isVoided
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Invoice #12345
          </h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}
          >
            {statusText}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Void/Unvoid Button */}
          <button
            onClick={handleToggleVoid}
            className={`flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg transition-all w-full sm:w-auto ${
              isVoided
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isVoided ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Unvoid
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Void
              </>
            )}
          </button>

          {/* Take Payment Button */}
          <button
            onClick={handleOpenPayment}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          >
            <DollarSign className="w-4 h-4" />
            Take Payment
          </button>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-gray-50 border rounded-xl p-4 text-sm">
        <h3 className="font-medium text-gray-700 mb-1">Billing Address</h3>
        {
          billing ?
            <p className="text-gray-600 leading-relaxed">
              {billing.name}<br />
              {billing.street} <br />
              {billing.city}, {billing.state} {billing.zipcode} <br />
              {billing.phone} <br/>
              {billing.email}
            </p>
          : 
            <> No billing info available</>
        }

        
      </div>

      {/* Line Items */}
      {
        items.length ?
          <LineItems 
            items = {items}
          />
        : 
          <></>
      }
      
      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePayment} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800">
                Take Payment
              </Dialog.Title>
              <button
                onClick={handleClosePayment}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <Dialog.Description className="text-gray-600 text-sm mb-4">
              <PaymentApp 
              />
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
