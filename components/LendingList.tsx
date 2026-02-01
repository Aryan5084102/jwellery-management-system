'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteLoan, closeLoan, Loan } from '../redux/lendingSlice';

function LendingList() {
  const loans = useSelector((state: RootState) => state.lending.loans);
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this loan?')) {
      dispatch(deleteLoan(id));
    }
  };

  const handleClose = (id: number) => {
    if (confirm('Mark this loan as closed?')) {
      dispatch(closeLoan(id));
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const closedLoans = loans.filter(l => l.status === 'closed');
  const totalActiveAmount = activeLoans.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-lg font-bold text-gray-800">Loan List</h3>
        <div className="flex gap-3 text-sm">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded border border-amber-200">
            Active: {activeLoans.length}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded border border-green-200">
            Total Active: ₹{totalActiveAmount.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Borrower</th>
              <th className="border px-4 py-2 text-left">Loan Type</th>
              <th className="border px-4 py-2 text-left">Ornament</th>
              <th className="border px-4 py-2 text-left">Purity</th>
              <th className="border px-4 py-2 text-right">Weight (g)</th>
              <th className="border px-4 py-2 text-right">Amount (₹)</th>
              <th className="border px-4 py-2 text-center">Interest</th>
              <th className="border px-4 py-2 text-center">Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan: Loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium">{loan.borrower}</td>
                <td className="border px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    loan.loanType === 'gold' ? 'bg-amber-100 text-amber-800' :
                    loan.loanType === 'silver' ? 'bg-gray-200 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {loan.loanType}
                  </span>
                </td>
                <td className="border px-4 py-2">{loan.ornamentName || '-'}</td>
                <td className="border px-4 py-2">{loan.purity}</td>
                <td className="border px-4 py-2 text-right">{loan.weight.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right font-medium">₹{loan.amount.toLocaleString()}</td>
                <td className="border px-4 py-2 text-center">{loan.interest}%</td>
                <td className="border px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  {loan.status === 'active' && (
                    <button
                      onClick={() => handleClose(loan.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">No loans recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LendingList;

