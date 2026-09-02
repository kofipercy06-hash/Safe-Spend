import { useEffect, useState } from "react";
import { api } from "../api.js";

const CATEGORIES = ["Food", "Transport", "Data/Airtime", "Rent", "School", "Savings", "Other"];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");

  const load = () => api.getBudgets().then(setBudgets);
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    if (!limit || Number(limit) <= 0) return;
    await api.setBudget({ category, monthlyLimit: Number(limit) });
    setLimit("");
    load();
  }

  async function remove(id) {
    await api.deleteBudget(id);
    load();
  }

  return (
    <>
      <div className="card">
        <h2 className="section-title">Set a monthly budget</h2>
        <form className="tx-form" onSubmit={save}>
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Monthly limit (GHS)</label>
            <input type="number" min="0" step="0.01" value={limit} onChange={(e) => setLimit(e.target.value)} />
          </div>
          <button className="primary" type="submit">Save budget</button>
        </form>
      </div>

      <div className="card">
        <h2 className="section-title">Your budgets</h2>
        {budgets.length === 0 && <p className="muted">No budgets set yet.</p>}
        {budgets.map((b) => (
          <div className="tx-row" key={b.id}>
            <span>{b.category}</span>
            <span>
              GHS {b.monthlyLimit.toFixed(2)}
              <button onClick={() => remove(b.id)} style={{ marginLeft: 10, width: "auto", padding: "4px 10px", fontSize: "0.75rem" }}>Remove</button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
