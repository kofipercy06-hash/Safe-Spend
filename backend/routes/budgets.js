import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { withDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const list = await withDb((data) => data.budgets);
  res.json(list);
});

router.post("/", async (req, res) => {
  const { category, monthlyLimit } = req.body;
  if (!category || monthlyLimit === undefined) {
    return res.status(400).json({ error: "category and monthlyLimit are required" });
  }
  const budget = await withDb((data) => {
    let b = data.budgets.find((b) => b.category === category);
    if (b) {
      b.monthlyLimit = Number(monthlyLimit);
    } else {
      b = { id: uuidv4(), category, monthlyLimit: Number(monthlyLimit) };
      data.budgets.push(b);
    }
    return b;
  });
  res.status(201).json(budget);
});

router.delete("/:id", async (req, res) => {
  const removed = await withDb((data) => {
    const idx = data.budgets.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return null;
    return data.budgets.splice(idx, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: "not found" });
  res.json(removed);
});

export default router;
