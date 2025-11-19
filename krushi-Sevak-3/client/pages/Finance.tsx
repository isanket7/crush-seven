import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/site/i18n";

type TxType = "income" | "expense";

type Transaction = {
  type: TxType;
  category: string;
  name?: string;
  amount: number;
  date: string; // ISO
};

const STORAGE_KEY = "agriTransactions";

const expenseCategories = [
  { value: "Pesticides", icon: "🧪" },
  { value: "Fertiliser", icon: "🌾" },
  { value: "Seeds", icon: "🌱" },
  { value: "Water", icon: "💧" },
  { value: "Electricity", icon: "⚡" },
  { value: "Other", icon: "📦" },
];

const incomeCategories = [
  { value: "Sale", icon: "🧺" },
  { value: "Subsidy", icon: "🏛️" },
  { value: "Other", icon: "📦" },
];

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Transaction[]) : [];
    } catch {
      return [];
    }
  });

  const [tab, setTab] = useState<TxType>("expense");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>(""); // used for expense only
  const [rate, setRate] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const { totalIncome, totalExpenses, profit } = useMemo(() => {
    let income = 0;
    let exp = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else exp += t.amount;
    }
    return { totalIncome: income, totalExpenses: exp, profit: income - exp };
  }, [transactions]);

  const expenseCategoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    }
    return map;
  }, [transactions]);

  const computedIncome = useMemo(() => {
    const r = Number(rate);
    const q = Number(qty);
    if (!r || !q || r <= 0 || q <= 0) return 0;
    return r * q;
  }, [rate, qty]);

  function clearForm() {
    setCategory("");
    setName("");
    setAmount("");
    setRate("");
    setQty("");
    setDate("");
  }

  function addTx() {
    if (!category || !date) return;
    let amt = 0;
    if (tab === "income") {
      amt = computedIncome;
      if (!amt || amt <= 0) return;
    } else {
      const a = Number(amount);
      if (!a || a <= 0) return;
      amt = a;
    }
    const tx: Transaction = { type: tab, category, name: name.trim() || undefined, amount: amt, date };
    setTransactions((prev) => [...prev, tx]);
    clearForm();
  }

  const invalid = useMemo(() => {
    if (tab === "income") {
      return !category || !date || !Number(rate) || Number(rate) <= 0 || !Number(qty) || Number(qty) <= 0;
    }
    return !category || !date || !Number(amount) || Number(amount) <= 0;
  }, [tab, category, date, rate, qty, amount]);

  const { t } = useI18n();
  const currentCategories = tab === "income" ? incomeCategories : expenseCategories;
  const allCategories = [...expenseCategories, ...incomeCategories];

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t.finance_title}</h1>

      {/* Summary Card */}
      <div className="rounded-xl bg-emerald-50 border p-6 mb-6">
        <h2 className="text-sm font-semibold text-emerald-900">{t.total_profit}</h2>
        <div className={cn("text-3xl font-extrabold mt-1", profit >= 0 ? "text-emerald-600" : "text-red-600")}>₹{profit.toLocaleString()}</div>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div className="text-red-600">{t.expenses_label}: <span id="totalExpenses">₹{totalExpenses.toLocaleString()}</span></div>
          <div className="text-emerald-600 text-right">{t.income_label}: <span id="totalIncome">₹{totalIncome.toLocaleString()}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button onClick={() => { setTab("expense"); clearForm(); }} className={cn("flex-1 py-2 font-semibold", tab === "expense" ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>{t.expense_tab}</button>
        <button onClick={() => { setTab("income"); clearForm(); }} className={cn("flex-1 py-2 font-semibold", tab === "income" ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>{t.income_tab}</button>
      </div>

      {/* Form */}
      <div className="grid gap-3 sm:max-w-md">
        <div>
          <label className="text-sm">{t.category_label}</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm">
            <option value="">{t.select_category}</option>
            {currentCategories.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">{t.tx_name_label}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
        </div>
        {tab === "income" ? (
          <>
            <div>
              <label className="text-sm">{t.rate_label}</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
            </div>
            <div>
              <label className="text-sm">{t.qty_label}</label>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
            </div>
            <div className="text-sm text-muted-foreground">{t.calculated_label}: <span className="font-semibold text-emerald-700">₹{computedIncome.toLocaleString()}</span></div>
          </>
        ) : (
          <div>
            <label className="text-sm">{t.amount_label}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
          </div>
        )}
        <div>
          <label className="text-sm">{t.date_label}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
        </div>
        <Button onClick={addTx} disabled={invalid}>{t.record_button}</Button>
      </div>

      {/* Transactions */}
      <div className="mt-8">
        <h3 className="font-semibold mb-3">{t.transactions_title}</h3>
        <div className="space-y-2">
          {transactions.length === 0 && (
            <div className="text-sm text-muted-foreground">{t.no_transactions}</div>
          )}
          {transactions.slice().reverse().map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
              <span>
                <span className="mr-2">{allCategories.find((c) => c.value === t.category)?.icon}</span>
                {t.category}{t.name ? ` - ${t.name}` : ""} ({t.date})
              </span>
              <span className={cn("font-medium", t.type === "income" ? "text-emerald-600" : "text-red-600")}>{t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-10">
        <h3 className="font-semibold mb-3">{t.expenses_by_category}</h3>
        <CategoryBarChart data={expenseCategoryTotals} />
        <div className="mt-2 grid grid-cols-6 text-center text-xl">{expenseCategories.map(c => <span key={c.value}>{c.icon}</span>)}</div>
      </div>
    </main>
  );
}

function CategoryBarChart({ data }: { data: Map<string, number> }) {
  const entries = Array.from(data.entries());
  const max = entries.reduce((m, [, v]) => Math.max(m, v), 0) || 1;
  return (
    <div className="rounded-md border bg-white p-4">
      {entries.length === 0 && <div className="text-sm text-muted-foreground">No expense data yet.</div>}
      <div className="space-y-3">
        {entries.map(([label, value]) => (
          <div key={label} className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-3 text-xs md:text-sm text-muted-foreground">{label}</div>
            <div className="col-span-9">
              <div className="h-4 rounded-md bg-muted">
                <div
                  className="h-4 rounded-md bg-gradient-to-r from-emerald-500 to-lime-500"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
