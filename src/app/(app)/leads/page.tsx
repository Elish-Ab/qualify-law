"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import LeadTable from "@/components/lead-table";
import LeadForm from "@/components/lead-form";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  const [view, setView] = useState<"form" | "csv">("form");

  return (
    <div className="grid md:grid-cols-[1fr_400px] gap-6">
      {/* Left: Lead Table */}
      <Card className="p-4">
        <LeadTable />
      </Card>

      {/* Right: Add Lead / CSV Import */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">
            {view === "form" ? "Add a Lead" : "Upload Leads (CSV)"}
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={view === "form" ? "default" : "outline"}
              onClick={() => setView("form")}
            >
              Form
            </Button>
            <Button
              size="sm"
              variant={view === "csv" ? "default" : "outline"}
              onClick={() => setView("csv")}
            >
              CSV Upload
            </Button>
          </div>
        </div>

        {view === "form" ? (
          <LeadForm onCreated={() => window.location.reload()} />
        ) : (
          <div className="p-4 border rounded-md bg-muted/10">
            <p className="text-sm text-muted-foreground mb-2">
              Upload a CSV file with your leads. The file must include:
            </p>
            <ul className="text-xs text-muted-foreground list-disc pl-5 mb-3">
              <li>firstName</li>
              <li>lastName</li>
              <li>email</li>
              <li>phone</li>
              <li>source</li>
            </ul>
            <input type="file" accept=".csv" className="w-full" />
          </div>
        )}
      </Card>
    </div>
  );
}
