//src/lib/airtable.ts
import Airtable from "airtable";
import {
  LeadRecord,
  UserRecord,
  ClientRecord,
} from "./types";
import type {
  LeadSource,
  LeadStatus,
  LeadScore,
  FollowupStatus,
  EscalationStatus,
} from "./types";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const T = {
  users: process.env.AIRTABLE_USERS_TABLE!,
  clients: process.env.AIRTABLE_CLIENTS_TABLE!,
  leads: process.env.AIRTABLE_LEADS_TABLE!,
};

const pick = (o: any, keys: string[]) =>
  keys.reduce((acc, k) => {
    if (o[k] !== undefined) acc[k] = o[k];
    return acc;
  }, {} as any);

export const AirtableDAL = {

  // ---------------- ADMIN ----------------
  async listClientsWithLeadStats() {
    try {
      const clients = await base(T.clients).select().all();
      const leads = await base(T.leads).select().all();

      const grouped: Record<string, any> = {};

      for (const lead of leads) {
        const clientRefs = lead.get("Clients");
        if (!clientRefs || !Array.isArray(clientRefs)) continue;

        const status = (lead.get("Score") as string)?.toLowerCase() || "unknown";

        for (const clientId of clientRefs) {
          if (!grouped[clientId]) {
            grouped[clientId] = { hot: 0, warm: 0, cold: 0, total: 0 };
          }
          grouped[clientId].total++;
          if (status.includes("hot")) grouped[clientId].hot++;
          else if (status.includes("warm")) grouped[clientId].warm++;
          else if (status.includes("cold")) grouped[clientId].cold++;
        }
      }

      return clients.map((c) => {
        const stats = grouped[c.id] || { hot: 0, warm: 0, cold: 0, total: 0 };
        return {
          id: c.id,
          name: (c.get("Client Name") as string) || "",
          contact: (c.get("Contact") as string) || "",
          email: (c.get("Email") as string) || "",
          phone: (c.get("Phone") as string) || "",
          company: (c.get("Company") as string) || "",
          leadStats: stats,
        };
      });
    } catch (e) {
      console.error("Error fetching admin client stats:", e);
      throw new Error("Failed to fetch admin client stats");
    }
  },



    // ---------------- ADMIN: ALL LEADS ----------------
  async listAllLeads(): Promise<LeadRecord[]> {
    try {
      const recs = await base(T.leads)
        .select({
          pageSize: 100,
          sort: [{ field: "Created time", direction: "desc" }],
        })
        .all();

      console.log(`✅ Loaded ${recs.length} total leads from Airtable`);

      return recs.map((r) => {
        const rawCreated = (r as any)._rawJson?.createdTime;
        const linkedClients = r.get("Clients");
        const clientId = Array.isArray(linkedClients)
          ? linkedClients[0]
          : (linkedClients as string) || "";

        return {
          id: r.id,
          clientId,
          firstName: (r.get("First Name") as string) || "",
          lastName: (r.get("Last Name") as string) || "",
          email: (r.get("Email") as string) || "",
          phone: (r.get("Phone") as string) || "",
          message: (r.get("Message") as string) || "",
          source: (r.get("Source") as string) || "Form",
          status: (r.get("Status") as string) || "Unqualified(new)",
          score: (r.get("Score") as string) || "",
          scoringReason: (r.get("Scoring Reason") as string) || "",
          manualReview: !!r.get("Manual Review"),
          followupStatus:
            (r.get("Follow-up Status") as string) || "Not Started",
          escalationStatus:
            (r.get("Escalation Status") as string) || "Pending",
          crmSynced: !!r.get("CRM Synced"),
          createdTime: rawCreated,
        } as LeadRecord;
      });
    } catch (err) {
      console.error("❌ Error loading all leads:", err);
      throw new Error("Failed to load all leads");
    }
  },


  // ---------------- USERS ----------------
  async getUserByEmail(email: string) {
  try {
    const recs = await base(T.users)
      .select({
        filterByFormula: `{email} = '${email.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!recs[0]) return null;
    const r = recs[0];

    // ✅ directly read plain text field
    const clientId = (r.get("clientId") as string) || "";

    return {
      id: r.id,
      name: (r.get("name") as string) || "",
      email: (r.get("email") as string) || "",
      passwordHash: (r.get("password") as string) || "",
      clientId,
      clientName: (r.get("Client Name") as string) || undefined,
    };
  } catch (err) {
    console.error("Error fetching user by email:", err);
    return null;
  }
},

 async createUser(u: {
  name: string;
  email: string;
  passwordHash: string;
  clientId: string;
  clientName: string;
}): Promise<UserRecord> {
  try {
    const rec = await base(T.users).create(
      [
        {
          fields: {
            name: u.name,
            email: u.email,
            password: u.passwordHash, 
            clientId: u.clientId,  
            // ❌ Do NOT include "Client Name (from Clients)" — it's a lookup field
          },
        },
      ],
      { typecast: true }
    );

    const r = rec[0];
    return {
      id: r.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      clientId: u.clientId,
      clientName: u.clientName, // read-only, but good to include in returned object
    };
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
},

  // ---------------- CLIENTS ----------------
  async createClient(c: {
    name: string;
    contact?: string;
    email?: string;
  }): Promise<ClientRecord> {
    const rec = await base(T.clients).create(
      [
        {
          fields: {
            "Client Name": c.name,
            Contact: c.contact,
            Email: c.email,
          },
        },
      ],
      { typecast: true }
    );
    const r = rec[0];
    return { id: r.id, name: c.name, contact: c.contact, email: c.email };
  },

  async getClientById(id: string): Promise<ClientRecord | null> {
    const r = await base(T.clients).find(id).catch(() => null);
    if (!r) return null;
    return {
      id: r.id,
      name: (r.get("Client Name") as string) || "",
      contact: (r.get("Contact") as string) || "",
      email: (r.get("Email") as string) || "",
    };
  },

  // ---------------- LEADS ----------------
  async listLeadsByClient(
    clientId: string,
    opts?: { limit?: number; search?: string; status?: string; score?: string }
  ): Promise<LeadRecord[]> {
    const filters: string[] = [];

    // ✅ Proper linked record filtering
    filters.push(`FIND('${clientId}', ARRAYJOIN({Clients}))`);

    if (opts?.status) filters.push(`{Status} = '${opts.status}'`);
    if (opts?.score) filters.push(`{Score} = '${opts.score}'`);
    if (opts?.search) {
      const s = opts.search.replace(/'/g, "\\'");
      filters.push(
        `OR(FIND('${s}', {First Name})>0, FIND('${s}', {Last Name})>0, FIND('${s}', {Email})>0, FIND('${s}', {Phone})>0)`
      );
    }

    const formula = filters.length > 1 ? `AND(${filters.join(",")})` : filters[0];
    console.log("🧮 Airtable formula used for leads:", formula);

    const recs = await base(T.leads)
      .select({
        filterByFormula: formula,
        pageSize: Math.min(opts?.limit ?? 100, 100),
        sort: [{ field: "Created time", direction: "desc" }],
      })
      .firstPage();

    console.log(`✅ Found ${recs.length} leads for client ${clientId}`);
    return recs.map((r) => mapLead(r));
  },

  async getLeadById(id: string, clientId: string): Promise<LeadRecord | null> {
    const r = await base(T.leads).find(id).catch(() => null);
    if (!r) return null;

    const linkedClients = r.get("Clients");
    if (Array.isArray(linkedClients)) {
      if (!linkedClients.includes(clientId)) return null;
    } else if (linkedClients !== clientId) {
      return null;
    }

    return mapLead(r);
  },

  async createLead(clientId: string, data: Partial<LeadRecord>): Promise<LeadRecord> {
  try {
    console.log("🧩 Creating lead linked to client:", clientId);
    console.log("🧩 Normalized clientId:", Array.isArray(clientId) ? clientId : [clientId]);
    const fields = {
      Clients: Array.isArray(clientId) ? clientId : [clientId],
      "First Name": data.firstName,
      "Last Name": data.lastName,
      Email: data.email,
      Phone: data.phone,
      Message: data.message,
      Source: data.source || "Form",
      Status: data.status || "Unqualified(new)",
      Score: data.score || undefined,
      "Scoring Reason": data.scoringReason,
      "Voicemail Summary": data.voicemailSummary,
      "Recording URL": data.recordingUrl,
      "Manual Review": data.manualReview ?? false,
      "Follow-up Status": data.followupStatus || "Not Started",
      "Escalation Status": data.escalationStatus || "Pending",
      "CRM Synced": data.crmSynced ?? false,
    };

    console.log("📦 Lead fields sent to Airtable:", fields);

    const rec = await base(T.leads).create([{ fields }], { typecast: true });
    console.log("✅ Lead successfully created:", rec[0].id);

    return mapLead(rec[0]);
  } catch (err: any) {
    console.error("❌ Error creating lead:", err);
    throw new Error(`Failed to create lead: ${err?.message || "Unknown error"}`);
  }
},


  async updateLead(
    id: string,
    clientId: string,
    data: Partial<LeadRecord>
  ): Promise<LeadRecord | null> {
    const existing = await this.getLeadById(id, clientId);
    if (!existing) return null;

    const fields = pick(
      {
        "First Name": data.firstName,
        "Last Name": data.lastName,
        Email: data.email,
        Phone: data.phone,
        Message: data.message,
        Source: data.source,
        Status: data.status,
        Score: data.score,
        "Scoring Reason": data.scoringReason,
        "Voicemail Summary": data.voicemailSummary,
        "Recording URL": data.recordingUrl,
        "Manual Review": data.manualReview,
        "Follow-up Status": data.followupStatus,
        "Escalation Status": data.escalationStatus,
        "CRM Synced": data.crmSynced,
      },
      Object.keys(data || {})
    );

    const rec = await base(T.leads).update([{ id, fields }]);
    return mapLead(rec[0]);
  },
};

// ---------------- Helper ----------------
function mapLead(r: Airtable.Record<any>): LeadRecord {
  const rawCreated = (r as unknown as { _rawJson?: { createdTime?: string } })
    ._rawJson?.createdTime;

  const linkedClients = r.get("Clients");
  const clientId = Array.isArray(linkedClients)
    ? linkedClients[0]
    : (linkedClients as string) || "";

  return {
    id: r.id,
    clientId,
    firstName: (r.get("First Name") as string) || "",
    lastName: (r.get("Last Name") as string) || "",
    email: (r.get("Email") as string) || "",
    phone: (r.get("Phone") as string) || "",
    message: (r.get("Message") as string) || "",
    source: ((r.get("Source") as string) ?? "Form") as LeadSource,
    status: ((r.get("Status") as string) ?? "Unqualified(new)") as LeadStatus,
    score: (r.get("Score") as string | undefined) as LeadScore | undefined,
    scoringReason: (r.get("Scoring Reason") as string) || "",
    voicemailSummary: (r.get("Voicemail Summary") as string) || "",
    recordingUrl: (r.get("Recording URL") as string) || "",
    manualReview: !!r.get("Manual Review"),
    followupStatus: ((r.get("Follow-up Status") as string) ??
      "Not Started") as FollowupStatus,
    escalationStatus: ((r.get("Escalation Status") as string) ??
      "Pending") as EscalationStatus,
    crmSynced: !!r.get("CRM Synced"),
    createdTime: rawCreated,
  };
}


