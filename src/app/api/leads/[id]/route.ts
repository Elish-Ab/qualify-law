// src/app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AirtableDAL } from "@/lib/airtable"
import { notifyN8nLeadChanged } from "@/lib/n8n"

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ must await params
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lead = await AirtableDAL.getLeadById(id, session.user.clientId)
  if (!lead)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(lead)
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ must await params
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json()
  const lead = await AirtableDAL.updateLead(id, session.user.clientId, data)
  if (!lead)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  await notifyN8nLeadChanged({
    event: "updated",
    leadId: lead.id,
    clientId: session.user.clientId,
  })

  return NextResponse.json(lead)
}
