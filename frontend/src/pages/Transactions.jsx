import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Transactions() {
  const [list, setList] = useState([]);
  const [provider, setProvider] = useState("");

  const load = () => api.getTransactions(provider ? { provider } : {}).then(setList);
  useEffect(() => { load(); }, [provider]);

  async function remove(id) {
    await api.deleteTransaction(id);
    load();
  }

  return (
    <div className="card">
      <h2 className="section-title">Transactions</h2>
      <label>Filter by provider</label>
      <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{ marginBottom: 12 }}>
        <option value="">All</option>
        <option value="mtn">MTN</option>
        <option value="telecel">Telecel</option>
        <option value="airteltigo">AirtelTigo</option>
        <option value="cash">Cash</option>
      </select>

      {list.length === 0 && <p className="muted">No transactions yet.</p>}

      {list.map((t) => (
        <div className="tx-row" key={t.id}>
          <div className="tx-main">
            <span className="tx-cat">{t.category} <span className={`provider-tag ${t.provider}`}>{t.provider}</span></span>
            {t.note && <span className="tx-note">{t.note}</span>}
            <span className="tx-note">{t.date}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className={`tx-amount ${t.type}`}>{t.type === "income" ? "+" : "-"}GHS {t.amount.toFixed(2)}</div>
            <button onClick={() => remove(t.id)} style={{ marginTop: 6, width: "auto", padding: "4px 10px", fontSize: "0.75rem" }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
