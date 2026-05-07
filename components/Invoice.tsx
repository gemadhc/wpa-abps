'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  X,
  RotateCcw,
  MoreVertical,
  Ban,
  DollarSign,
} from 'lucide-react';

import LineItems from './LineItems';
import PaymentApp from './PaymentApp';
import { updateInvoiceStatus } from "../lib/invoice_db";
import { syncInvoices } from "../lib/sync";
import { requestQuickbooksID } from "../actions/invoice";

export default function Invoice({
  items = [],
  billing,
  invoice,
  reload,
  address,
  reloadItems,
  loadingItems = true
}) {
  const [isVoided, setIsVoided] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [allowPayment, setAllowPayment] = useState(navigator.onLine);
  const [mycustomer, setMyCustomer] = useState(null);

  const total = items.reduce(
    (sum, itm) => sum + itm.quantity * itm.unitPriceDefined,
    0
  );

  // ---------------- ONLINE / OFFLINE ----------------
  useEffect(() => {
    const handleOnline = () => setAllowPayment(true);
    const handleOffline = () => setAllowPayment(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    setOpenPaymentDialog(allowPayment && openPaymentDialog);
  }, [allowPayment]);

  // ---------------- STATUS ----------------
  useEffect(() => {
    if (invoice) {
      setIsVoided(invoice.status === "VOID" || invoice.status === "VOIDED");
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.customerID) {
      requestQuickbooksID(invoice.customerID).then((data) => {
        if (data?.Customer?.[0]?.quickbooksID) {
          setMyCustomer(data.Customer[0].quickbooksID);
        }
      });
    }
  }, [invoice]);

  // ---------------- ACTIONS ----------------
  const handleToggleVoid = async () => {
    setStatusLoading(true);

    if (isVoided) {
      await updateInvoiceStatus(invoice.id, "Scheduled");
    } else {
      await updateInvoiceStatus(invoice.id, "VOID");
    }

    await syncInvoices();
    setStatusLoading(false);
  };

  const canTakePayment =
    mycustomer &&
    total > 0 &&
    invoice?.status?.toUpperCase() !== 'PAID' &&
    !isVoided &&
    allowPayment;

  const statusStyles = {
    PAID: "bg-green-100 text-green-700",
    VOID: "bg-red-100 text-red-700",
    VOIDED: "bg-red-100 text-red-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-transparent  text-black">
      {/* HEADER */}
      <div className="py-3 px-4 bg-white rounded-xl mb-2 flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">#{invoice.id}</p>
        </div>

        <div className="flex items-center gap-2">

          {/* STATUS */}
          <span
            className={`text-xs px-2 py-2 font-bold ${
              statusStyles[invoice.status?.toUpperCase()] || "bg-gray-100"
            }`}
          >
            {statusLoading ? "Updating..." : invoice.status}
          </span>

          {/* ACTION MENU */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">

                {/* PAYMENT */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      disabled={!canTakePayment}
                      onClick={() => setOpenPaymentDialog(true)}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                        active ? 'bg-gray-100' : ''
                      } ${!canTakePayment ? 'text-gray-400' : ''}`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Take Payment
                    </button>
                  )}
                </Menu.Item>

                {/* VOID / UNVOID */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleToggleVoid}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                        active ? 'bg-gray-100' : ''
                      }`}
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

              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* BILLING */}
      <div className=" py-3 text-sm bg-white px-4 rounded-xl">
        <span className="font-semibold text-lg">Billing To</span>
        {billing ? (
          <p className="text-gray-600 leading-relaxed">
            {billing.name}<br />
            {billing.street}<br />
            {billing.city}, {billing.state} {billing.zipcode}<br />
            {billing.phone}<br />
            {billing.email}
          </p>
        ) : (
          <p className="text-gray-400">No billing info</p>
        )}
      </div>

      {/* LINE ITEMS */}
      <div className="pb-40 bg-white py-3 px-4 mt-2 rounded-xl">

        <div className="flex justify-between items-center mb-2 ">
          <span className="font-semibold text-lg">Work Performed</span>
          <span className="font-semibold text-lg"> Total: ${total.toFixed(2)}</span>
        </div>

        <LineItems
          items={items}
          invoiceID={invoice.id}
          reloadItems={reloadItems}
          loadingItems={loadingItems}
        />
      </div>

      {/* PAYMENT DIALOG */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center sm:p-4 text-black">
          <Dialog.Panel className="bg-white w-full sm:max-w-md min-h-screen sm:min-h-0 rounded-none sm:rounded-2xl ">
            <div className="flex justify-between items-center mb-3 h-20 w-full px-5 shadow">
              <Dialog.Title className="font-semibold text-lg">
                Process Payment
              </Dialog.Title>
              <button onClick={() => setOpenPaymentDialog(false)}>
                <X className="w-10 h-10 text-gray-500 border rounded-xl " />
              </button>
            </div>

            <PaymentApp
              amount={total}
              invoiceID={invoice.id}
              lineItems={items}
              billing={billing}
              address={address}
              invoice={invoice}
              customer={mycustomer}
              reload={() => reload()}
              closeMe={() => setOpenPaymentDialog(false)}
            />

          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}