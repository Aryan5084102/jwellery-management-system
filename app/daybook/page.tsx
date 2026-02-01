import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';

export default function DaybookPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Daybook - Daily Transactions</h2>
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
}

