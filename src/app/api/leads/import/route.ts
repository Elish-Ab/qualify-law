import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AirtableDAL } from "@/lib/airtable"

type CsvLead = Record<string, string | undefined>

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items: CsvLead[] = await req.json()
  const created = []
  for (const i of items) {
    const lead = await AirtableDAL.createLead(session.user.clientId, {
      firstName: i.firstName || i.FirstName || i["First Name"],
      lastName: i.lastName || i.LastName || i["Last Name"],
      email: i.email || i.Email,
      phone: i.phone || i.Phone,
      message: i.message || i.Message,
      source: "CSV Import",
      status: "Unqualified(new)",
    })
    created.push(lead)
  }
  return NextResponse.json({ created: created.length })
}
