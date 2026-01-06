//src/components/lead-table.tsx 
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type LeadListItem = {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  score?: string;
  scoringReason?: string;
  createdTime?: string;
};

const buildQueryUrl = (search: string, status: string, score: string) =>
  `/api/leads?search=${encodeURIComponent(search)}&status=${encodeURIComponent(
    status
  )}&score=${encodeURIComponent(score)}`;

export default function LeadTable() {
  const [items, setItems] = useState<LeadListItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterScore, setFilterScore] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchInitial = async () => {
      const res = await fetch(buildQueryUrl("", "", ""));
      const data: LeadListItem[] = await res.json();
      setItems(data);
    };
    fetchInitial();
  }, []);

  const load = async () => {
    const res = await fetch(buildQueryUrl(search, filterStatus, filterScore));
    const data: LeadListItem[] = await res.json();
    setItems(data);
  };

  return (
    <div className="space-y-3 text-[#5A1FCC]">
      {/* Filters */}
      <div className="flex gap-2 items-center flex-wrap">
        <Input
          placeholder="Search name/email/phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void load();
            }
          }}
          className="max-w-sm border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
        <Input
          placeholder="Filter status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="max-w-[180px] border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
        <Input
          placeholder="Filter score"
          value={filterScore}
          onChange={(e) => setFilterScore(e.target.value)}
          className="max-w-[140px] border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
        <Button
          onClick={() => {
            void load();
          }}
          className="bg-[#5A1FCC] text-white hover:bg-[#924bff]"
        >
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="border border-[#5A1FCC]/20 rounded-lg shadow-sm overflow-hidden bg-white">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#5A1FCC]/10 sticky top-0">
            <tr className="text-left text-[#5A1FCC] font-medium">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Score</th>
              <th className="p-3 w-[250px]">Scoring Reason</th>
              <th className="p-3 text-right">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l, i) => (
              <tr
                key={l.id}
                className={`${
                  i % 2 === 0 ? "bg-[#5A1FCC]/5" : "bg-white"
                } border-t border-[#5A1FCC]/10 hover:bg-[#5A1FCC]/10 transition-colors`}
              >
                <td className="p-3 font-medium text-[#5A1FCC]">
                  <Link className="hover:underline" href={`/leads/${l.id}`}>
                    {l.firstName} {l.lastName}
                  </Link>
                </td>
                <td className="p-3 text-[#5A1FCC]/80">{l.email}</td>
                <td className="p-3 text-[#5A1FCC]/80">{l.phone}</td>
                <td className="p-3">
                  <Badge className="capitalize bg-[#5A1FCC]/10 text-[#5A1FCC]">
                    {l.source}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge
                    className="capitalize bg-[#5A1FCC]/10 text-[#5A1FCC]"
                  >
                    {l.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold bg-[#5A1FCC]/15 text-[#5A1FCC]"
                  >
                    {l.score || "-"}
                  </span>
                </td>
                <td className="p-3 text-[#5A1FCC]/70 italic">
                  {l.scoringReason || "-"}
                </td>
                <td className="p-3 text-right text-xs text-[#5A1FCC]/60">
                  {l.createdTime
                    ? new Date(l.createdTime).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-xs text-[#5A1FCC]/70">
        Showing {items.length} leads
      </div>
    </div>
  );
}
