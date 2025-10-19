"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tone = "hot" | "warm" | "cold" | "neutral";

export function toneClasses(tone: Tone) {
  switch (tone) {
    case "hot":
      return "bg-red-50 text-red-700 ring-1 ring-red-100";
    case "warm":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "cold":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    default:
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-100";
  }
}

export default function LeadSummaryCard({
  label,
  value,
  sublabel,
  tone = "neutral",
  icon,
  className,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "p-4 flex items-center justify-between shadow-sm hover:shadow transition",
        className
      )}
    >
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold leading-6">{value}</div>
        {sublabel ? (
          <div className="text-xs text-muted-foreground">{sublabel}</div>
        ) : null}
      </div>
      <div
        className={cn(
          "px-3 py-2 rounded-xl text-sm font-medium",
          toneClasses(tone)
        )}
      >
        <div className="flex items-center gap-2">
          {icon ? <span className="opacity-80">{icon}</span> : null}
          <span className="capitalize">{tone}</span>
        </div>
      </div>
    </Card>
  );
}
