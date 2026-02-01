'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteBill, Bill } from '../redux/billingSlice';

function BillingList() {
  const bills = useSelector((state: RootState) => state.billing.bills);
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      dispatch(deleteBill(id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Invoice List</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Invoice #</th>
              <th className="border px-4 py-2 text-left">Customer</th>
              <th className="border px-4 py-2 text-left">GSTIN</th>
              <th className="border px-4 py-2 text-left">Items</th>
              <th className="border px-4 py-2 text-right">Subtotal</th>
              <th className="border px-4 py-2 text-right">GST</th>
              <th className="border px-4 py-2 text-right">Total</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill: Bill) => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2 font-medium">INV-{bill.id.toString().slice(-6)}</td>
                <td className="border px-4 py-2">{bill.customer}</td>
                <td className="border px-4 py-2 uppercase">{bill.customerGstin || '-'}</td>
                <td className="border px-4 py-2 text-sm">{bill.items}</td>
                <td className="border px-4 py-2 text-right">₹{bill.subtotal.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right">₹{bill.totalGst.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right font-bold">₹{bill.total.toFixed(2)}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">No bills generated yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillingList;

