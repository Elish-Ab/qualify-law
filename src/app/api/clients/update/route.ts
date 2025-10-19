import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE!;
const CLIENTS_TABLE = "Clients";
const USERS_TABLE = "Users";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body;

  // Utility to find a record by email
  async function findRecordByEmail(table: string, field: string) {
    const formula = `LOWER({${field}}) = LOWER("${session.user.email}")`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}?filterByFormula=${encodeURIComponent(
      formula
    )}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    return res.json();
  }

  // 1️⃣ Update Users table (name)
  let userRecords = await findRecordByEmail(USERS_TABLE, "email");
  if (userRecords.records?.length) {
    const userRecordId = userRecords.records[0].id;

    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${USERS_TABLE}/${userRecordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { name: name || null },
        }),
      }
    );
  }

  // 2️⃣ Update Clients table (Contact + Email)
  let clientRecords = await findRecordByEmail(CLIENTS_TABLE, "Email");
  if (clientRecords.records?.length) {
    const clientRecordId = clientRecords.records[0].id;

    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${CLIENTS_TABLE}/${clientRecordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Contact: phone || null,
            Email: session.user.email,
          },
        }),
      }
    );
  }

  return NextResponse.json({ success: true });
}
