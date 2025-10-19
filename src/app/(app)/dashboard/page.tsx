"use client";

import { useEffect, useState } from "react";
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
import { Users, Flame, TrendingUp } from "lucide-react";

const COLORS = {
  Hot: "#ef4444",
  Warm: "#f59e0b",
  Cold: "#3b82f6",
};

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data))
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
      className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] flex flex-col items-center px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight mb-10 text-gray-800">
          Lead Intelligence Overview
        </h1>

        {/* KPI SECTION */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <KpiCard
            title="Total Leads"
            value={totalLeads}
            icon={<Users className="w-6 h-6 text-blue-500" />}
          />
          <KpiCard
            title="Hot Leads"
            value={hotLeads}
            icon={<Flame className="w-6 h-6 text-red-500" />}
          />
          <KpiCard
            title="Conversion Potential"
            value={`${conversion}%`}
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-md rounded-2xl bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-800 font-semibold text-lg">
                Lead Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
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

          <Card className="border-none shadow-md rounded-2xl bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-800 font-semibold text-lg">
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusCounts}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                Total leads:{" "}
                <span className="font-medium text-gray-700">{totalLeads}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function KpiCard({ title, value, icon }: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/90 backdrop-blur border border-gray-100 shadow-sm rounded-2xl px-6 py-5 flex items-center justify-between"
    >
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-full shadow-inner">{icon}</div>
    </motion.div>
  );
}
