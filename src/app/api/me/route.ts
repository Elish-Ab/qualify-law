// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import { AirtableDAL } from "@/lib/airtable"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { name, email, password, clientName } = await req.json()
  if (!name || !email || !password || !clientName) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const existing = await AirtableDAL.getUserByEmail(email)
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 })

  const client = await AirtableDAL.createClient({ name: clientName, email })
  const passwordHash = await bcrypt.hash(password, 10)
  await AirtableDAL.createUser({ name, email, passwordHash, clientId: client.id, clientName: client.name })

  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ ok: true }) // health-check
}
