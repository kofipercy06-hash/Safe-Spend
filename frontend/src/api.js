// In local dev, Vite's proxy forwards /api to localhost:4000 (see vite.config.js),
// so BASE can just be "/api". In production (e.g. deployed on Vercel while the
// backend lives on Railway), set an environment variable VITE_API_BASE to your
// backend's full URL, e.g. https://safe-spend-production.up.railway.app/api
const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },
  addTransaction: (tx) => request("/transactions", { method: "POST", body: JSON.stringify(tx) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

  getBudgets: () => request("/budgets"),
  setBudget: (b) => request("/budgets", { method: "POST", body: JSON.stringify(b) }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: "DELETE" }),

  getSummary: (month) => request(`/summary${month ? `?month=${month}` : ""}`),

  getProviders: () => request("/providers"),
  syncProvider: (name) => request(`/providers/${name}/sync`, { method: "POST" }),
};
