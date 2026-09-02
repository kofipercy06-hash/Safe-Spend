import { JSONFilePreset } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "data", "db.json");

const defaultData = {
  transactions: [],
  budgets: [],
  providerConnections: {
    mtn: { connected: false, status: "not_requested" },
    telecel: { connected: false, status: "not_requested" },
    airteltigo: { connected: false, status: "not_requested" },
  },
};

export const db = await JSONFilePreset(file, defaultData);

export async function withDb(fn) {
  const result = await fn(db.data);
  await db.write();
  return result;
}
