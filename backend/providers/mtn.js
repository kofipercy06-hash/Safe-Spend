/**
 * MTN Mobile Money (MTN MoMo Open API) integration.
 *
 * Requires these environment variables, obtained from
 * https://momodeveloper.mtn.com (Sandbox or Production):
 *   MTN_SUBSCRIPTION_KEY  - Ocp-Apim-Subscription-Key for the Collections product
 *   MTN_API_USER           - the X-Reference-Id (UUID) used when creating the API user
 *   MTN_API_KEY             - the apiKey returned when creating the API key
 *   MTN_TARGET_ENV          - "sandbox" or "mtnghana" (production), defaults to "sandbox"
 *
 * Sandbox base URL: https://sandbox.momodeveloper.mtn.com
 * Production base URL: https://proxy.momoapi.mtn.com (confirm with your MTN partnership contact)
 */

const BASE_URL =
  process.env.MTN_TARGET_ENV === "mtnghana"
    ? "https://proxy.momoapi.mtn.com"
    : "https://sandbox.momodeveloper.mtn.com";

export async function isConfigured() {
  return Boolean(
    process.env.MTN_SUBSCRIPTION_KEY && process.env.MTN_API_USER && process.env.MTN_API_KEY
  );
}

async function getAccessToken() {
  const { MTN_SUBSCRIPTION_KEY, MTN_API_USER, MTN_API_KEY } = process.env;
  const basicAuth = Buffer.from(`${MTN_API_USER}:${MTN_API_KEY}`).toString("base64");

  const res = await fetch(`${BASE_URL}/collection/token/`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`MTN token request failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getTransactionStatus(referenceId, accessToken) {
  const res = await fetch(`${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
      "X-Target-Environment": process.env.MTN_TARGET_ENV || "sandbox",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`MTN status lookup failed (${res.status}): ${body}`);
  }
  return res.json();
}

export async function fetchTransactions(referenceIds = []) {
  if (!(await isConfigured())) {
    throw new Error("MTN MoMo API not configured — set MTN_SUBSCRIPTION_KEY, MTN_API_USER, MTN_API_KEY.");
  }
  const accessToken = await getAccessToken();

  const results = [];
  for (const refId of referenceIds) {
    const status = await getTransactionStatus(refId, accessToken);
    if (status.status === "SUCCESSFUL") {
      results.push({
        date: new Date().toISOString().slice(0, 10),
        provider: "mtn",
        type: "expense",
        category: "Uncategorized",
        amount: Number(status.amount),
        note: status.payerMessage || status.payeeNote || "",
      });
    }
  }
  return results;
}
