/**
 * AirtelTigo Money integration.
 *
 * STATUS: STUB. Access is arranged via AirtelTigo/partner aggregators
 * (e.g. Hubtel, ExpressPay) for merchant-side integrations. Direct
 * consumer transaction-history APIs are not publicly self-serve.
 *
 * Once you have credentials, set them via env vars (e.g.
 * AIRTELTIGO_API_KEY, AIRTELTIGO_API_BASE) and implement
 * fetchTransactions() to map results into this app's transaction shape:
 * { date, provider: 'airteltigo', type, category, amount, note }
 */

export async function isConfigured() {
  return Boolean(process.env.AIRTELTIGO_API_KEY);
}

export async function fetchTransactions() {
  throw new Error(
    "AirtelTigo Money API not yet connected. Arrange API access, set credentials, then implement fetchTransactions()."
  );
}
