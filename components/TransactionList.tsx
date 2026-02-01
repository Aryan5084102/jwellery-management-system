'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteTransaction, Transaction } from '../redux/transactionSlice';

function TransactionList() {
  const transactions = useSelector((state: RootState) => state.transaction.transactions);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.debit, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.credit, 0);

  return (
    <div className="space-y-4">
      {/* Filter and Summary Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded text-sm w-40"
        >
          <option value="all">All Entries</option>
          <option value="receipt">Receipts Only</option>
          <option value="payment">Payments Only</option>
        </select>
        <div className="bg-green-100 px-4 py-2 rounded border border-green-200">
          <span className="font-semibold text-green-800">Total Receipts: </span>
          <span className="font-bold">₹{totalReceipts.toLocaleString()}</span>
        </div>
        <div className="bg-red-100 px-4 py-2 rounded border border-red-200">
          <span className="font-semibold text-red-800">Total Payments: </span>
          <span className="font-bold">₹{totalPayments.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Daybook Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Account</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Reference</th>
                <th className="border px-4 py-2 text-right">Debit</th>
                <th className="border px-4 py-2 text-right">Credit</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn: Transaction) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{txn.date}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      txn.type === 'receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{txn.accountName}</td>
                  <td className="border px-4 py-2">{txn.description}</td>
                  <td className="border px-4 py-2">{txn.reference}</td>
                  <td className="border px-4 py-2 text-right text-green-600 font-medium">
                    {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="border px-4 py-2 text-right text-red-600 font-medium">
                    {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(txn.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">No transactions yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;

