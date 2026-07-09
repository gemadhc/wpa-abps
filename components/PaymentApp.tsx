'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateStatus } from "../actions/invoice";
import {
  createToken,
  createCharge,
  createSalesReceipt,
  emailSalesReceipt
} from "../actions/quickbooks.js";
import {
  getLine,
  formatAddress,
  getCustomFields,
  customerReference,
  getTxnDate
} from "../helpers/quickbooks";

export default function PaymentApp({
  amount,
  invoiceID,
  lineItems,
  billing,
  address,
  invoice,
  customer,
  reload,
  closeMe
}) {

  const currentDate = new Date();

  const months = useMemo(() => ([
    { value: "01", label: "Jan" }, { value: "02", label: "Feb" },
    { value: "03", label: "Mar" }, { value: "04", label: "Apr" },
    { value: "05", label: "May" }, { value: "06", label: "Jun" },
    { value: "07", label: "Jul" }, { value: "08", label: "Aug" },
    { value: "09", label: "Sep" }, { value: "10", label: "Oct" },
    { value: "11", label: "Nov" }, { value: "12", label: "Dec" }
  ]), []);

  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return Array.from({ length: 30 }, (_, i) => String(currentYear + i));
  }, []);

  const [paymentType, setPaymentType] = useState('CARD');
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashAmount, setCashAmount] = useState(amount);
  const [checkNumber, setCheckNumber] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const inputClass = "peer w-full h-14 rounded-xl border border-gray-300 px-3 pt-5 pb-2 text-base focus:ring-2 focus:ring-green-600 outline-none"
  const labelClass =  `absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-700`
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: String(currentDate.getMonth() + 1).padStart(2, '0'),
    expiryYear: String(currentDate.getFullYear()),
    cvv: '',
    zip: '',
    email: '',
  });

  useEffect(() => {
    setFeedback({ message: '', type: '' });
  }, [paymentType]);

  // ---------------- INPUT COMPONENTS ----------------

  const FloatingInput = ({ label, value, onChange, type = "text", inputMode, name }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        name = {name}
        placeholder=" "
        className="peer w-full h-14 rounded-xl border border-gray-300 px-3 pt-5 pb-2 text-base
        focus:ring-2 focus:ring-green-600 outline-none"
      />
      <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-700">
        {label}
      </label>
    </div>
  );

  const FloatingSelect = ({ label, value, onChange, children }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="peer w-full h-14 rounded-xl border border-gray-300 px-3 pt-5 pb-2 text-base
        focus:ring-2 focus:ring-green-600 outline-none"
      >
        {children}
      </select>
      <label className="absolute left-3 top-2 text-xs text-gray-500">
        {label}
      </label>
    </div>
  );

  // ---------------- CORE HELPERS ----------------

  const finishSuccess = async () => {
    setPaid(true);
    setFeedback({ message: 'Payment complete', type: 'success' });

    await updateStatus(invoiceID, "PAID");
    reload();

    setTimeout(() => {
      closeMe();
      setPaid(false);
      setIsProcessing(false);
    }, 1500);
  };

  const safeSubmit = async (fn) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await fn();
    } catch (err) {
      console.error(err);
      setFeedback({ message: 'Something went wrong', type: 'error' });
      setIsProcessing(false);
    }
  };

  // ---------------- HANDLERS ----------------

  const handleCardPayment = (e) => safeSubmit(async () => {
    e.preventDefault();

    if (!cardData.cardName || !cardData.cardNumber || !cardData.cvv || !cardData.zip || !cardData.email) {
      setIsProcessing(false);
      return setFeedback({ message: 'Fill all fields', type: 'error' });
    }

    setFeedback({ message: 'Processing card...', type: 'info' });

    const tokenRes = await createToken(cardData);
    if (!tokenRes?.value) {
      setIsProcessing(false);
      return setFeedback({ message: 'Invalid card', type: 'error' });
    }

    const charge = await createCharge({
      currency: 'USD',
      amount,
      token: tokenRes.value,
    });

    if (['DECLINED', 'CANCELLED'].includes(charge.status)) {
      setIsProcessing(false);
      return setFeedback({ message: 'Card declined', type: 'error' });
    }

    await finishSuccess();
  });

  const handleChange = (e) =>{
    const { name, value, type, checked } = e.target;
    setCardData( (prev) =>{
      let updated; 
      updated = {
        ...prev, 
        [name]: value
      }
      return updated

    })

  }

  const handleCashPayment = (e) => safeSubmit(async () => {
    e.preventDefault();

    if (!cardData.email || !cashAmount) {
      setIsProcessing(false);
      return setFeedback({ message: 'Missing info', type: 'error' });
    }

    setFeedback({ message: 'Recording cash...', type: 'info' });
    await finishSuccess();
  });

  const handleCheckPayment = (e) => safeSubmit(async () => {
    e.preventDefault();

    if (!cardData.email || !checkNumber) {
      setIsProcessing(false);
      return setFeedback({ message: 'Missing info', type: 'error' });
    }

    setFeedback({ message: 'Recording check...', type: 'info' });
    await finishSuccess();
  });

  // ---------------- UI ----------------

  return (
    <div className="relative bg-white max-w-md mx-auto h-full flex flex-col">

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {paid && (
          <motion.div className="absolute inset-0 bg-white flex items-center justify-center z-50">
            <div className="text-xl font-bold text-green-700">Paid</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="p-4 border-b flex gap-10">
        <div>
          <div className="text-xs text-gray-500">Amount</div>
          <div className="text-3xl font-bold">${amount}</div>
        </div>

        <div className="flex-1">
          <FloatingSelect
            label="Payment Type"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="CHECK">Check</option>
          </FloatingSelect>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">

        {feedback.message && (
          <div className={`text-sm p-3 rounded-lg ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700'
              : feedback.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {paymentType === 'CARD' && (
          <form onSubmit={handleCardPayment} className="space-y-3">
            <div className = "relative">
              <input
                className = {inputClass}
                name = "cardName"
                value={cardData.cardName}
                onChange={(e)=> handleChange(e) }

              />
              <label className = { labelClass}>Name on Card</label>
            </div>
            <div className="relative">
              <input
                name = "cardNumber"
                inputMode="numeric"
                value={cardData.cardNumber}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}> Card Number</label> 
            </div>
            <div className = "flex gap-2">
              <div className="w-full relative">
                <select
                  name = "expiryMonth"
                  value={cardData.expiryMonth}
                  onChange={handleChange} 
                  className={ inputClass}
                >
                  {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <label className = {labelClass}> Exp. Month</label> 
              </div>
              <div className="w-full relative">
                <select
                  name = "expiryYear"
                  value={cardData.expiryYear}
                  onChange={handleChange} 
                  className={ inputClass}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <label className = {labelClass}> Exp. Year</label> 
              </div>
            </div>
            <div className="relative">
              <input
                name = "cvv"
                inputMode="numeric"
                value={cardData.cvv}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}> CVV</label> 
            </div>
            <div className="relative">
              <input
                name = "zip"
                inputMode="numeric"
                value={cardData.zip}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}>Zipcode</label> 
            </div>
            <div className="relative">
              <input
                name = "email"
                inputMode="email"
                value={cardData.email}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}>Email Address</label> 
            </div>
          </form>
        )}

        {paymentType === 'CASH' && (
          <form onSubmit={handleCashPayment} className="space-y-3">
            <div className="relative">
              <input
                name = "amount"
                inputMode="numeric"
                value={`$${cashAmount}`}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}>Cash Amount </label> 
            </div>
            <div className="relative">
              <input
                name = "email"
                inputMode="email"
                value={cardData.email}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}>Email Address</label> 
            </div>
          </form>
        )}

        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment} className="space-y-3">
            <div className="relative">
              <input
                name = "checkNumber"
                value={checkNumber}
                onChange={(e)=> setCheckNumber( e.target.value.toUpperCase().replace( /[^a-zA-Z0-9]/g, "") ) } 
                className={ inputClass}
              />
              <label className = {labelClass}>Check Number</label> 
            </div>

            <div className="relative">
              <input
                name = "email"
                inputMode="email"
                value={cardData.email}
                onChange={handleChange} 
                className={ inputClass}
              />
              <label className = {labelClass}>Email Address</label> 
            </div>
          </form>
        )}
      </div>

      {/* STICKY SUBMIT */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
        <button
          type="button"
          onClick={
            paymentType === 'CARD'
              ? handleCardPayment
              : paymentType === 'CASH'
              ? handleCashPayment
              : handleCheckPayment
          }
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition
            ${isProcessing
              ? 'bg-gray-400 pointer-events-none'
              : 'bg-green-700 active:scale-95'}
          `}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </div>
  );
}