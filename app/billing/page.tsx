import Header from '../../components/Header';
import BillingForm from '../../components/BillingForm';
import BillingList from '../../components/BillingList';

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Billing / GST Invoices</h2>
        <BillingForm />
        <BillingList />
      </div>
    </div>
  );
}

