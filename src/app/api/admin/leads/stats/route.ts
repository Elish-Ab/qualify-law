// src/app/api/admin/leads/stats/route.ts
import { AirtableDAL } from "@/lib/airtable";

export async function GET() {
  try {
    const leads = await AirtableDAL.listAllLeads();
    const stats = {
      total: leads.length,
      hot: leads.filter((l) => l.score === "Hot").length,
      warm: leads.filter((l) => l.score === "Warm").length,
      cold: leads.filter((l) => l.score === "Cold").length,
    };
    return Response.json(stats);
  } catch (err) {
    console.error("Failed to load lead stats:", err);
    return Response.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
