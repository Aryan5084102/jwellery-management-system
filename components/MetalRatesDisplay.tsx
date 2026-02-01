'use client';

import React from 'react';
import { useMetalRates } from '../hooks/useMetalRates';
import { formatRate, getChangeColor } from '../lib/metalRates';

function MetalRatesDisplay() {
  const { rates, loading, error, refreshRates, getLastUpdatedText, getChangeInfo } = useMetalRates();

  const goldInfo = getChangeInfo('gold');
  const silverInfo = getChangeInfo('silver');

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Live Metal Rates</h3>
            <p className="text-xs text-gray-500">MCX & Local Market</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-sm text-blue-600 flex items-center gap-1">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Updating...
            </span>
          )}
          <button
            onClick={refreshRates}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh rates"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gold Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">Au</span>
              </div>
              <h4 className="font-semibold text-amber-800">Gold</h4>
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(goldInfo.change)}`}>
              {goldInfo.direction === 'up' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {goldInfo.direction === 'down' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{goldInfo.change > 0 ? '+' : ''}{goldInfo.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-amber-700">MCX (per 10g)</span>
              <span className="font-bold text-amber-900">₹{rates.gold.mcx.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-amber-700">Local (per 10g)</span>
              <span className="font-bold text-amber-900">₹{rates.gold.local.toLocaleString()}</span>
            </div>
            <div className="h-px bg-amber-200 my-2"></div>
            <div className="flex justify-between items-center text-xs text-amber-600">
              <span>Change</span>
              <span>{goldInfo.changePercent > 0 ? '+' : ''}{goldInfo.changePercent}%</span>
            </div>
          </div>
        </div>

        {/* Silver Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">Ag</span>
              </div>
              <h4 className="font-semibold text-gray-800">Silver</h4>
            </div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(silverInfo.change)}`}>
              {silverInfo.direction === 'up' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {silverInfo.direction === 'down' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{silverInfo.change > 0 ? '+' : ''}{silverInfo.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">MCX (per kg)</span>
              <span className="font-bold text-gray-900">₹{rates.silver.mcx.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Local (per kg)</span>
              <span className="font-bold text-gray-900">₹{rates.silver.local.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Change</span>
              <span>{silverInfo.changePercent > 0 ? '+' : ''}{silverInfo.changePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Last updated: {getLastUpdatedText()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Source:</span>
          <span className="font-medium">{rates.source}</span>
          {rates.isMock && (
            <span className="text-amber-600">(Demo)</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetalRatesDisplay;

