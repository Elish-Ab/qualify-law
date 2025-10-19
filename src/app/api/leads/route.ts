// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AirtableDAL } from "@/lib/airtable";
import { notifyN8nLeadChanged } from "@/lib/n8n";

const N8N_LEAD_WEBHOOK = process.env.N8N_WEBHOOK_URL || ""; // e.g. https://n8n.yourdomain.com/webhook/lead-created

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { search, status, score } = Object.fromEntries(req.nextUrl.searchParams.entries());
  const leads = await AirtableDAL.listLeadsByClient(session.user.clientId, { search, status, score });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const lead = await AirtableDAL.createLead(session.user.clientId, data);

    // 🔔 Local system notification (optional)
    await notifyN8nLeadChanged({
      event: "created",
      leadId: lead.id,
      clientId: session.user.clientId,
    });

    // 🚀 Trigger n8n unified flow (Lead Scoring + Nurturing)
    if (N8N_LEAD_WEBHOOK) {
      await fetch(`${N8N_LEAD_WEBHOOK}/lead-intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId: lead.id, // Airtable record ID
          clientId: session.user.clientId,
        }),
      }).catch((err) => console.error("n8n webhook failed:", err));
    } else {
      console.warn("⚠️ N8N_WEBHOOK_URL not configured — skipping external scoring trigger");
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (err: any) {
    console.error("Error creating lead:", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

