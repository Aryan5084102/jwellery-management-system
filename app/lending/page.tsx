import LendingForm from '../../components/LendingForm';
import LendingList from '../../components/LendingList';

export default function LendingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Money Lending / Gold Loans</h2>
        <LendingForm />
        <LendingList />
      </div>
    </div>
  );
}

