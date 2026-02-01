import { createClient } from '@supabase/supabase-js';

// For development, we'll use environment variables
// In production, these should be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Party {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
  opening_balance: number;
  balance_type: 'receivable' | 'payable';
  party_type: 'customer' | 'vendor' | 'both';
  created_at: string;
}

export interface Transaction {
  id: number;
  date: string;
  type: 'receipt' | 'payment';
  account_type: 'cash' | 'bank' | 'party' | 'expense' | 'income';
  party_id?: number;
  party_name?: string;
  account_name: string;
  description?: string;
  debit: number;
  credit: number;
  reference?: string;
  created_at: string;
}

export interface StockItem {
  id: number;
  name: string;
  hsn_code?: string;
  quantity: number;
  rate: number;
  unit?: string;
  created_at: string;
}

export interface Bill {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_gstin?: string;
  items: string;
  hsn_codes: string;
  subtotal: number;
  gst_rate: number;
  gst_amount: number;
  total: number;
  created_at: string;
}

export interface Loan {
  id: number;
  borrower_name: string;
  amount: number;
  interest_rate: number;
  date: string;
  due_date?: string;
  status: 'active' | 'settled';
  created_at: string;
}

// Local storage fallback for demo/development
const STORAGE_KEYS = {
  parties: 'munim_parties',
  transactions: 'munim_transactions',
  stocks: 'munim_stocks',
  bills: 'munim_bills',
  loans: 'munim_loans',
};

export const localDb = {
  // Parties
  getParties: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.parties);
    return data ? JSON.parse(data) : [];
  },
  saveParty: (party: Party) => {
    const parties = localDb.getParties();
    party.id = Date.now();
    party.created_at = new Date().toISOString();
    parties.push(party);
    localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify(parties));
    return party;
  },
  deleteParty: (id: number) => {
    const parties = localDb.getParties().filter((p: Party) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify(parties));
  },

  // Transactions
  getTransactions: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.transactions);
    return data ? JSON.parse(data) : [];
  },
  saveTransaction: (transaction: Transaction) => {
    const transactions = localDb.getTransactions();
    transaction.id = Date.now();
    transaction.created_at = new Date().toISOString();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
    return transaction;
  },
  deleteTransaction: (id: number) => {
    const transactions = localDb.getTransactions().filter((t: Transaction) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  },

  // Stocks
  getStocks: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.stocks);
    return data ? JSON.parse(data) : [];
  },
  saveStock: (item: StockItem) => {
    const stocks = localDb.getStocks();
    item.id = Date.now();
    item.created_at = new Date().toISOString();
    stocks.push(item);
    localStorage.setItem(STORAGE_KEYS.stocks, JSON.stringify(stocks));
    return item;
  },
  deleteStock: (id: number) => {
    const stocks = localDb.getStocks().filter((s: StockItem) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.stocks, JSON.stringify(stocks));
  },

  // Bills
  getBills: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.bills);
    return data ? JSON.parse(data) : [];
  },
  saveBill: (bill: Bill) => {
    const bills = localDb.getBills();
    bill.id = Date.now();
    bill.invoice_number = `INV-${Date.now().toString().slice(-8)}`;
    bill.created_at = new Date().toISOString();
    bills.push(bill);
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
    return bill;
  },
  deleteBill: (id: number) => {
    const bills = localDb.getBills().filter((b: Bill) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
  },

  // Loans
  getLoans: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.loans);
    return data ? JSON.parse(data) : [];
  },
  saveLoan: (loan: Loan) => {
    const loans = localDb.getLoans();
    loan.id = Date.now();
    loan.created_at = new Date().toISOString();
    loans.push(loan);
    localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
    return loan;
  },
  deleteLoan: (id: number) => {
    const loans = localDb.getLoans().filter((l: Loan) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
  },
};

// Export for use in components
export { STORAGE_KEYS };

