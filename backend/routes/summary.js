import { Router } from "express";
import { withDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);

  const { transactions, budgets } = await withDb((data) => data);

  const monthTx = transactions.filter((t) => t.date.startsWith(month));

  const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const byProvider = {};
  const byCategory = {};
  for (const t of monthTx) {
    if (t.type === "expense") {
      byProvider[t.provider] = (byProvider[t.provider] || 0) + t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }

  const budgetProgress = budgets.map((b) => ({
    category: b.category,
    monthlyLimit: b.monthlyLimit,
    spent: byCategory[b.category] || 0,
    remaining: b.monthlyLimit - (byCategory[b.category] || 0),
  }));

  res.json({ month, income, expense, net: income - expense, byProvider, byCategory, budgetProgress });
});

export default router;
