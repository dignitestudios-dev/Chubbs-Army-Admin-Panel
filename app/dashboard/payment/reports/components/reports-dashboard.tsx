"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function toCSV(rows: any[], columns: string[]) {
  const header = columns.join(",");
  const lines = rows.map((r) =>
    columns.map((c) => JSON.stringify(r[c] ?? "")).join(",")
  );
  return [header, ...lines].join("\n");
}

export default function ReportsDashboard() {
  // mock data
  const growth = [
    { date: "2026-01-01", users: 120 },
    { date: "2026-01-02", users: 150 },
    { date: "2026-01-03", users: 170 },
  ];

  const retention = { retention30: 0.42, churn30: 0.08 };
  const engagement = { dailyActive: 3400, avgSession: "6m" };

  const topPosts = [
    { id: 1, title: "How to train a dog", views: 12000, category: "Pets" },
    { id: 2, title: "Best cat toys", views: 9800, category: "Products" },
  ];

  const revenue = { marketplace: 12450.5, subscriptions: 3490.0, ads: 870.0 };

  const exportCSV = (
    rows: any[],
    columns: string[],
    filename = "report.csv"
  ) => {
    const csv = toCSV(rows, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-md border">
          <h3 className="font-semibold">Growth Trends</h3>
          <div className="mt-2 text-sm">
            Recent users: {growth[growth.length - 1].users}
          </div>
          <div className="mt-2 text-sm">
            Retention (30d): {(retention.retention30 * 100).toFixed(1)}%
          </div>
        </div>

        {/* <div className="p-4 rounded-md border">
          <h3 className="font-semibold">Engagement</h3>
          <div className="mt-2 text-sm">
            Daily Active: {engagement.dailyActive}
          </div>
          <div className="mt-2 text-sm">
            Avg Session: {engagement.avgSession}
          </div>
        </div> */}

        <div className="p-4 rounded-md border">
          <h3 className="font-semibold">Revenue</h3>
          <div className="mt-2 text-sm">
            Marketplace: ${revenue.marketplace.toFixed(2)}
          </div>
          {/* <div className="mt-2 text-sm">
            Subscriptions: ${revenue.subscriptions.toFixed(2)}
          </div> */}
          {/* <div className="mt-2 text-sm">Ads: ${revenue.ads.toFixed(2)}</div> */}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Input type="date" />
          <Input type="date" />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => exportCSV(growth, ["date", "users"], "growth.csv")}
          >
            Export CSV
          </Button>
          {/* <Button
            variant="ghost"
            onClick={() =>
              alert("Export PDF - implement backend or client PDF lib")
            }
          >
            Export PDF
          </Button> */}
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <h3 className="font-semibold">User Analytics</h3>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Retention (30d)</TableCell>
                    <TableCell>
                      {(retention.retention30 * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Churn (30d)</TableCell>
                    <TableCell>
                      {(retention.churn30 * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">Content Analytics</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPosts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.views}</TableCell>
                  <TableCell>{p.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">Revenue Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-md border">
            <div className="text-sm text-muted-foreground">
              Marketplace Revenue
            </div>
            <div className="text-xl font-semibold">
              ${revenue.marketplace.toFixed(2)}
            </div>
          </div>
          {/* <div className="p-4 rounded-md border">
            <div className="text-sm text-muted-foreground">
              Subscription Revenue
            </div>
            <div className="text-xl font-semibold">
              ${revenue.subscriptions.toFixed(2)}
            </div>
          </div> */}
          {/* <div className="p-4 rounded-md border">
            <div className="text-sm text-muted-foreground">Ad Revenue</div>
            <div className="text-xl font-semibold">
              ${revenue.ads.toFixed(2)}
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}
