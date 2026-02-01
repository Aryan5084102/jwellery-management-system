'use client';

import React, { useState } from 'react';
import { useMetalRates } from '../hooks/useMetalRates';
import { getChangeColor } from '../lib/metalRates';

function MetalRatesWidget() {
  const { rates, loading, refreshRates, getLastUpdatedText, getChangeInfo } = useMetalRates();
  const [isExpanded, setIsExpanded] = useState(false);

  const goldInfo = getChangeInfo('gold');
  const silverInfo = getChangeInfo('silver');

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Live Rates</h3>
              <p className="text-xs text-gray-500">Gold: ₹{rates.gold.local.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Live Metal Rates</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshRates}
            disabled={loading}
            className="p-1 text-gray-500 hover:text-blue-600 rounded transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
            title="Minimize"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Gold */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-amber-700">Gold</span>
            <span className={`text-xs ${getChangeColor(goldInfo.change)}`}>
              {goldInfo.change > 0 ? '↑' : goldInfo.change < 0 ? '↓' : '•'}
            </span>
          </div>
          <div className="text-lg font-bold text-amber-800">
            ₹{rates.gold.local.toLocaleString()}
          </div>
          <div className="text-xs text-amber-600">per 10g</div>
        </div>

        {/* Silver */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Silver</span>
            <span className={`text-xs ${getChangeColor(silverInfo.change)}`}>
              {silverInfo.change > 0 ? '↑' : silverInfo.change < 0 ? '↓' : '•'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-800">
            ₹{rates.silver.local.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">per kg</div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Updated: {getLastUpdatedText()}
      </div>
    </div>
  );
}

export default MetalRatesWidget;

