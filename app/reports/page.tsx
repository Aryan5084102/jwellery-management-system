'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function ReportsPage() {
  const transactions = useSelector((state: RootState) => state.transaction.transactions);
  const parties = useSelector((state: RootState) => state.party.parties);
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const loans = useSelector((state: RootState) => state.lending.loans);
  const bills = useSelector((state: RootState) => state.billing.bills);

  const [reportType, setReportType] = useState('ledger');

  // Calculate totals
  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.debit, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.credit, 0);
  const netCash = totalReceipts - totalPayments;

  const totalInventoryValue = stocks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalLoansGiven = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
  const totalReceivables = parties.filter(p => p.balanceType === 'receivable').reduce((sum, p) => sum + p.openingBalance, 0);
  const totalPayables = parties.filter(p => p.balanceType === 'payable').reduce((sum, p) => sum + p.openingBalance, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Reports & Summary</h2>
        
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setReportType('ledger')}
            className={`px-4 py-2 rounded font-medium ${reportType === 'ledger' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Cash Flow
          </button>
          <button
            onClick={() => setReportType('trial')}
            className={`px-4 py-2 rounded font-medium ${reportType === 'trial' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Trial Balance
          </button>
          <button
            onClick={() => setReportType('inventory')}
            className={`px-4 py-2 rounded font-medium ${reportType === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Inventory
          </button>
        </div>

        {reportType === 'ledger' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Total Receipts</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{totalReceipts.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-red-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Total Payments</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">₹{totalPayments.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Net Cash Flow</h3>
              <p className={`text-2xl font-bold mt-1 ${netCash >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{netCash.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-purple-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Total Sales (GST)</h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">₹{totalSales.toLocaleString()}</p>
            </div>
          </div>
        )}

        {reportType === 'trial' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-orange-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Total Receivables</h3>
              <p className="text-2xl font-bold text-orange-600 mt-1">₹{totalReceivables.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Total Payables</h3>
              <p className="text-2xl font-bold text-indigo-600 mt-1">₹{totalPayables.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-teal-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Loans Given</h3>
              <p className="text-2xl font-bold text-teal-600 mt-1">₹{totalLoansGiven.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 border-l-4 border-amber-500">
              <h3 className="font-semibold text-gray-600 text-sm uppercase">Net Position</h3>
              <p className={`text-2xl font-bold mt-1 ${(totalReceivables + totalLoansGiven - totalPayables) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(totalReceivables + totalLoansGiven - totalPayables).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Inventory Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm uppercase">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{stocks.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm uppercase">Total Quantity</p>
                <p className="text-2xl font-bold text-green-600">{stocks.reduce((sum, s) => sum + s.quantity, 0)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm uppercase">Inventory Value</p>
                <p className="text-2xl font-bold text-amber-600">₹{totalInventoryValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Item</th>
                    <th className="border px-4 py-2 text-left">Metal</th>
                    <th className="border px-4 py-2 text-center">Quantity</th>
                    <th className="border px-4 py-2 text-right">Price</th>
                    <th className="border px-4 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">{item.name}</td>
                      <td className="border px-4 py-2 capitalize">{item.metalType}</td>
                      <td className="border px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border px-4 py-2 text-right">₹{item.price.toLocaleString()}</td>
                      <td className="border px-4 py-2 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                  {stocks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">No items in stock</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Party-wise Ledger Summary */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Party Ledger Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Party Name</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-right">Opening Balance</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {parties.map(party => (
                  <tr key={party.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 font-medium">{party.name}</td>
                    <td className="border px-4 py-2 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        party.type === 'both' ? 'bg-purple-100 text-purple-800' :
                        party.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {party.type}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-right">₹{party.openingBalance.toLocaleString()}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        party.balanceType === 'receivable' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {party.balanceType === 'receivable' ? 'Receivable' : 'Payable'}
                      </span>
                    </td>
                  </tr>
                ))}
                {parties.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No parties added yet</td>
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

