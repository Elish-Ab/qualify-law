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
    <div className="space-y-3">
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
          className="max-w-sm"
        />
        <Input
          placeholder="Filter status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="max-w-[180px]"
        />
        <Input
          placeholder="Filter score"
          value={filterScore}
          onChange={(e) => setFilterScore(e.target.value)}
          className="max-w-[140px]"
        />
        <Button
          onClick={() => {
            void load();
          }}
        >
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left text-gray-700 font-medium">
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
                  i % 2 === 0 ? "bg-gray-50/40" : "bg-white"
                } border-t hover:bg-blue-50/40 transition-colors`}
              >
                <td className="p-3 font-medium text-blue-700">
                  <Link className="hover:underline" href={`/leads/${l.id}`}>
                    {l.firstName} {l.lastName}
                  </Link>
                </td>
                <td className="p-3 text-gray-700">{l.email}</td>
                <td className="p-3 text-gray-700">{l.phone}</td>
                <td className="p-3">
                  <Badge
                    variant="secondary"
                    className="capitalize bg-gray-100 text-gray-700"
                  >
                    {l.source}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge
                    className={`capitalize ${
                      l.status === "Archived"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {l.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      l.score === "Hot"
                        ? "bg-red-100 text-red-700"
                        : l.score === "Warm"
                        ? "bg-amber-100 text-amber-700"
                        : l.score === "Cold"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {l.score || "-"}
                  </span>
                </td>
                <td className="p-3 text-gray-600 italic">
                  {l.scoringReason || "-"}
                </td>
                <td className="p-3 text-right text-xs text-gray-500">
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
      <div className="text-xs text-muted-foreground">
        Showing {items.length} leads
      </div>
    </div>
  );
}
