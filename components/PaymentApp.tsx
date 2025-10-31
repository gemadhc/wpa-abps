'use client';
import { useState } from 'react';
import { createToken, createCharge } from "../actions/quickbooks.js"
import { getLine, formatAddress,
 getCustomFields, cutomerReference, getTxnDate } from "../helpers/quickbooks"


export default function PaymentApp({amount, invoiceID, lineItems, billing, address, invoice, customer}) {
  const [paymentType, setPaymentType] = useState('');
  const [cardData, setCardData] = useState({
    cardName: 'test',
    cardNumber: '4112 3441 1234 4113',
    expiryMonth: '10',
    expiryYear: '2030',
    cvv: '123',
    zip: '97011',
    email: 'gemadhc@gmail.com',
  });
  const [cashAmount, setCashAmount] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ message: 'Encrypting Card', type: 'info' });
    try {
      createToken(cardData).then(async(data, err) =>{
        if(data?.value){
          setFeedback({ message: `Encrypted!`, type: 'info' });
           setFeedback({ message: 'Charging Card', type: 'info' });
            const chargeBody = {
              currency: 'USD',
              amount: amount,
              context: { mobile: 'false', isEcommerce: 'true' },
              token: data.value,
            };
            let chargeresponse = await createCharge(chargeBody);
            setFeedback({ message: `${chargeresponse.status}`, type: 'info' });
            if( chargeresponse.status == "DECLINED" || chargeresponse.status == "CANCELLED"){
              const salesBody = {
                Line: getLine(lineItems),
                CustomerRef: cutomerReference(customer),
                TxnDate: getTxnDate(),
                BillAddr: formatAddress(billing),
                ShipAddr: formatAddress(address),
                CustomField: getCustomFields(invoice),
                DocNumber: `FP${invoiceID}`,
                PaymentMethodRef: {
                  value: method_ref,
                  name: 'Visa',
                },
                TxnSource: 'IntuitPayment',
                BillEmail: cardData.email,
              };
              console.log("Sales Body: ", salesBody)
              setFeedback({ message: `Charge was ${chargeresponse.status}`, type: 'error' });
            }else{
              setFeedback({ message: `Creating Sales Receipt `, type: 'info' });
              const salesBody = {
                Line: getLine(lineItems),
                CustomerRef: cutomerReference(customer),
                TxnDate: getTxnDate(),
                BillAddr: formatAddress(billing),
                ShipAddr: formatAddress(address),
                CustomField: getCustomFields(invoice),
                DocNumber: `FP${invoiceID}`,
                PaymentMethodRef: {
                  value: method_ref,
                  name: 'Visa',
                },
                TxnSource: 'IntuitPayment',
                BillEmail: cardData.email,
              };
              console.log("Sales Body: ", salesBody)
              createSalesReceipt(salesBody, invoiceID)
              setFeedback({ message: 'Payment successful! Receipt sent via email.', type: 'success' });
            }
        }else{
          throw new Error('Token creation failed. Please check card info.');
        }
      })
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setFeedback({ message: 'Payment failed. Please try again.', type: 'error' });
    }
  };

  const handleCashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cash Payment:', cashAmount);
    setFeedback({ message: 'Cash payment recorded successfully.', type: 'success' });
  };

  const handleCheckPayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Check Payment:', checkNumber);
    setFeedback({ message: 'Check payment recorded successfully.', type: 'success' });
  };

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

  return (
    <div className="p-0 bg-white  max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Take Payment </h2>
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
        <label className="absolute left-3 top-1.5 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
          Payment Type
        </label>
      </div>

      {feedback.message && (
        <p className={`mt-2 text-sm font-medium ${feedbackColor}`}>
          {feedback.message}
        </p>
      )}

      <div className="mt-4 text-gray-700 font-medium space-y-3">
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
                  className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  <option value="">MM</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <label className="absolute left-3 top-1.5 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
                  Exp Month
                </label>
              </div>

              <div className="relative w-1/2">
                <select
                  value={cardData.expiryYear}
                  onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                  className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  <option value="">YYYY</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <label className="absolute left-3 top-1.5 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
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
                isCardFormValid
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Pay  { `$${amount}` }
            </button>
          </form>
        )}

        {paymentType === 'CASH' && (
          <form onSubmit={handleCashPayment} className="flex flex-col gap-3">
            <FloatingInput
              label="Amount Received"
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={!isCashValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCashValid
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Cash Payment { `$${amount}` }
            </button>
          </form>
        )}

        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment} className="flex flex-col gap-3">
            <FloatingInput
              label="Check Number"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={!isCheckValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCheckValid
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Check Payment of { `$${amount}` }
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
