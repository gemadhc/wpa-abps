'use client';
import { useState } from 'react';

export default function PaymentApp() {
  const [paymentType, setPaymentType] = useState('');
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    email: '',
  });
  const [cashAmount, setCashAmount] = useState('');
  const [checkNumber, setCheckNumber] = useState('');

  // === Handlers ===
  const handleCardPayment = (e) => {
    e.preventDefault();
    console.log('Card Payment Submitted:', cardData);
    // TODO: implement API or logic here
  };

  const handleCashPayment = (e) => {
    e.preventDefault();
    console.log('Cash Payment:', cashAmount);
    // TODO: implement API or logic here
  };

  const handleCheckPayment = (e) => {
    e.preventDefault();
    console.log('Check Payment:', checkNumber);
    // TODO: implement API or logic here
  };

  // === Validation Helpers ===
  const isCardFormValid =
    cardData.name &&
    cardData.number &&
    cardData.expiry &&
    cardData.cvv &&
    cardData.email;

  const isCashValid = cashAmount !== '';
  const isCheckValid = checkNumber !== '';

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Take Payment</h2>

      {/* Dropdown */}
      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select payment type</option>
        <option value="CARD">CARD</option>
        <option value="CASH">CASH</option>
        <option value="CHECK">CHECK</option>
      </select>

      {/* Conditional Body */}
      <div className="mt-4 text-gray-700 font-medium space-y-3">
        {paymentType === 'CARD' && (
          <form onSubmit={handleCardPayment} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name on Card"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              maxLength={16}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-sm w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-sm w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                maxLength={4}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={!isCardFormValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCardFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Card Payment
            </button>
          </form>
        )}

        {paymentType === 'CASH' && (
          <form onSubmit={handleCashPayment} className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Amount Received"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={!isCashValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCashValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Cash Payment
            </button>
          </form>
        )}

        {paymentType === 'CHECK' && (
          <form onSubmit={handleCheckPayment} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Check Number"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={!isCheckValid}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                isCheckValid ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Check Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
