# Safe Spend

A budgeting app for tracking money across MTN Mobile Money, Telecel Cash,
AirtelTigo Money, and cash — built so real API sync can be switched on
once each network approves API access.

The logo is two overlapping "S" letterforms in a yellow-orange/blue
gradient (`frontend/public/logo.svg`).

## What works today
- Manual transaction entry (income/expense, provider, category, amount, note)
- Category budgets with progress bars
- Monthly summary (income, expense, spend by provider/category)
- A **Providers** screen showing connection status per network, with a Sync button

## MTN integration status
`backend/providers/mtn.js` has a **real, working implementation** — it
fetches an OAuth token and checks transaction status via the MTN MoMo
Collections API. It activates automatically once you set these
environment variables on the backend (from https://momodeveloper.mtn.com):

- `MTN_SUBSCRIPTION_KEY`
- `MTN_API_USER`
- `MTN_API_KEY`
- `MTN_TARGET_ENV` (`sandbox` or `mtnghana` for production)

Important nuance: MTN's public Collections API confirms the status of a
*specific* transaction by reference ID — it is not a "download this
user's whole history" endpoint. Real automatic sync means Safe Spend
initiates or is notified of a payment, then confirms it via this API.

`telecel.js` and `airteltigo.js` are still stubs — those networks don't
offer the same kind of self-serve developer sandbox as MTN; access is
arranged directly with each network.

## Project structure
```
safe-spend/
  backend/     Express API + JSON file storage (lowdb)
  frontend/    React + Vite app (mobile-first UI)
```

## Running locally
```bash
cd backend && npm install && npm start        # http://localhost:4000
cd frontend && npm install && npm run dev     # http://localhost:5173
```

## Deploying for real

**Backend → Railway or Render**
1. Push this folder to a GitHub repo.
2. New Web Service, root directory `backend`, build `npm install`, start `npm start`.
3. Add MTN env vars once you have them.
4. Note the deployed URL, e.g. `https://safe-spend-production.up.railway.app`.

**Frontend → Vercel or Netlify**
1. New Project, root directory `frontend`, build `npm run build`, output `dist`.
2. Set environment variable `VITE_API_BASE` to your backend URL + `/api`,
   e.g. `https://safe-spend-production.up.railway.app/api`.
3. Deploy, then open the URL on your phone and "Add to Home Screen."

## Data storage note
Transactions/budgets live in `backend/data/db.json` (lowdb, no database
setup needed). For real production volume, swap this for Postgres —
the change stays contained to `db.js`.
