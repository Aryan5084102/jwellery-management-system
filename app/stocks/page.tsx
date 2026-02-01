import Header from '../../components/Header';
import StockForm from '../../components/StockForm';
import StockList from '../../components/StockList';

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Stock Management</h2>
        <StockForm />
        <StockList />
      </div>
    </div>
  );
}

