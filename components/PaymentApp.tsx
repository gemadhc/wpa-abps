'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {updateStatus, requestQuickbooksID} from "../actions/invoice"
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

  const [paymentType, setPaymentType] = useState('CARD');
  const [paid, setPaid] = useState(false);

  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    zip: '',
    email: '',
  });

  const [cashAmount, setCashAmount] = useState(amount);
  const [checkNumber, setCheckNumber] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => String(current + i));
  }, []);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
    []
  );

  /** SUCCESS HANDLER */
  const finishSuccess = async () => {
    setPaid(true);
    setFeedback({ message: 'PAID!', type: 'success' });
    updateStatus(invoiceID, "PAID").then((
      reload()
    ))
    setTimeout(() => {
      closeMe();
      setPaid(false);
    }, 1800);
  };

  /** CREATE SALES RECEIPT & EMAIL */
  const createReceiptAndEmail = async (salesBody) => {
    const sales = await createSalesReceipt(salesBody, invoiceID);
    await emailSalesReceipt(sales.Id, salesBody.BillEmail.Address);
    finishSuccess();
  };

  /** CARD PAYMENT */
  const handleCardPayment = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Encrypting card…', type: 'info' });

    try {
      const tokenRes = await createToken(cardData);

      if (!tokenRes?.value) {
        const errors = tokenRes?.errors?.map(e => e.message).join(" | ");
        return setFeedback({ message: errors || 'Card token error', type: 'error' });
      }

      setFeedback({ message: 'Charging card…', type: 'info' });

      const chargeBody = {
        currency: 'USD',
        amount,
        context: { mobile: 'false', isEcommerce: 'true' },
        token: tokenRes.value,
      };

      const charge = await createCharge(chargeBody);

      if (['DECLINED', 'CANCELLED'].includes(charge.status)) {
        return setFeedback({ message: `Charge ${charge.status}`, type: 'error' });
      }

      setFeedback({ message: 'Creating sales receipt…', type: 'info' });

      const salesBody = {
        Line: getLine(lineItems),
        CustomerRef: customerReference(customer),
        TxnDate: getTxnDate(),
        BillAddr: formatAddress(billing),
        ShipAddr: formatAddress(address),
        CustomField: getCustomFields(invoice, address, billing),
        DocNumber: `FP${invoiceID}`,
        PaymentMethodRef: {
          value: process.env.VISA_METHOD_REF,
          name: 'Visa',
        },
        TxnSource: 'IntuitPayment',
        BillEmail: { Address: cardData.email }
      };

      await createReceiptAndEmail(salesBody);

    } catch (err) {
      console.error(err);
      setFeedback({ message: 'Payment failed. Try again.', type: 'error' });
    }
  };

  /** CASH PAYMENT */
  const handleCashPayment = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Creating sales receipt…', type: 'info' });

    const salesBody = {
      Line: getLine(lineItems),
      CustomerRef: customerReference(customer),
      TxnDate: getTxnDate(),
      BillAddr: formatAddress(billing),
      ShipAddr: formatAddress(address),
      CustomField: getCustomFields(invoice, address, billing),
      PrivateNote: `Field cash payment: $${cashAmount}`,
      DocNumber: `FP${invoiceID}`,
      PaymentMethodRef: {
        value: process.env.CASH_METHOD_REF,
        name: 'Cash',
      },
      TxnSource: 'IntuitPayment',
      BillEmail: { Address: cardData.email }
    };

    await createReceiptAndEmail(salesBody);
  };

  /** CHECK PAYMENT */
  const handleCheckPayment = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Creating sales receipt…', type: 'info' });

    const salesBody = {
      Line: getLine(lineItems),
      CustomerRef: customerReference(customer),
      TxnDate: getTxnDate(),
      BillAddr: formatAddress(billing),
      ShipAddr: formatAddress(address),
      CustomField: getCustomFields(invoice, address, billing),
      PrivateNote: `Field check payment • Check #${checkNumber}`,
      DocNumber: `FP${invoiceID}`,
      PaymentRefNum: checkNumber,
      PaymentMethodRef: {
        value: process.env.CHECK_METHOD_REF,
        name: 'Check',
      },
      TxnSource: 'IntuitPayment',
      BillEmail: { Address: cardData.email }
    };

    await createReceiptAndEmail(salesBody);
  };

  const isCardValid =
    cardData.cardName &&
    cardData.cardNumber &&
    cardData.expiryMonth &&
    cardData.expiryYear &&
    cardData.cvv &&
    cardData.zip &&
    cardData.email;

  const isCashValid = cashAmount;
  const isCheckValid = checkNumber;

  const feedbackColor =
    feedback.type === 'success'
      ? 'text-green-600'
      : feedback.type === 'error'
        ? 'text-red-600'
        : 'text-blue-600';

  return (
    <div className="relative bg-white p-4 max-w-md mx-auto overflow-hidden">

      {/* PAID OVERLAY */}
      <AnimatePresence>
        {paid && (
          <motion.div
            key="paid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/90 z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-green-600">✅</div>
              <div className="text-3xl font-bold text-green-700 mt-3">PAID</div>
              <p className="mt-1 text-gray-500">Payment Successful</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Take Payment</h2>

      {/* Payment Type */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Payment Type</label>
        <select
          value={paymentType}
          onChange={(e) => {
            setPaymentType(e.target.value);
            setFeedback({ message: '', type: '' });
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="CARD">CARD</option>
          <option value="CASH">CASH</option>
          <option value="CHECK">CHECK</option>
        </select>
      </div>

      {feedback.message && (
        <p className={`mt-2 text-sm font-medium ${feedbackColor}`}>{feedback.message}</p>
      )}

      <div className="mt-4 space-y-4">

        {/* CARD FORM */}
        {paymentType === 'CARD' && (
          <form onSubmit={handleCardPayment} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name on Card</label>
              <input
                type="text"
                value={cardData.cardName}
                onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                required
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                maxLength={19}
                required
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Exp Month</label>
                <input
                  type="text"
                  value={cardData.expiryMonth}
                  onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                  placeholder="MM"
                  className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Exp Year</label>
                <input
                  type="text"
                  value={cardData.expiryYear}
                  onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                  placeholder="YYYY"
                  className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                maxLength={4}
                required
                className="w-full border  text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code</label>
              <input
                type="text"
                value={cardData.zip}
                onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                required
                className="w-full border text-black  border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!isCardValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCardValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
              }`}
            >
              Pay ${amount}
            </button>
          </form>
        )}

        {/* CASH FORM */}
        {paymentType === 'CASH' && (
          <form onSubmit={handleCashPayment} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount Received</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!isCashValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCashValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'
              }`}
            >
              Submit Cash Payment ${amount}
            </button>
          </form>
        )}

        {/* CHECK FORM */}
        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check Number</label>
              <input
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                required
                className="w-full border  text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                required
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!isCheckValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCheckValid ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400'
              }`}
            >
              Submit Check Payment ${amount}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
