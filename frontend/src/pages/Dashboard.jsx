import { useEffect, useState } from "react";
import { api } from "../api.js";

const CATEGORIES = ["Food", "Transport", "Data/Airtime", "Rent", "School", "Savings", "Other"];
const PROVIDERS = ["mtn", "telecel", "airteltigo", "cash"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    provider: "mtn",
    type: "expense",
    category: "Food",
    amount: "",
    note: "",
  });
  const [error, setError] = useState("");

  const month = new Date().toISOString().slice(0, 7);
  const load = () => api.getSummary(month).then(setSummary);

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    try {
      await api.addTransaction({ ...form, amount: Number(form.amount) });
      setForm({ ...form, amount: "", note: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="card">
        <div className="balance-row">
          <div className="balance-item">
            <div className="label">Income (this month)</div>
            <div className="value income">GHS {summary ? summary.income.toFixed(2) : "0.00"}</div>
          </div>
          <div className="balance-item">
            <div className="label">Expense</div>
            <div className="value expense">GHS {summary ? summary.expense.toFixed(2) : "0.00"}</div>
          </div>
        </div>
      </div>

      {summary && Object.keys(summary.byProvider).length > 0 && (
        <div className="card">
          <h2 className="section-title">Spend by provider</h2>
          {Object.entries(summary.byProvider).map(([p, amt]) => (
            <div className="tx-row" key={p}>
              <span className={`provider-tag ${p}`}>{p}</span>
              <span>GHS {amt.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {summary && summary.budgetProgress.length > 0 && (
        <div className="card">
          <h2 className="section-title">Budget progress</h2>
          {summary.budgetProgress.map((b) => {
            const pct = Math.min(100, (b.spent / b.monthlyLimit) * 100 || 0);
            const over = b.spent > b.monthlyLimit;
            return (
              <div key={b.category} style={{ marginBottom: 10 }}>
                <div className="tx-row" style={{ border: "none", padding: "0 0 2px" }}>
                  <span>{b.category}</span>
                  <span className="muted">GHS {b.spent.toFixed(2)} / {b.monthlyLimit.toFixed(2)}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${over ? "over" : ""}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <h2 className="section-title">Add transaction</h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <div className="row-2">
            <div>
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label>Provider</label>
              <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="row-2">
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Amount (GHS)</label>
              <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label>Note (optional)</label>
            <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. lunch at campus" />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="primary" type="submit">Save transaction</button>
        </form>
      </div>
    </>
  );
}
