'use client';

import React from 'react';
import MetalRatesDisplay from '../../components/MetalRatesDisplay';

export default function MetalRatesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Live Metal Rates</h2>
          <p className="text-gray-600 mt-1">MCX and local market gold & silver rates</p>
        </div>

        {/* Live Rates Display */}
        <MetalRatesDisplay />

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Understanding the Rates</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-sm font-bold">MCX</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">MCX Rates</p>
                  <p className="text-sm text-gray-600">Multi Commodity Exchange futures prices. These are typically slightly higher than spot rates and are used for trading purposes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">Local</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Local Market Rates</p>
                  <p className="text-sm text-gray-600">Today's local jewelers market rates. These are the rates you would typically pay at local jewelry stores.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Rate Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong className="text-gray-800">Gold:</strong> Rates shown per 10 grams</p>
              <p><strong className="text-gray-800">Silver:</strong> Rates shown per kilogram</p>
              <p><strong className="text-gray-800">Auto-refresh:</strong> Rates update automatically every 60 seconds</p>
              <p><strong className="text-gray-800">Source:</strong> Data sourced from live commodity APIs (demo mode with realistic values)</p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Use these rates in the Billing section to automatically apply current market rates to your invoices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

