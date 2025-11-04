'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createToken,
  createCharge,
  createSalesReceipt,
  emailSalesReceipt
} from "../actions/quickbooks.js"
import {
  getLine,
  formatAddress,
  getCustomFields,
  cutomerReference,
  getTxnDate
} from "../helpers/quickbooks"


export default function PaymentApp({ amount, invoiceID, lineItems, billing, address, invoice, customer, closeMe }) {
  const [paymentType, setPaymentType] = useState('CARD');
  const [paid, setPaid] = useState(false);

  const [cardData, setCardData] = useState({
    cardName: 'emulate=10201',
    cardNumber: '5111005111051128',
    expiryMonth: '10',
    expiryYear: '2030',
    cvv: '134',
    zip: '97011',
    email: 'gemadhc@gmail.com',
  });

  const [cashAmount, setCashAmount] = useState(amount);
  const [checkNumber, setCheckNumber] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  useEffect(() => {
    console.log(`params: ${amount}, ${invoiceID} , ${lineItems}, ${billing}, ${address.street}, ${invoice} ${customer}`);
  }, []);

  // ✅ CARD PAYMENT HANDLER
  const handleCardPayment = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Encrypting Card', type: 'info' });

    try {
      createToken(cardData).then(async (data) => {
        if (!data?.value) {
          let errors = data?.errors?.map(e => e.message).join(" | ");
          setFeedback({ message: errors, type: 'error' });
          return;
        }

        setFeedback({ message: 'Charging Card...', type: 'info' });

        const chargeBody = {
          currency: 'USD',
          amount,
          context: { mobile: 'false', isEcommerce: 'true' },
          token: data.value,
        };

        let chargeresponse = await createCharge(chargeBody);

        if (chargeresponse.status === "DECLINED" || chargeresponse.status === "CANCELLED") {
          setFeedback({ message: `Charge was ${chargeresponse.status}`, type: 'error' });
          return;
        }

        setFeedback({ message: 'Creating Sales Receipt...', type: 'info' });

        const salesBody = {
          Line: getLine(lineItems),
          CustomerRef: cutomerReference(customer),
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

        let sales = await createSalesReceipt(salesBody, invoiceID);

        setFeedback({ message: 'Emailing Receipt...', type: 'info' });
        await emailSalesReceipt(sales.Id, cardData.email);

        // ✅ SUCCESS — trigger animation
        setPaid(true);
        setFeedback({ message: 'PAID!', type: 'success' });

        // ❗ Close modal after animation
        setTimeout(() => {
          closeMe();
          setPaid(false);
        }, 2000);
      });

    } catch (err) {
      console.error(err);
      setFeedback({ message: 'Payment failed. Try again.', type: 'error' });
    }
  };

  // ✅ FLOATING INPUT COMPONENT
  const FloatingInput = ({ label, type = 'text', value, onChange, ...props }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        {...props}
        className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
      <label className="absolute left-3 top-1.5 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
        {label}
      </label>
    </div>
  );

  const handleCashPayment = async (e)=>{
    e.preventDefault()
    //create sales receipt
    setFeedback({ message: 'Creating Sales Receipt...', type: 'info' });
    const salesBody = {
          Line: getLine(lineItems),
          CustomerRef: cutomerReference(customer),
          TxnDate: getTxnDate(),
          BillAddr: formatAddress(billing),
          ShipAddr: formatAddress(address),
          CustomField: getCustomFields(invoice, address, billing),
          PrivateNote: `Field cash payment $${cashAmount}`, 
          DocNumber: `FP${invoiceID}`,
          PaymentMethodRef: {
            value: process.env.CASH_METHOD_REF,
            name: 'Visa',
          },
          TxnSource: 'IntuitPayment',
          BillEmail: { Address: cardData.email }
        };
    console.log("Creating this payment: ", salesBody)
    let sales = await createSalesReceipt(salesBody, invoiceID);

        setFeedback({ message: 'Emailing Receipt...', type: 'info' });
        await emailSalesReceipt(sales.Id, cardData.email);

        // ✅ SUCCESS — trigger animation
        setPaid(true);
        setFeedback({ message: 'PAID!', type: 'success' });

        // ❗ Close modal after animation
        setTimeout(() => {
          closeMe();
          setPaid(false);
        }, 2000);

  } 
  const handleCheckPayment = async (e)=>{
    e.preventDefault()
    setFeedback({ message: 'Creating Sales Receipt...', type: 'info' });
    const salesBody = {
          Line: getLine(lineItems),
          CustomerRef: cutomerReference(customer),
          TxnDate: getTxnDate(),
          BillAddr: formatAddress(billing),
          ShipAddr: formatAddress(address),
          CustomField: getCustomFields(invoice, address, billing),
          PrivateNote: `Field check payment Check # ${checkNumber}`, 
          DocNumber: `FP${invoiceID}`,
          PaymentRefNum: `${checkNumber}`, 
          PaymentMethodRef: {
            value: process.env.CHECK_METHOD_REF,
            name: 'Visa',
          },
          TxnSource: 'IntuitPayment',
          BillEmail: { Address: cardData.email }
        };
    console.log("Creating this payment: ", salesBody)
    let sales = await createSalesReceipt(salesBody, invoiceID);

        setFeedback({ message: 'Emailing Receipt...', type: 'info' });
        await emailSalesReceipt(sales.Id, cardData.email);

        // ✅ SUCCESS — trigger animation
        setPaid(true);
        setFeedback({ message: 'PAID!', type: 'success' });

        // ❗ Close modal after animation
        setTimeout(() => {
          closeMe();
          setPaid(false);
        }, 2000);
  }

  // ✅ Validation
  const isCardFormValid =
    cardData.cardName &&
    cardData.cardNumber &&
    cardData.expiryMonth &&
    cardData.expiryYear &&
    cardData.cvv &&
    cardData.zip &&
    cardData.email;

  const isCashValid = cashAmount !== '';
  const isCheckValid = checkNumber !== '';

  const feedbackColor =
    feedback.type === 'success'
      ? 'text-green-600'
      : feedback.type === 'error'
      ? 'text-red-600'
      : 'text-blue-600';


  return (
    <div className="relative p-0 bg-white max-w-md mx-auto overflow-hidden">

      {/* ✅ PAID ANIMATION OVERLAY */}
      <AnimatePresence>
        {paid && (
          <motion.div
            key="paid-overlay"
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
              <p className="mt-2 text-gray-500">Payment Successful</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ MAIN UI */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Take Payment</h2>

      {/* Dropdown */}
      <div className="relative mb-3">
        <select
          value={paymentType}
          onChange={(e) => {
            setPaymentType(e.target.value);
            setFeedback({ message: '', type: '' });
          }}
          className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
        >
          <option value="">Select payment type</option>
          <option value="CARD">CARD</option>
          <option value="CASH">CASH</option>
          <option value="CHECK">CHECK</option>
        </select>
        <label className="absolute left-3 top-1.5 text-xs text-gray-500">
          Payment Type
        </label>
      </div>

      {feedback.message && (
        <p className={`mt-2 text-sm font-medium ${feedbackColor}`}>
          {feedback.message}
        </p>
      )}

      <div className="mt-4 text-gray-700 font-medium space-y-3">

        {/* ✅ CARD FORM */}
        {paymentType === 'CARD' && (
          <form onSubmit={handleCardPayment} className="flex flex-col gap-3">

            <FloatingInput
              label="Name on Card"
              value={cardData.cardName}
              onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
              required
            />

            <FloatingInput
              label="Card Number"
              value={cardData.cardNumber}
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
              maxLength={19}
              required
            />

            <div className="flex gap-2">
              <div className="relative w-1/2">
                <select
                  value={cardData.expiryMonth}
                  onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                  className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm"
                >
                  <option value="">MM</option>
                  {months.map((m) => <option key={m}>{m}</option>)}
                </select>
                <label className="absolute left-3 top-1.5 text-xs text-gray-500">
                  Exp Month
                </label>
              </div>

              <div className="relative w-1/2">
                <select
                  value={cardData.expiryYear}
                  onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                  className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm"
                >
                  <option value="">YYYY</option>
                  {years.map((y) => <option key={y}>{y}</option>)}
                </select>
                <label className="absolute left-3 top-1.5 text-xs text-gray-500">
                  Exp Year
                </label>
              </div>
            </div>

            <FloatingInput
              label="CVV"
              value={cardData.cvv}
              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
              maxLength={4}
              required
            />

            <FloatingInput
              label="ZIP Code"
              value={cardData.zip}
              onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
              required
            />

            <FloatingInput
              label="Email Address"
              type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={!isCardFormValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCardFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              }`}
            >
              Pay {`$${amount}`}
            </button>
          </form>
        )}

        {/* ✅ CASH */}
        {paymentType === 'CASH' && (
          <form onSubmit={ handleCashPayment } className="flex flex-col gap-3">
            <FloatingInput
              label="Amount Received"
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              required
            />
            <FloatingInput
              label="email"
              type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={!isCashValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCashValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              }`}
            >
              Submit Cash Payment {`$${amount}`}
            </button>
          </form>
        )}

        {/* ✅ CHECK */}
        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment } className="flex flex-col gap-3">
            <FloatingInput
              label="Check Number"
              type="text"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              required
            />
            <FloatingInput
              label="email"
              type="email"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={!isCheckValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCheckValid ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400"
              }`}
            >
              Submit Check Payment of {`$${amount}`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
