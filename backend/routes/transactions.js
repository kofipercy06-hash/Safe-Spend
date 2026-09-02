import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { withDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { month, provider, category } = req.query;
  const list = await withDb((data) => {
    return data.transactions.filter((t) => {
      if (month && !t.date.startsWith(month)) return false;
      if (provider && t.provider !== provider) return false;
      if (category && t.category !== category) return false;
      return true;
    });
  });
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  res.json(list);
});

router.post("/", async (req, res) => {
  const { date, provider, type, category, amount, note } = req.body;
  if (!date || !provider || !type || !category || amount === undefined) {
    return res.status(400).json({ error: "date, provider, type, category, amount are required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ error: "type must be 'income' or 'expense'" });
  }
  const tx = {
    id: uuidv4(),
    date,
    provider,
    type,
    category,
    amount: Number(amount),
    note: note || "",
  };
  await withDb((data) => data.transactions.push(tx));
  res.status(201).json(tx);
});

router.delete("/:id", async (req, res) => {
  const removed = await withDb((data) => {
    const idx = data.transactions.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return null;
    return data.transactions.splice(idx, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: "not found" });
  res.json(removed);
});

export default router;
