'use client';

import React, { useState } from 'react';
import TransactionList from '../../components/TransactionList';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function CashbookPage() {
  const transactions = useSelector((state: RootState) => state.transaction.transactions);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const cashTransactions = transactions.filter(t => 
    t.accountType === 'cash' && 
    (t.date >= startDate || !startDate) &&
    (t.date <= endDate || !endDate)
  );

  const totalIn = cashTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.debit, 0);
  const totalOut = cashTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.credit, 0);
  const balance = totalIn - totalOut;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Cash Book</h2>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800">Total Cash In</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalIn.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800">Total Cash Out</h3>
            <p className="text-2xl font-bold text-red-600">₹{totalOut.toLocaleString()}</p>
          </div>
          <div className={`rounded-lg p-4 border ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <h3 className={`font-semibold ${balance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>Cash Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>₹{balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Cash Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">Description</th>
                  <th className="border px-4 py-2 text-left">Reference</th>
                  <th className="border px-4 py-2 text-right">Debit</th>
                  <th className="border px-4 py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody>
                {cashTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{txn.date}</td>
                    <td className="border px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        txn.type === 'receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{txn.description || txn.accountName}</td>
                    <td className="border px-4 py-2">{txn.reference}</td>
                    <td className="border px-4 py-2 text-right text-green-600 font-medium">
                      {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : '-'}
                    </td>
                    <td className="border px-4 py-2 text-right text-red-600 font-medium">
                      {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
                {cashTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No cash transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

