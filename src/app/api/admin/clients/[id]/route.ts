import { NextResponse } from "next/server";
import { AirtableDAL } from "@/lib/airtable";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const client = await AirtableDAL.getClientDetails(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (err) {
    console.error("Error fetching client:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
