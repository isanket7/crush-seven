import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n";
import { useAuth } from "@/lib/auth";

const STORAGE_KEY = "agriTransactions";

type Transaction = {
  type: "income";
  category: string;
  name?: string;
  amount: number;
  date: string;
};

const incomeCategories = [
  { value: "Sale", icon: "🧺" },
  { value: "Subsidy", icon: "🏛️" },
  { value: "Other", icon: "📦" },
];

export default function IncomeSection() {
  const { t } = useI18n();
  const { canAccessFinance } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as any[]) : [];
      return parsed.filter((p) => p.type === "income");
    } catch {
      return [];
    }
  });

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // merge with any existing transactions
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as any[]) : [];
    const others = existing.filter((x) => x.type !== "income");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...others, ...transactions]));
  }, [transactions]);

  const totalIncome = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);

  function addIncome() {
    const amt = Number(amount);
    if (!category || !date || !amt || amt <= 0) return;
    setTransactions((prev) => [...prev, { type: "income", category, name: name.trim() || undefined, amount: amt, date }]);
    setCategory("");
    setName("");
    setAmount("");
    setDate("");
  }

  const invalid = !category || !date || !Number(amount) || Number(amount) <= 0;

  return (
    <section className="relative overflow-hidden border-t border-emerald-100/40 bg-gradient-to-br from-white via-emerald-50/40 to-white py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(42%_60%_at_20%_20%,rgba(16,185,129,0.12),transparent)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-[-45%] -z-10 h-[420px] rounded-full bg-emerald-100/30 blur-3xl" aria-hidden />

      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100/70 bg-white/80 p-10 shadow-xl backdrop-blur">
          <h3 className="text-2xl font-bold tracking-tight text-emerald-900">{t.income_title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Quickly record sales, subsidies and other farm income.</p>

          {!canAccessFinance() && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {t.access_denied || "You need to be logged in to record income."}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-emerald-500">Total income</p>
                <p className="text-3xl font-extrabold text-emerald-700">₹{totalIncome.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">Synced securely to your device.</p>
              </div>

              <div className="space-y-4 rounded-2xl border border-emerald-100/60 bg-white/90 p-6 shadow-sm">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{t.category_label}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!canAccessFinance()}
                    className="mt-2 w-full rounded-xl border border-emerald-100/80 bg-white/80 px-3 py-2 text-sm shadow-inner focus:border-emerald-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{t.select_category}</option>
                    {incomeCategories.map((c) => (
                      <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{t.tx_name_label}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!canAccessFinance()}
                    className="mt-2 w-full rounded-xl border border-emerald-100/80 bg-white/80 px-3 py-2 text-sm shadow-inner focus:border-emerald-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{t.amount_label}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!canAccessFinance()}
                    className="mt-2 w-full rounded-xl border border-emerald-100/80 bg-white/80 px-3 py-2 text-sm shadow-inner focus:border-emerald-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{t.date_label}</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!canAccessFinance()}
                    className="mt-2 w-full rounded-xl border border-emerald-100/80 bg-white/80 px-3 py-2 text-sm shadow-inner focus:border-emerald-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <Button
                  onClick={addIncome}
                  disabled={invalid || !canAccessFinance()}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-lg transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
                >
                  {t.record_button}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100/80 bg-white/85 p-6 shadow-sm">
              <h4 className="flex items-center justify-between text-sm font-semibold text-emerald-900">
                {t.incomes}
                <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-700">
                  {transactions.length}
                </span>
              </h4>
              <div className="mt-4 space-y-3">
                {transactions.length === 0 && (
                  <div className="rounded-xl border border-dashed border-emerald-200/80 bg-emerald-50/40 px-4 py-6 text-center text-sm text-muted-foreground">
                    {t.no_income ?? "No income yet."}
                  </div>
                )}
                {transactions
                  .slice()
                  .reverse()
                  .map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-emerald-100/70 bg-gradient-to-r from-white via-emerald-50/40 to-white px-4 py-3 text-sm shadow-sm"
                    >
                      <span className="flex items-center gap-2 text-emerald-900">
                        <span className="text-lg">{incomeCategories.find((c) => c.value === t.category)?.icon}</span>
                        <span>
                          <span className="font-semibold">{t.category}</span>
                          {t.name ? ` · ${t.name}` : ""}
                          <span className="block text-xs text-muted-foreground">{t.date}</span>
                        </span>
                      </span>
                      <span className={cn("text-sm font-semibold text-emerald-600")}>+₹{t.amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
