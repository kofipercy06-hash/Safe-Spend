import express from "express";
import cors from "cors";
import transactionsRouter from "./routes/transactions.js";
import budgetsRouter from "./routes/budgets.js";
import summaryRouter from "./routes/summary.js";
import providersRouter from "./routes/providers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/transactions", transactionsRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/providers", providersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Safe Spend backend running on port ${PORT}`));
