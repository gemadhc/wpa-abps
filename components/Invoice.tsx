'use client';

import { useState, useEffect} from 'react';
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
import { updateStatus, requestQuickbooksID } from "../actions/invoice"
import { updateInvoiceStatus } from "../lib/invoice_db"
import { syncInvoices } from "../lib/sync"
import WaterLoader from "../components/WaterLoader"


export default function Invoice({ items = [], billing, invoice, reload, address, reloadItems, loadingItems = true}) {
  const [isVoided, setIsVoided] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [allowPayment, setAllowPayment] = useState(navigator.onLine)
  const total = items.reduce( (sum, itm) => sum + itm.quantity * itm.unitPriceDefined, 0 )
  const [mycustomer, setMyCustomer] = useState(null)


  useEffect(() => {
    const handleOnline = () => setAllowPayment(true);
    const handleOffline = () => setAllowPayment(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); 

  useEffect(()=>{
    setOpenPaymentDialog(allowPayment && openPaymentDialog)
  }, [allowPayment])

  useEffect(()=>{
    console.log("Invoice: ", invoice)
    if(invoice){
      setIsVoided( invoice.status == "VOID" || invoice.status == "VOIDED" )
    }else{
      setIsVoided(false)
    }
  }, [invoice])

  useEffect(()=>{
    if(invoice.customerID){
     requestQuickbooksID(invoice.customerID).then((data, err) => {
       if(data.Customer[0].quickbooksID){
        setMyCustomer(data.Customer[0].quickbooksID)
       }
     })
    }
  }, [invoice])

  // Handlers
  const handleToggleVoid = async() => {
    setStatusLoading(true)
    if(invoice.status == "VOID" || invoice.status == "VOIDED"){
      await updateInvoiceStatus(invoice.id, "Scheduled")
      await syncInvoices()
      await reload()
    }else{
      await updateInvoiceStatus(invoice.id, "VOID")
      await syncInvoices()
      await reload()
      
    }
    setStatusLoading(false)
  };

  const handleOpenPayment = () => setOpenPaymentDialog(true);
  const handleClosePayment = () => setOpenPaymentDialog(false);
  const handleEditInvoice = () => {
    console.log('Edit invoice clicked');
  };

  const statusText = invoice.status;
  const statusColor = isVoided
    ? 'text-red-700'
    : 'text-green-700';

  return (
    <div className="bg-white rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 pb-1 gap-3 bg-gray-50 rounded">
        {/* Left: Invoice Number + Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2>
            #{invoice.id}
          </h2>
          <span
            className={`font-bold px-2 py-1 rounded ${statusColor}`}
          >
            {
              statusLoading ?
                <span className = "text-gray-800 ">Loading...</span>
              : 
                <> 
                  {statusText}
                </>
            }
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
            <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right bg-white border border-gray-100 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none z-50">
              <div className="py-1">
                {/* Take Payment */}
                {
                  mycustomer  && allowPayment ? 
                     <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleOpenPayment}
                          className={`${
                            active ? 'bg-gray-50 text-green-600' : 'text-gray-700'
                          } flex items-center w-full px-3 py-8 text-sm gap-2`}
                        >
                          <DollarSign className="w-4 h-4" />
                          Take Payment
                        </button>
                      )}
                    </Menu.Item>
                  : 
                    <> </>
                }
               

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
      <div className="px-8 md:px-8 py-10 text-sm">
        <h2 className="font-medium text-gray-700 mb-1">Billing To </h2>
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
      <div className = "px-8 md:px-15  pb-60">
         <h2 className="font-medium text-gray-700 mb-1">Work Performed</h2>

         {
          items.length ? 
            <LineItems 
              items={items} 
              invoiceID = { invoice.id }
              reloadItems = { reloadItems }
              loadingItems = { loadingItems }
            />
          : 
            <div className = "pt-15 "> 
              <p className = "text-slate-500 font-bold text-center "> Loading Billing Items </p>
              <WaterLoader />
            </div>
         }

        
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePayment}
        className="relative z-50 "
      >
        <div className="fixed inset-0 bg-black/30 " aria-hidden="true"  />
        <div className="fixed inset-0 flex items-center justify-center  sm:p-4">
          <Dialog.Panel className="bg-white  shadow-xl w-full sm:max-w-md p-4 sm:p-6 min-h-screen">
            <div className="flex items-center justify-between mb-3">
              <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800">
                Process Payment
              </Dialog.Title>
              <button
                onClick={handleClosePayment}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

          
            <PaymentApp 
              amount = {total}
              invoiceID = {invoice.id}
              lineItems = {items}
              billing = {billing} 
              address = {address}
              invoice = {invoice}
              customer = {mycustomer}
              reload = { ()=> reload() }
              closeMe = { ()=> handleClosePayment() }
            />
            
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
