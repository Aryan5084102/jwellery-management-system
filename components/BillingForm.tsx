'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBill } from '../redux/billingSlice';
import { RootState } from '../redux/store';
import { Party } from '../redux/partySlice';
import { useRatesForBilling } from '../hooks/useMetalRates';

interface BillItem {
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number;
  amount: number;
  gstAmount: number;
}

function BillingForm() {
  const [customer, setCustomer] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [items, setItems] = useState<BillItem[]>([{
    description: '',
    hsn: '',
    quantity: 1,
    rate: 0,
    gstRate: 18,
    amount: 0,
    gstAmount: 0
  }]);
  const dispatch = useDispatch();
  const parties = useSelector((state: RootState) => state.party.parties);
  const { goldRate, silverRate } = useRatesForBilling();

  const handleAddItem = () => {
    setItems([...items, {
      description: '',
      hsn: '',
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      gstAmount: 0
    }]);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate' || field === 'gstRate') {
      const qty = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const rate = field === 'rate' ? Number(value) : newItems[index].rate;
      const gstRate = field === 'gstRate' ? Number(value) : newItems[index].gstRate;
      
      newItems[index].amount = qty * rate;
      newItems[index].gstAmount = newItems[index].amount * (gstRate / 100);
    }
    
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0);
  const total = subtotal + totalGst;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addBill({
      id: Date.now(),
      customer,
      customerGstin,
      items: items.map(i => i.description).join(', '),
      hsnCodes: items.map(i => i.hsn).join(', '),
      subtotal,
      gstRate: items[0]?.gstRate || 0,
      totalGst,
      total,
      createdAt: new Date().toISOString(),
    }));
    setCustomer('');
    setCustomerGstin('');
    setItems([{
      description: '',
      hsn: '',
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      gstAmount: 0
    }]);
    alert('Invoice generated successfully!');
  };

  const handlePartySelect = (partyId: string) => {
    if (partyId) {
      const party = parties.find((p: Party) => p.id === parseInt(partyId));
      if (party) {
        setCustomer(party.name);
        setCustomerGstin(party.gstin || '');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">GST Invoice / Bill</h3>
          <p className="text-sm text-gray-500">Create a new invoice with GST calculations</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Select Party (Optional)</label>
          <select
            onChange={(e) => handlePartySelect(e.target.value)}
            className="w-full"
          >
            <option value="">-- Select from saved parties --</option>
            {parties.map((party: Party) => (
              <option key={party.id} value={party.id}>{party.name} ({party.gstin || 'No GST'})</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Customer Name *</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Customer GSTIN</label>
          <input
            type="text"
            placeholder="Enter GSTIN (if applicable)"
            value={customerGstin}
            onChange={(e) => setCustomerGstin(e.target.value)}
            className="w-full uppercase"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h4 className="text-base font-semibold text-gray-800">Line Items</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Current Rates:</span>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...items];
                  newItems[0] = { ...newItems[0], rate: goldRate };
                  if (newItems[0].quantity) {
                    newItems[0].amount = newItems[0].quantity * goldRate;
                    newItems[0].gstAmount = newItems[0].amount * (newItems[0].gstRate / 100);
                  }
                  setItems(newItems);
                }}
                className="px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 font-medium"
              >
                Gold: ₹{goldRate.toLocaleString()}
              </button>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...items];
                  newItems[0] = { ...newItems[0], rate: silverRate };
                  if (newItems[0].quantity) {
                    newItems[0].amount = newItems[0].quantity * silverRate;
                    newItems[0].gstAmount = newItems[0].amount * (newItems[0].gstRate / 100);
                  }
                  setItems(newItems);
                }}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
              >
                Silver: ₹{silverRate.toLocaleString()}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">HSN/SAC</th>
                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
                <th className="border px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Rate</th>
                <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">GST %</th>
                <th className="border px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      placeholder="HSN"
                      value={item.hsn}
                      onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className="w-full text-center"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                      className="w-full text-right"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <select
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(index, 'gstRate', Number(e.target.value))}
                      className="w-full"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>
                  <td className="border px-3 py-2 text-right font-medium">
                    ₹{item.amount.toFixed(2)}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-1 text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-gray-600">
              <span>GST ({items[0]?.gstRate || 0}%):</span>
              <span className="font-medium">₹{totalGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-300 mt-2 pt-2 text-gray-900">
              <span>Total:</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          type="button" 
          className="mr-3 px-5 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Generate Invoice
        </button>
      </div>
    </form>
  );
}

export default BillingForm;

