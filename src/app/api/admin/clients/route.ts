import { NextResponse } from "next/server";
import { AirtableDAL } from "@/lib/airtable";

export async function GET() {
  try {
    const clients = await AirtableDAL.listClientsWithLeadStats();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to load clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
