//s
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Flame, Thermometer, Snowflake } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [leadStats, setLeadStats] = useState<any | null>(null);
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

        const clientsData = await clientsRes.json();
        const statsData = await statsRes.json();

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Qualify Admin</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/admin" className="hover:bg-blue-800 px-4 py-2 rounded-md">
            Dashboard
          </a>
          <a href="/admin/settings" className="hover:bg-blue-800 px-4 py-2 rounded-md">
            Settings
          </a>
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-600">
          <p className="text-sm text-blue-200">{session.user?.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition">
            <Users className="text-blue-600 w-8 h-8 mb-2" />
            <h3 className="text-gray-500 text-sm mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-gray-900">
              {leadStats?.total ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition">
            <Flame className="text-red-500 w-8 h-8 mb-2" />
            <h3 className="text-gray-500 text-sm mb-2">Hot Leads</h3>
            <p className="text-3xl font-bold text-gray-900">
              {leadStats?.hot ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition">
            <Thermometer className="text-yellow-500 w-8 h-8 mb-2" />
            <h3 className="text-gray-500 text-sm mb-2">Warm Leads</h3>
            <p className="text-3xl font-bold text-gray-900">
              {leadStats?.warm ?? 0}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition">
            <Snowflake className="text-blue-400 w-8 h-8 mb-2" />
            <h3 className="text-gray-500 text-sm mb-2">Cold Leads</h3>
            <p className="text-3xl font-bold text-gray-900">
              {leadStats?.cold ?? 0}
            </p>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Client Overview
            </h2>
            <BarChart3 className="text-blue-600 w-6 h-6" />
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Leads
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.contact || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {c.leadStats?.total ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No clients found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
