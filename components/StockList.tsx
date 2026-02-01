'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteStock, StockItem } from '../redux/stockSlice';

function StockList() {
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteStock(id));
    }
  };

  const totalValue = stocks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = stocks.reduce((sum, item) => sum + item.quantity, 0);
  const goldItems = stocks.filter(item => item.metalType === 'gold').length;
  const silverItems = stocks.filter(item => item.metalType === 'silver').length;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-lg font-bold text-gray-800">Stock List</h3>
        <div className="flex gap-4 text-sm">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded border border-amber-200">
            Items: {totalItems}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded border border-green-200">
            Value: ₹{totalValue.toLocaleString()}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded border border-yellow-200">
            Gold: {goldItems}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded border border-gray-200">
            Silver: {silverItems}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Item Name</th>
              <th className="border px-4 py-2 text-left">Metal</th>
              <th className="border px-4 py-2 text-left">Purity</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-right">Weight (g)</th>
              <th className="border px-4 py-2 text-right">Making Chg.</th>
              <th className="border px-4 py-2 text-right">Price</th>
              <th className="border px-4 py-2 text-center">Qty</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((item: StockItem) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium">{item.name}</td>
                <td className="border px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.metalType === 'gold' ? 'bg-amber-100 text-amber-800' :
                    item.metalType === 'silver' ? 'bg-gray-200 text-gray-800' :
                    item.metalType === 'platinum' ? 'bg-slate-200 text-slate-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.metalType}
                  </span>
                </td>
                <td className="border px-4 py-2">{item.purity}</td>
                <td className="border px-4 py-2 capitalize">{item.category}</td>
                <td className="border px-4 py-2 text-right">{item.weight.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right">₹{item.makingCharge.toLocaleString()}</td>
                <td className="border px-4 py-2 text-right font-medium">₹{item.price.toLocaleString()}</td>
                <td className="border px-4 py-2 text-center font-bold">{item.quantity}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">No items in stock</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockList;

