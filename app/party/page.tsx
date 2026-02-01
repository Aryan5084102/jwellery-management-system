import PartyForm from '../../components/PartyForm';
import PartyList from '../../components/PartyList';

export default function PartyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Party/Customer Management</h2>
        <PartyForm />
        <PartyList />
      </div>
    </div>
  );
}

