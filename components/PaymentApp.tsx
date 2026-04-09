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
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" }
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

  /** Floating Input Wrapper */
  const FloatingInput = ({ label, value, onChange, type = "text", inputMode }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        placeholder=" "
        className="peer w-full rounded-xl border border-gray-300 px-3 pt-5 pb-2 text-base text-black focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all 
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600">
        {label}
      </label>
    </div>
  );

  /** Floating Select */
  const FloatingSelect = ({ label, value, onChange, children }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="peer w-full rounded-xl border border-gray-300 px-3 pt-5 pb-2 text-base text-black focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {children}
      </select>
      <label className="absolute left-3 top-2 text-xs text-gray-500">
        {label}
      </label>
    </div>
  );

  /** SUCCESS HANDLER */
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

  const createReceiptAndEmail = async (salesBody) => {
    const sales = await createSalesReceipt(salesBody, invoiceID);
    await emailSalesReceipt(sales.Id, salesBody.BillEmail.Address);
    finishSuccess();
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

  const handleCardPayment = (e) => safeSubmit(async () => {
    e.preventDefault();
    if(cardData.cardName == '' || cardData.cardNumber == '' || cardData.cvv == '' || cardData.zip == '' || cardData.email == '' ){
      setIsProcessing(false)
      return setFeedback({ message: 'Please fill out all the fields', type: 'error' });
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

    const salesBody = {
      Line: getLine(lineItems),
      CustomerRef: customerReference(customer),
      TxnDate: getTxnDate(),
      BillAddr: formatAddress(billing),
      ShipAddr: formatAddress(address),
      CustomField: getCustomFields(invoice, address, billing),
      DocNumber: `FP${invoiceID}`,
      PaymentMethodRef: { value: process.env.VISA_METHOD_REF },
      BillEmail: { Address: cardData.email },
      CreditCardPayment: {
        CreditChargeResponse: { CCTransId: charge.id },
      }
    };

    await createReceiptAndEmail(salesBody);
  });

  const handleCashPayment = (e) => safeSubmit(async () => {
    e.preventDefault();
    setFeedback({ message: 'Recording cash...', type: 'info' });
    if( cardData.email == '' || cashAmount == ''){
      setIsProcessing(false)
      return setFeedback({ message: 'Please fill out all the fields', type: 'error' });
    }

    const salesBody = {
      Line: getLine(lineItems),
      CustomerRef: customerReference(customer),
      TxnDate: getTxnDate(),
      BillAddr: formatAddress(billing),
      ShipAddr: formatAddress(address),
      CustomField: getCustomFields(invoice, address, billing),
      PrivateNote: `Cash: $${cashAmount}`,
      DocNumber: `FP${invoiceID}`,
      PaymentMethodRef: { value: process.env.CASH_METHOD_REF },
      BillEmail: { Address: cardData.email }
    };

    await createReceiptAndEmail(salesBody);
  });

  const handleCheckPayment = (e) => safeSubmit(async () => {
    e.preventDefault();
    setFeedback({ message: 'Recording check...', type: 'info' });
    if( cardData.email == '' || checkNumber == ''){
      setIsProcessing(false)
      return setFeedback({ message: 'Please fill out all the fields', type: 'error' });
    }
    const salesBody = {
      Line: getLine(lineItems),
      CustomerRef: customerReference(customer),
      TxnDate: getTxnDate(),
      BillAddr: formatAddress(billing),
      ShipAddr: formatAddress(address),
      CustomField: getCustomFields(invoice, address, billing),
      PrivateNote: `Check #${checkNumber}`,
      DocNumber: `FP${invoiceID}`,
      PaymentRefNum: checkNumber,
      PaymentMethodRef: { value: process.env.CHECK_METHOD_REF },
      BillEmail: { Address: cardData.email }
    };

    await createReceiptAndEmail(salesBody);
  });

  return (
    <div className="relative bg-white max-w-md mx-auto h-full flex flex-col text-black">

      <AnimatePresence>
        {paid && (
          <motion.div className="absolute inset-0 bg-white/100 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-2xl font-bold mt-2 text-green-900">Paid</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex p-4 border-b gap-4">
        <div>
          <div className="text-sm text-gray-800">Amount</div>
          <div className="text-3xl font-bold text-black">${amount}</div>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {feedback.message && (
          <div className="text-sm font-medium text-red-700">
            {feedback.message}
          </div>
        )}

        {paymentType === 'CARD' && (
          <form onSubmit={handleCardPayment} className="space-y-3">
            <FloatingInput label="Name on Card" value={cardData.cardName}
              onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })} />

            <FloatingInput label="Card Number" value={cardData.cardNumber} inputMode="numeric"
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })} />

            <div className="flex gap-2">
              <FloatingSelect label="Month"
                value={cardData.expiryMonth}
                onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
              >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </FloatingSelect>

              <FloatingSelect label="Year"
                value={cardData.expiryYear}
                onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </FloatingSelect>
            </div>

            <FloatingInput label="CVV" value={cardData.cvv} inputMode="numeric"
              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} />

            <FloatingInput label="ZIP" value={cardData.zip} inputMode="numeric"
              onChange={(e) => setCardData({ ...cardData, zip: e.target.value })} />

            <FloatingInput label="Email" type="email" value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })} />
          </form>
        )}

        {paymentType === 'CASH' && (
          <form onSubmit={handleCashPayment} className="space-y-3">
            <FloatingInput label="Amount Received" type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)} />

            <FloatingInput label="Email" type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })} />
          </form>
        )}

        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment} className="space-y-3">
            <FloatingInput label="Check Number"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)} />

            <FloatingInput label="Email" type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })} />
          </form>
        )}
      </div>

      {/* SUBMIT */}
      <div className="p-4  bg-white">
        <button
          onClick={
            paymentType === 'CARD'
              ? handleCardPayment
              : paymentType === 'CASH'
              ? handleCashPayment
              : handleCheckPayment
          }
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl text-lg font-semibold text-white ${
            isProcessing ? 'bg-gray-400' : 'bg-green-700'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </div>
  );
}