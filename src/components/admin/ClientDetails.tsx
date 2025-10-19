"use client";

import { Card } from "@/components/ui/card";
import LeadSummaryCard from "./LeadSummaryCard";
import {
  Mail,
  Phone,
  Users,
  Flame,
  ThermometerSun,
  Snowflake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ClientUser = { id: string; name: string; email: string };

export type MiniLead = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  score?: "Hot" | "Warm" | "Cold" | null;
  status?: string | null;
  createdTime?: string | null;
};

export type ClientDetailsData = {
  id: string;
  name: string;
  contact?: string | null;
  email?: string | null;
  phone?: string | null;
  totals?: { all: number; hot: number; warm: number; cold: number } | null;
  users?: ClientUser[];
  recentLeads?: MiniLead[];
};

export default function ClientDetails({
  data,
}: {
  data?: ClientDetailsData | null;
}) {
  // ✅ Handle case where data itself is missing
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-gray-500">
        No client data available.
      </div>
    );
  }

  // ✅ Safely extract and fallback to default values
  const totals = data.totals || { all: 0, hot: 0, warm: 0, cold: 0 };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER CARD */}
      <Card className="p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {data.name || "Unnamed Client"}
            </h3>
            <div className="mt-2 text-sm text-gray-600 space-x-3 flex flex-wrap gap-2">
              {data.contact && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  {data.contact}
                </span>
              )}
              {data.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4 text-blue-500" />
                  {data.email}
                </span>
              )}
              {data.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-4 w-4 text-blue-500" />
                  {data.phone}
                </span>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-xs text-gray-500">
            Client ID: {data.id || "—"}
          </Badge>
        </div>
      </Card>

      {/* TOTAL LEAD SUMMARY */}
      <Card className="p-5 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LeadSummaryCard
            label="Total Leads"
            value={totals.all ?? 0}
            tone="neutral"
          />
          <LeadSummaryCard
            label="Hot"
            value={totals.hot ?? 0}
            tone="hot"
            icon={<Flame className="w-4 h-4 text-red-500" />}
          />
          <LeadSummaryCard
            label="Warm"
            value={totals.warm ?? 0}
            tone="warm"
            icon={<ThermometerSun className="w-4 h-4 text-amber-500" />}
          />
          <LeadSummaryCard
            label="Cold"
            value={totals.cold ?? 0}
            tone="cold"
            icon={<Snowflake className="w-4 h-4 text-blue-400" />}
          />
        </div>
      </Card>

      {/* USERS */}
      <Card className="p-5 border border-gray-100 shadow-sm">
        <div className="mb-3 font-semibold text-gray-800 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          Users
        </div>
        {data.users && data.users.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {data.users.map((u) => (
              <li
                key={u.id}
                className="py-2 flex justify-between text-sm text-gray-700"
              >
                <span className="font-medium">{u.name}</span>
                <span className="text-gray-500">{u.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500 italic">
            No users on this account.
          </div>
        )}
      </Card>

      {/* RECENT LEADS */}
      <Card className="p-5 border border-gray-100 shadow-sm">
        <div className="mb-3 font-semibold text-gray-800 flex items-center gap-2">
          <Flame className="h-4 w-4 text-red-500" />
          Recent Leads
        </div>
        {data.recentLeads && data.recentLeads.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-right p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-2">
                      {[l.firstName, l.lastName].filter(Boolean).join(" ") ||
                        "—"}
                    </td>
                    <td className="p-2">{l.email || "—"}</td>
                    <td className="p-2">
                      {l.score ? (
                        <Badge
                          className={
                            l.score === "Hot"
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : l.score === "Warm"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          }
                        >
                          {l.score}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2">{l.status || "—"}</td>
                    <td className="p-2 text-right text-gray-500">
                      {l.createdTime
                        ? new Date(l.createdTime).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No recent leads.</div>
        )}
      </Card>
    </div>
  );
}
