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
    }else{
      await updateInvoiceStatus(invoice.id, "VOID")
      await syncInvoices()
      
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

      {/* Billing Address */}
      <div className="px-8 md:px-8 py-0 text-sm">
        <div className="grid grid-cols-10 gap-5 border-b pb-2" >

        
        <div className = {`col-span-3`}>#{invoice.id}</div> 
        <div
            className={`col-span-3 `}
          >
            {
              statusLoading ?
                <span className = "text-gray-800 ">Loading...</span>
              : 
                <> 
                  {statusText}
                </>
            }
          </div>
          {
            mycustomer && total != 0 && invoice?.status?.toUpperCase() != 'PAID' ?
              <button
                onClick={handleOpenPayment}
                className= {`col-span-2 rounded  shadow-lg bg-green-50 flex flex-row p-2 border border-green-800 text-green-800`}
              >
                Payment
              </button>
            : 
              <button
                disabled
                onClick={handleOpenPayment}
                className= {`col-span-2 rounded  shadow-lg bg-green-50 flex flex-row p-2 border border-green-800 text-green-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500`}
              >
                Payment
              </button>


          }

          

          <button
            onClick={handleToggleVoid}
            className={`col-span-2 rounded  shadow-lg bg-red-50 flex flex-row p-2 border border-red-800 text-red-800`}
          >
            {isVoided ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Unvoid Invoice
              </>
            ) : (
              <>
                Void
              </>
            )}
        </button>

      </div>

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

      <br/>
      {/* Line Items */}
      <div className = "px-8 md:px-15  pb-60">
         <h2 className="font-medium text-gray-700 mb-1">Work Performed</h2>
         <LineItems 
              items={items} 
              invoiceID = { invoice.id }
              reloadItems = { reloadItems }
              loadingItems = { loadingItems }
          />
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
