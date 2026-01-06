"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import LeadTable from "@/components/lead-table";
import LeadForm from "@/components/lead-form";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  const [view, setView] = useState<"form" | "csv">("form");

  return (
    <div className="min-h-screen bg-white text-[#5A1FCC] px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-[#5A1FCC] mb-2">
            Qwalify Client Portal
          </p>
          <h1 className="text-4xl font-semibold mb-3">
            Service Records Workspace
          </h1>
          <p className="text-[#5A1FCC]/80 max-w-3xl">
            Review live client submissions, add quick records, or import CSVs in
            the same polished environment homeowners see on the homepage.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Left: Lead Table */}
          <Card className="border border-[#5A1FCC]/20 shadow-lg rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Client Records</h2>
                <p className="text-sm text-[#5A1FCC]/70">
                  Search, filter, and drill into jobs in one pane.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#5A1FCC]/60">
                Live view
              </span>
            </div>
            <LeadTable />
          </Card>

          {/* Right: Add Lead / CSV Import */}
          <Card className="border border-[#5A1FCC]/20 shadow-lg rounded-3xl bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {view === "form" ? "Add a Service Record" : "Upload Records"}
                </h3>
                <p className="text-sm text-[#5A1FCC]/70">
                  Capture one-off enquiries or import a batch from CSV.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-full border border-[#5A1FCC]/30 text-xs px-4 ${
                    view === "form"
                      ? "bg-[#5A1FCC] text-white border-0 shadow"
                      : "text-[#5A1FCC] bg-white"
                  }`}
                  onClick={() => setView("form")}
                >
                  Form
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-full border border-[#5A1FCC]/30 text-xs px-4 ${
                    view === "csv"
                      ? "bg-[#5A1FCC] text-white border-0 shadow"
                      : "text-[#5A1FCC] bg-white"
                  }`}
                  onClick={() => setView("csv")}
                >
                  CSV Upload
                </Button>
              </div>
            </div>

            {view === "form" ? (
              <div className="bg-[#5A1FCC]/5 rounded-2xl p-4 border border-[#5A1FCC]/20">
                <LeadForm onCreated={() => window.location.reload()} />
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#5A1FCC]/30 rounded-2xl bg-[#5A1FCC]/5">
                <p className="text-sm text-[#5A1FCC]/80 mb-3">
                  Upload a CSV file with your leads. The file must include:
                </p>
                <ul className="text-xs text-[#5A1FCC]/70 list-disc pl-5 mb-4 space-y-1">
                  <li>firstName</li>
                  <li>lastName</li>
                  <li>email</li>
                  <li>phone</li>
                  <li>source</li>
                </ul>
                <label className="block w-full text-center border border-[#5A1FCC]/30 rounded-xl py-3 text-sm font-medium text-[#5A1FCC] bg-white hover:bg-[#5A1FCC]/5 transition cursor-pointer">
                  <input type="file" accept=".csv" className="hidden" />
                  Select CSV File
                </label>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
