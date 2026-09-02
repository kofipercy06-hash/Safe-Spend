import { Router } from "express";
import { withDb } from "../db.js";
import * as mtn from "../providers/mtn.js";
import * as telecel from "../providers/telecel.js";
import * as airteltigo from "../providers/airteltigo.js";

const router = Router();
const modules = { mtn, telecel, airteltigo };

router.get("/", async (req, res) => {
  const connections = await withDb((data) => data.providerConnections);
  const status = {};
  for (const key of Object.keys(modules)) {
    status[key] = { ...connections[key], apiConfigured: await modules[key].isConfigured() };
  }
  res.json(status);
});

router.post("/:name/sync", async (req, res) => {
  const mod = modules[req.params.name];
  if (!mod) return res.status(404).json({ error: "unknown provider" });
  try {
    const configured = await mod.isConfigured();
    if (!configured) {
      return res.status(409).json({
        error: `${req.params.name} is not yet approved/configured. Set the required API credentials as environment variables once the network approves API access.`,
      });
    }
    const txs = await mod.fetchTransactions();
    res.json({ synced: txs.length, transactions: txs });
  } catch (err) {
    res.status(501).json({ error: err.message });
  }
});

export default router;
