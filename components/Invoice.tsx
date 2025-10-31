'use client';

import { useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  X,
  DollarSign,
  Ban,
  RotateCcw,
  Pencil,
  MoreVertical,
} from 'lucide-react';
import LineItems from './LineItems';
import PaymentApp from './PaymentApp';


export default function Invoice({ items = [], billing, invoice, reload, address}) {
  const [isVoided, setIsVoided] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const total = items.reduce( (sum, itm) => sum + itm.quantity * itm.unitPriceDefined, 0 )
  // Handlers
  const handleToggleVoid = () => setIsVoided((prev) => !prev);
  const handleOpenPayment = () => setOpenPaymentDialog(true);
  const handleClosePayment = () => setOpenPaymentDialog(false);
  const handleEditInvoice = () => {
    console.log('Edit invoice clicked');
  };

  const statusText = invoice.status;
  const statusColor = isVoided
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-3">
        {/* Left: Invoice Number + Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            #{invoice.id}
          </h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}
          >
            {statusText}
          </span>
           <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white border border-gray-100 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none z-50">
              <div className="py-1">
                {/* Take Payment */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleOpenPayment}
                      className={`${
                        active ? 'bg-gray-50 text-green-600' : 'text-gray-700'
                      } flex items-center w-full px-3 py-2 text-sm gap-2`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Take Payment
                    </button>
                  )}
                </Menu.Item>

                {/* Void / Unvoid */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleToggleVoid}
                      className={`${
                        active
                          ? isVoided
                            ? 'bg-gray-50 text-green-600'
                            : 'bg-gray-50 text-red-600'
                          : 'text-gray-700'
                      } flex items-center w-full px-3 py-2 text-sm gap-2`}
                    >
                      {isVoided ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          Unvoid Invoice
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4" />
                          Void Invoice
                        </>
                      )}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        </div>

        {/* Right: Ellipsis Menu */}
       
      </div>

      {/* Billing Address */}
      <div className="bg-gray-50 border rounded-xl p-4 text-sm">
        <h3 className="font-medium text-gray-700 mb-1">Billing Address</h3>
        {billing ? (
          <p className="text-gray-600 leading-relaxed">
            {billing.name}
            <br />
            {billing.street} <br />
            {billing.city}, {billing.state} {billing.zipcode} <br />
            {billing.phone} <br />
            {billing.email}
          </p>
        ) : (
          <>No billing info available</>
        )}
      </div>

      {/* Line Items */}
      <LineItems 
        items={items} 
        invoiceID = { invoice.id }
        reloadItems = { reload }
    
      />

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePayment}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800">
                
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
                amount = {total}
                invoiceID = {invoice.id}
                lineItems = {items}
                billing = {billing} 
                address = {address}
                invoice = {invoice}
              />
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
