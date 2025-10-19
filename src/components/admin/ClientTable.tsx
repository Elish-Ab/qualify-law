"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type ClientRow = {
  id: string;
  name: string;
  contact?: string | null;
  email?: string | null;
  leadCount: number;
  hot: number;
  warm: number;
  cold: number;
};

export default function ClientTable({
  clients,
  onSelect,
  selectedId,
}: {
  clients: ClientRow[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      [c.name, c.contact ?? "", c.email ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [q, clients]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-semibold">Clients</h3>
        <Input
          placeholder="Search client/contact/email…"
          className="max-w-xs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="text-left p-2">Client</th>
              <th className="text-left p-2">Contact</th>
              <th className="text-left p-2">Email</th>
              <th className="text-right p-2 w-[120px]">Leads</th>
              <th className="text-right p-2 w-[220px]">Score Mix</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const isActive = selectedId === c.id;
              return (
                <tr
                  key={c.id}
                  className={
                    "border-t hover:bg-accent/50 cursor-pointer " +
                    (isActive ? "bg-accent/70" : "")
                  }
                  onClick={() => onSelect(c.id)}
                >
                  <td className="p-2 font-medium">{c.name}</td>
                  <td className="p-2">{c.contact || "—"}</td>
                  <td className="p-2">{c.email || "—"}</td>
                  <td className="p-2 text-right">{c.leadCount}</td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        Hot {c.hot}
                      </Badge>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Warm {c.warm}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Cold {c.cold}
                      </Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={5}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
