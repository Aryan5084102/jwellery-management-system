'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, TransactionType, AccountType } from '../redux/transactionSlice';
import { RootState } from '../redux/store';
import { Party } from '../redux/partySlice';

function TransactionForm() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('receipt');
  const [accountType, setAccountType] = useState<AccountType>('cash');
  const [partyId, setPartyId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const dispatch = useDispatch();
  const parties = useSelector((state: RootState) => state.party.parties);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedParty = parties.find(p => p.id === parseInt(partyId));
    dispatch(addTransaction({
      id: Date.now(),
      date,
      type,
      accountType,
      partyId: partyId ? parseInt(partyId) : undefined,
      partyName: selectedParty?.name,
      accountName: accountType === 'party' && selectedParty ? selectedParty.name : accountName,
      description,
      debit: type === 'receipt' ? parseFloat(amount) : 0,
      credit: type === 'payment' ? parseFloat(amount) : 0,
      reference,
      createdAt: new Date().toISOString(),
    }));
    setDescription('');
    setAmount('');
    setReference('');
    alert('Transaction saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'receipt' ? 'bg-green-100' : 'bg-red-100'}`}>
          <svg className={`w-5 h-5 ${type === 'receipt' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Daybook Entry</h3>
          <p className="text-sm text-gray-500">Record a new transaction</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date */}
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* Transaction Type */}
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Transaction Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="w-full"
          >
            <option value="receipt">Receipt (Money In)</option>
            <option value="payment">Payment (Money Out)</option>
          </select>
        </div>

        {/* Account Type */}
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Account Type *</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            className="w-full"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="party">Party</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Party Selection */}
        {accountType === 'party' && (
          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Select Party *</label>
            <select
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              className="w-full"
            >
              <option value="">-- Select Party --</option>
              {parties.map((party: Party) => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Account Name */}
        {accountType !== 'party' && (
          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Account Name</label>
            <input
              type="text"
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {/* Amount */}
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Amount (₹) *</label>
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

        {/* Reference */}
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Reference No.</label>
          <input
            type="text"
            placeholder="Cheque/DD/UPI No."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="input-group lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
          <input
            type="text"
            placeholder="Enter description for this transaction"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
        <button 
          type="submit" 
          className={`flex items-center gap-2 px-5 py-2 rounded font-medium shadow-sm ${
            type === 'receipt' 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {type === 'receipt' ? 'Save Receipt' : 'Save Payment'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;

