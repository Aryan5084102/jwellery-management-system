'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLoan } from '../redux/lendingSlice';

function LendingForm() {
  const [borrower, setBorrower] = useState('');
  const [loanType, setLoanType] = useState('gold');
  const [ornamentName, setOrnamentName] = useState('');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('22k');
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('2');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addLoan({ 
      id: Date.now(), 
      borrower, 
      loanType,
      ornamentName,
      weight: parseFloat(weight) || 0,
      purity,
      amount: parseFloat(amount), 
      interest: parseFloat(interest) 
    }));
    setBorrower('');
    setLoanType('gold');
    setOrnamentName('');
    setWeight('');
    setPurity('22k');
    setAmount('');
    setInterest('2');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Add Loan / Gold Loan Entry</h3>
          <p className="text-sm text-gray-500">Record a new loan transaction</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Borrower Name *</label>
          <input
            type="text"
            placeholder="Enter borrower name"
            value={borrower}
            onChange={(e) => setBorrower(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Loan Type</label>
          <select
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="w-full"
          >
            <option value="gold">Gold Loan</option>
            <option value="silver">Silver Loan</option>
            <option value="cash">Cash Loan</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Ornament Name</label>
          <input
            type="text"
            placeholder="e.g., Gold Ring, Necklace"
            value={ornamentName}
            onChange={(e) => setOrnamentName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Purity</label>
          <select
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
            className="w-full"
          >
            <option value="24k">24K (99.9%)</option>
            <option value="22k">22K (91.6%)</option>
            <option value="18k">18K (75%)</option>
            <option value="925">925 Silver</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Weight (g)</label>
          <input
            type="number"
            placeholder="0.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Loan Amount (₹) *</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Interest Rate (% per month)</label>
          <input
            type="number"
            placeholder="2"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
        <button 
          type="submit" 
          className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Loan
        </button>
      </div>
    </form>
  );
}

export default LendingForm;

