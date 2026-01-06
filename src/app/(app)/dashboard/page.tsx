"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Ship, ClipboardList, ShieldCheck } from "lucide-react";

type Lead = {
  id?: string;
  score: string;
  status: string;
  [key: string]: unknown;
};

type KpiCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
};

const COLORS = {
  Hot: "#f97316",
  Warm: "#facc15",
  Cold: "#0ea5e9",
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data: Lead[]) => setLeads(data))
      .finally(() => setLoading(false));
  }, []);

  const totalLeads = leads.length;
  const scoreCounts = ["Hot", "Warm", "Cold"].map((s) => ({
    name: s,
    value: leads.filter((l) => l.score === s).length,
  }));

  const statusCounts = [...new Set(leads.map((l) => l.status))].map((s) => ({
    name: s,
    count: leads.filter((l) => l.status === s).length,
  }));

  const hotLeads = scoreCounts.find((x) => x.name === "Hot")?.value || 0;
  const conversion = totalLeads
    ? Math.round((hotLeads / totalLeads) * 100)
    : 0;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-50 via-stone-50 to-white flex flex-col items-center px-6 py-12 text-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-600 mb-2">
            Qwalify Client Portal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            Trade Client Dashboard
          </h1>
          <p className="text-slate-600 max-w-3xl">
            Review current trade requests, priority shipments, and compliance
            readiness as soon as you log in. Every card below keeps your team
            aligned with what clients see in the portal.
          </p>
        </div>

        {/* KPI SECTION */}
        <div className="grid md:grid-cols-3 gap-6">
          <KpiCard
            title="Total Trade Records"
            value={totalLeads}
            icon={<ClipboardList className="w-6 h-6 text-slate-900" />}
            accent="from-slate-900 via-slate-800 to-amber-600"
          />
          <KpiCard
            title="High Priority Shipments"
            value={hotLeads}
            icon={<Ship className="w-6 h-6 text-amber-600" />}
            accent="from-amber-500 to-amber-600"
          />
          <KpiCard
            title="Priority Ratio"
            value={`${conversion}%`}
            icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
            accent="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border border-slate-100 shadow-lg rounded-2xl bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-900 font-semibold text-lg">
                Priority Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500 text-sm">Syncing shipment data…</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreCounts}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        label={({ name, value }) =>
                          value ? `${name} (${value})` : ""
                        }
                        dataKey="value"
                      >
                        {scoreCounts.map((entry, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={COLORS[entry.name as keyof typeof COLORS]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-lg rounded-2xl bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-900 font-semibold text-lg">
                Shipment Lifecycle Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusCounts}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#1e293b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-slate-500 text-sm mt-3">
                Total records:{" "}
                <span className="font-medium text-slate-900">{totalLeads}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  accent = "from-slate-900 to-slate-700",
}: KpiCardProps & { accent?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/95 backdrop-blur border border-slate-100 shadow-sm rounded-2xl px-6 py-5 flex items-center justify-between"
    >
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full shadow-inner bg-gradient-to-br ${accent} text-white`}
      >
        {icon}
      </div>
    </motion.div>
  );
}
