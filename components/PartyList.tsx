'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteParty, Party } from '../redux/partySlice';

function PartyList() {
  const parties = useSelector((state: RootState) => state.party.parties);
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this party?')) {
      dispatch(deleteParty(id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Party List</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">GSTIN</th>
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">Opening Balance</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party: Party) => (
              <tr key={party.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium">{party.name}</td>
                <td className="border px-4 py-2">{party.phone || '-'}</td>
                <td className="border px-4 py-2 uppercase">{party.gstin || '-'}</td>
                <td className="border px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    party.type === 'both' ? 'bg-purple-100 text-purple-800' :
                    party.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {party.type}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  ₹{party.openingBalance.toLocaleString()} 
                  <span className={`ml-1 text-xs ${party.balanceType === 'receivable' ? 'text-red-600' : 'text-green-600'}`}>
                    ({party.balanceType === 'receivable' ? 'Receivable' : 'Payable'})
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(party.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {parties.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No parties added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PartyList;

