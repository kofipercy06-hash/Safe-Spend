/**
 * Telecel Cash integration.
 *
 * STATUS: STUB. Telecel Ghana does not currently publish a fully open
 * self-service developer portal the way MTN does; API access is typically
 * arranged directly with Telecel as a business/merchant integration.
 *
 * Once you have an agreement and credentials, set them via env vars
 * (e.g. TELECEL_CLIENT_ID, TELECEL_CLIENT_SECRET, TELECEL_API_BASE) and
 * implement fetchTransactions() below to map results into this app's
 * transaction shape: { date, provider: 'telecel', type, category, amount, note }
 */

export async function isConfigured() {
  return Boolean(process.env.TELECEL_CLIENT_ID && process.env.TELECEL_CLIENT_SECRET);
}

export async function fetchTransactions() {
  throw new Error(
    "Telecel Cash API not yet connected. Arrange API access with Telecel, set credentials, then implement fetchTransactions()."
  );
}
