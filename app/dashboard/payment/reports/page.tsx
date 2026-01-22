"use client";

import React from "react";
import ReportsDashboard from "./components/reports-dashboard";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Analytics & Reporting</h1>
        <div className="flex items-center gap-4">
          <Badge>Analytics</Badge>
        </div>
      </div>

      <ReportsDashboard />
    </div>
  );
}
