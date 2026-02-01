'use client';

import { useSelector } from 'react-redux';
import Header from '../components/Header';
import MetalRatesWidget from '../components/MetalRatesWidget';
import { RootState } from '../redux/store';

export default function Home() {
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const loans = useSelector((state: RootState) => state.lending.loans);
  const bills = useSelector((state: RootState) => state.billing.bills);
  const parties = useSelector((state: RootState) => state.party.parties);
  const transactions = useSelector((state: RootState) => state.transaction.transactions);

  // Calculate totals
  const totalReceipts = transactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.debit, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.credit, 0);
  const totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
  const inventoryValue = stocks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const loansGiven = loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.amount, 0);
  const totalReceivables = parties.filter(p => p.balanceType === 'receivable').reduce((sum, p) => sum + p.openingBalance, 0);
  const totalPayables = parties.filter(p => p.balanceType === 'payable').reduce((sum, p) => sum + p.openingBalance, 0);
  const netCashFlow = totalReceipts - totalPayments;
  const outstanding = totalReceivables - totalPayables;

  const goldItems = stocks.filter(s => s.metalType === 'gold').length;
  const silverItems = stocks.filter(s => s.metalType === 'silver').length;
  const totalWeight = stocks.reduce((sum, s) => sum + (s.weight * s.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Financial Dashboard</h2>
          <p className="text-gray-600 mt-1">Overview of your jewellery business</p>
        </div>

        {/* Live Metal Rates Widget */}
        <div className="mb-6">
          <MetalRatesWidget />
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 border-l-4 border-green-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalSales.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{bills.length} invoices</p>
          </div>

          {/* Cash In Hand Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 border-l-4 border-blue-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cash In Hand</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalReceipts.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total receipts</p>
          </div>

          {/* Inventory Value Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 border-l-4 border-amber-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{inventoryValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stocks.length} items</p>
          </div>

          {/* Outstanding Card */}
          <div className={`bg-white rounded-lg shadow border border-gray-200 border-l-4 ${outstanding >= 0 ? 'border-red-500' : 'border-green-500'} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Outstanding</p>
                <p className={`text-2xl font-bold mt-1 ${outstanding >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(outstanding).toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${outstanding >= 0 ? 'bg-red-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${outstanding >= 0 ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{outstanding >= 0 ? 'Receivables' : 'Payables'}</p>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Receipts */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Total Receipts</h3>
                <p className="text-xl font-bold text-green-700">₹{totalReceipts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total Payments */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Total Payments</h3>
                <p className="text-xl font-bold text-red-700">₹{totalPayments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Net Cash Flow */}
          <div className={`rounded-lg p-4 border ${netCashFlow >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${netCashFlow >= 0 ? 'bg-blue-500' : 'bg-yellow-500'} rounded-lg flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold ${netCashFlow >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>Net Cash Flow</h3>
                <p className={`text-xl font-bold ${netCashFlow >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>₹{netCashFlow.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Counts */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded shadow border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-600">{stocks.length}</h3>
            <p className="text-sm text-gray-600">Stock Items</p>
          </div>

          <div className="bg-white rounded shadow border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-600">{goldItems}</h3>
            <p className="text-sm text-gray-600">Gold Items</p>
          </div>

          <div className="bg-white rounded shadow border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600">{silverItems}</h3>
            <p className="text-sm text-gray-600">Silver Items</p>
          </div>

          <div className="bg-white rounded shadow border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-purple-600">{parties.length}</h3>
            <p className="text-sm text-gray-600">Parties</p>
          </div>

          <div className="bg-white rounded shadow border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-600">₹{loansGiven.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Active Loans</p>
          </div>
        </div>
      </div>
    </div>
  );
}

