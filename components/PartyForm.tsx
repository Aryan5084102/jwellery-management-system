'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addParty, PartyType } from '../redux/partySlice';

function PartyForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [balanceType, setBalanceType] = useState<'receivable' | 'payable'>('receivable');
  const [type, setType] = useState<PartyType>('both');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addParty({
      id: Date.now(),
      name,
      phone,
      email,
      gstin,
      address,
      openingBalance: parseFloat(openingBalance) || 0,
      balanceType,
      type,
      createdAt: new Date().toISOString(),
    }));
    setName('');
    setPhone('');
    setEmail('');
    setGstin('');
    setAddress('');
    setOpeningBalance('');
    setBalanceType('receivable');
    setType('both');
    alert('Party added successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Add Party</h3>
          <p className="text-sm text-gray-500">Add customer, vendor, or both</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Party Name *</label>
          <input
            type="text"
            placeholder="Enter party name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">GSTIN</label>
          <input
            type="text"
            placeholder="GST Registration Number"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="w-full uppercase"
          />
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Opening Balance (₹)</label>
          <input
            type="number"
            placeholder="0.00"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Balance Type</label>
          <select
            value={balanceType}
            onChange={(e) => setBalanceType(e.target.value as 'receivable' | 'payable')}
            className="w-full"
          >
            <option value="receivable">Receivable (To Receive)</option>
            <option value="payable">Payable (To Pay)</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Party Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PartyType)}
            className="w-full"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        <div className="input-group lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
          <input
            type="text"
            placeholder="Full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
        <button 
          type="submit" 
          className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Party
        </button>
      </div>
    </form>
  );
}

export default PartyForm;

