// src/lib/n8n.ts
export async function notifyN8nLeadChanged(payload: { event: "created" | "updated"; leadId: string; clientId: string }) {
  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })
  } catch {
    // fail silently; don't block UX if n8n is unreachable
  }
}
