import { useEffect, useState } from "react";
import { api } from "../api.js";

const LABELS = { mtn: "MTN Mobile Money", telecel: "Telecel Cash", airteltigo: "AirtelTigo Money" };

export default function Settings() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => api.getProviders().then(setStatus);
  useEffect(() => { load(); }, []);

  async function sync(name) {
    setMessage("");
    try {
      const res = await api.syncProvider(name);
      setMessage(`${name}: synced ${res.synced} transactions.`);
    } catch (err) {
      setMessage(`${name}: ${err.message}`);
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Network providers</h2>
      <p className="muted">
        Direct API sync needs approval/credentials from each network. Once you have them, add them
        as environment variables on the backend and "Sync" starts pulling real transactions.
      </p>
      {status && Object.entries(status).map(([name, s]) => (
        <div className="tx-row" key={name}>
          <div>
            <div>{LABELS[name]}</div>
            <span className="status-pill">{s.apiConfigured ? "API configured" : "Pending network approval"}</span>
          </div>
          <button onClick={() => sync(name)} style={{ width: "auto", padding: "6px 12px" }}>Sync</button>
        </div>
      ))}
      {message && <p className="muted" style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
