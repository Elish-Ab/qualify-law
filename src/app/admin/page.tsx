"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Flame, Thermometer, Snowflake } from "lucide-react";

type ClientRecord = {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  leadStats?: {
    total?: number;
  };
};

type LeadStats = {
  total?: number;
  hot?: number;
  warm?: number;
  cold?: number;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  // Load clients + lead stats
  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, statsRes] = await Promise.all([
          fetch("/api/admin/clients"),
          fetch("/api/admin/leads/stats"),
        ]);

        const clientsData = (await clientsRes.json()) as ClientRecord[];
        const statsData = (await statsRes.json()) as LeadStats;

        setClients(clientsData || []);
        setLeadStats(statsData || {});
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#5A1FCC]/70 animate-pulse">Loading dashboard...</p>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen flex bg-white text-[#5A1FCC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#5A1FCC] text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Qwalify Portal</h2>
        <nav className="flex flex-col space-y-3">
          <Link
            href="/admin"
            className="hover:bg-white/10 px-4 py-2 rounded-md transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings"
            className="hover:bg-white/10 px-4 py-2 rounded-md transition"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/20">
          <p className="text-sm text-white/80">{session.user?.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#5A1FCC]">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-[#5A1FCC]/20 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition text-[#5A1FCC]">
            <Users className="w-8 h-8 mb-2 text-white bg-[#5A1FCC] rounded-full p-2" />
            <h3 className="text-sm mb-2 text-[#5A1FCC]/70">Total Leads</h3>
            <p className="text-3xl font-bold">
              {leadStats?.total ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white border border-[#5A1FCC]/20 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition text-[#5A1FCC]">
            <Flame className="w-8 h-8 mb-2 text-white bg-[#5A1FCC] rounded-full p-2" />
            <h3 className="text-sm mb-2 text-[#5A1FCC]/70">Hot Leads</h3>
            <p className="text-3xl font-bold">
              {leadStats?.hot ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white border border-[#5A1FCC]/20 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition text-[#5A1FCC]">
            <Thermometer className="w-8 h-8 mb-2 text-white bg-[#5A1FCC] rounded-full p-2" />
            <h3 className="text-sm mb-2 text-[#5A1FCC]/70">Warm Leads</h3>
            <p className="text-3xl font-bold">
              {leadStats?.warm ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white border border-[#5A1FCC]/20 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition text-[#5A1FCC]">
            <Snowflake className="w-8 h-8 mb-2 text-white bg-[#5A1FCC] rounded-full p-2" />
            <h3 className="text-sm mb-2 text-[#5A1FCC]/70">Cold Leads</h3>
            <p className="text-3xl font-bold">
              {leadStats?.cold ?? 0}
            </p>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white border border-[#5A1FCC]/20 rounded-xl shadow-md overflow-hidden text-[#5A1FCC]">
          <div className="p-6 border-b border-[#5A1FCC]/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#5A1FCC]">
              Client Overview
            </h2>
            <BarChart3 className="text-[#5A1FCC] w-6 h-6" />
          </div>

          <table className="min-w-full divide-y divide-[#5A1FCC]/10">
            <thead className="bg-[#5A1FCC]/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5A1FCC]/70 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5A1FCC]/70 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5A1FCC]/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#5A1FCC]/70 uppercase tracking-wider">
                  Total Leads
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#5A1FCC]/10 text-[#5A1FCC]">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A1FCC]/80">
                    {c.contact || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A1FCC]/80">
                    {c.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    {c.leadStats?.total ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="p-6 text-center text-[#5A1FCC]/70">
              No clients found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
