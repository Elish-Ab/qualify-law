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
import { Droplets, ClipboardList, ShieldCheck } from "lucide-react";

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
  Hot: "#5A1FCC",
  Warm: "#B08BFF",
  Cold: "#E5DEFF",
};

const ACCENT = "#5A1FCC";

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
      className="min-h-screen bg-[#f8f6ff] flex flex-col items-center px-6 py-12 text-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-[color:#5A1FCC] mb-2">
            Qwalify Client Portal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight mb-3 text-slate-900">
            Service Client Dashboard
          </h1>
          <p className="text-slate-500 max-w-3xl">
            Review plumbing and HVAC requests, priority jobs, and agreement
            readiness as soon as you log in. Every card below mirrors what
            clients see in the portal.
          </p>
        </div>

        {/* KPI SECTION */}
        <div className="grid md:grid-cols-3 gap-6">
          <KpiCard
            title="Total Service Records"
            value={totalLeads}
            icon={<ClipboardList className="w-6 h-6 text-white" />}
          />
          <KpiCard
            title="Urgent Jobs"
            value={hotLeads}
            icon={<Droplets className="w-6 h-6 text-white" />}
          />
          <KpiCard
            title="Priority Ratio"
            value={`${conversion}%`}
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
          />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900 font-semibold text-lg">
                Service Priority Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500 text-sm">Syncing service data…</p>
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

          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900 font-semibold text-lg">
                Job Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusCounts}>
                    <XAxis dataKey="name" stroke="#c7c1ff" />
                    <YAxis stroke="#c7c1ff" />
                    <Tooltip />
                    <Bar dataKey="count" fill={ACCENT} radius={[6, 6, 0, 0]} />
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

function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl px-6 py-5 flex items-center justify-between"
    >
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
      <div
        className="p-3 rounded-xl bg-[color:#5A1FCC] text-white shadow-sm"
      >
        {icon}
      </div>
    </motion.div>
  );
}
