'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addStock } from '../redux/stockSlice';
import { useRatesForInventory, useMetalRates } from '../hooks/useMetalRates';
import { calculatePurityRate } from '../lib/metalRates';

function StockForm() {
  const [name, setName] = useState('');
  const [metalType, setMetalType] = useState('gold');
  const [purity, setPurity] = useState('22k');
  const [weight, setWeight] = useState('');
  const [makingCharge, setMakingCharge] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('ring');
  const dispatch = useDispatch();
  const { rates, getChangeInfo } = useMetalRates();
  const { goldMCX, silverMCX } = useRatesForInventory();

  const goldInfo = getChangeInfo('gold');
  const silverInfo = getChangeInfo('silver');
  const goldLocal = rates.gold.local;
  const silverLocal = rates.silver.local;

  // Calculate suggested price when weight changes
  useEffect(() => {
    if (weight && parseFloat(weight) > 0) {
      const weightNum = parseFloat(weight);
      const baseRate = metalType === 'gold' ? goldLocal : silverLocal;
      const purityMultiplier = purity === '24k' ? 1 : purity === '22k' ? 0.916 : purity === '18k' ? 0.75 : 1;
      const ratePerGram = (baseRate * purityMultiplier) / (metalType === 'gold' ? 10 : 1000);
      const suggestedPrice = Math.round(weightNum * ratePerGram + (parseFloat(makingCharge) || 0));
      setPrice(suggestedPrice.toString());
    }
  }, [weight, metalType, purity, makingCharge, goldLocal, silverLocal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addStock({
      id: Date.now(),
      name,
      metalType,
      purity,
      weight: parseFloat(weight) || 0,
      makingCharge: parseFloat(makingCharge) || 0,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
    }));
    setName('');
    setMetalType('gold');
    setPurity('22k');
    setWeight('');
    setMakingCharge('');
    setPrice('');
    setQuantity('1');
    setCategory('ring');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Add Jewelry Item</h3>
          <p className="text-sm text-gray-500">Add new item to inventory</p>
        </div>
      </div>
      
      {/* Current Rates Info */}
      <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-gray-50 rounded-lg border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">Au</span>
              </div>
              <div>
                <p className="text-xs text-amber-700">Gold Rate</p>
                <p className="font-bold text-amber-900">₹{goldLocal.toLocaleString()}/10g</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ag</span>
              </div>
              <div>
                <p className="text-xs text-gray-700">Silver Rate</p>
                <p className="font-bold text-gray-900">₹{silverLocal.toLocaleString()}/kg</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <p>MCX Gold: ₹{goldMCX.toLocaleString()}</p>
            <p>MCX Silver: ₹{silverMCX.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Item Name *</label>
          <input
            type="text"
            placeholder="e.g., Gold Ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Metal Type</label>
          <select
            value={metalType}
            onChange={(e) => setMetalType(e.target.value)}
            className="w-full"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Purity</label>
          <select
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
            className="w-full"
          >
            <option value="24k">24K (99.9%)</option>
            <option value="22k">22K (91.6%)</option>
            <option value="18k">18K (75%)</option>
            <option value="14k">14K (58.3%)</option>
            <option value="925">925 Silver</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full"
          >
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bangle">Bangle</option>
            <option value="earring">Earring</option>
            <option value="pendant">Pendant</option>
            <option value="bracelet">Bracelet</option>
            <option value="chain">Chain</option>
            <option value="mangalsutra">Mangalsutra</option>
            <option value="payal">Payal</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Weight (g)</label>
          <input
            type="number"
            placeholder="0.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Making Charges (₹)</label>
          <input
            type="number"
            placeholder="0.00"
            value={makingCharge}
            onChange={(e) => setMakingCharge(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full text-right"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full text-center"
            min="1"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
        <button 
          type="submit" 
          className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Stock
        </button>
      </div>
    </form>
  );
}

export default StockForm;

