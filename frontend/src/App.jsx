import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Budgets from "./pages/Budgets.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="brand-row">
          <img src="/logo.svg" alt="Safe Spend logo" className="brand-logo" />
          <div>
            <h1>Safe Spend</h1>
            <p>MTN &middot; Telecel &middot; AirtelTigo &middot; Cash</p>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <nav className="tab-bar">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? "active" : "")}>Transactions</NavLink>
        <NavLink to="/budgets" className={({ isActive }) => (isActive ? "active" : "")}>Budgets</NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>Providers</NavLink>
      </nav>
    </>
  );
}
