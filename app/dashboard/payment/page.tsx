"use client";

import React, { useState } from "react";
import PaymentTable from "./components/payment-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PaymentPage() {
  const [transactions, setTransactions] = useState(() => [
    {
      id: 1001,
      date: "10-20-2025",
      buyer: "User A",
      vendor: "Vendor X",
      serviceType: "Product",
      serviceName: "Toys",
      amount: 49.99,
      commission: 10.0,
      status: "completed" as const,
    },
    {
      id: 1002,
      date: "11-01-2026",
      buyer: "User B",
      vendor: "Vendor Y",
      serviceType: "Event",
      serviceName: "Pet Show",
      amount: 19.5,
      commission: 5.3,
      status: "disputed" as const,
    },
    {
      id: 1003,
      date: "01-01-2026",
      buyer: "User C",
      vendor: "Vendor X",
      serviceType: "Service",
      serviceName: "Grooming",
      amount: 120.0,
      commission: 18.4,
      status: "refunded" as const,
    },
  ]);

  const refund = (id: number) =>
    setTransactions((s) =>
      s.map((t) => (t.id === id ? { ...t, status: "refunded" } : t))
    );
  const resolveDispute = (id: number) =>
    setTransactions((s) =>
      s.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );

  const [selected, setSelected] = useState<
    "transactions" | "revenue" | "refunds"
  >("transactions");

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Payment Overview</h1>
        {/* <div className="flex items-center gap-4">
          <Badge>Finance</Badge>
          <Button
            onClick={() => alert("Export transactions CSV - implement backend")}
          >
            Export
          </Button>
        </div> */}
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7">Last 7 days</SelectItem>
            <SelectItem value="last30">Last 30 days</SelectItem>
            <SelectItem value="thisMonth">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="p-4 rounded-md border mb-2">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-semibold">${3000}</p>
        </div>
        <Tabs value={selected} onValueChange={(v) => setSelected(v as any)}>
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            {/* <TabsTrigger value="refunds">Refunds & Disputes</TabsTrigger> */}
          </TabsList>
        </Tabs>
      </div>

      <section className="space-y-3">
        {selected === "transactions" && (
          <>
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <PaymentTable
              section="transactions"
              transactions={transactions}
              onRefund={refund}
              onResolveDispute={resolveDispute}
            />
          </>
        )}

        {selected === "revenue" && (
          <>
            <h2 className="text-lg font-semibold">Marketplace Revenue</h2>
            <PaymentTable section="revenue" transactions={transactions} />
          </>
        )}
        {/*
        {selected === "refunds" && (
          <>
            <h2 className="text-lg font-semibold">Refunds & Disputes</h2>
            <PaymentTable
              section="refunds"
              transactions={transactions}
              onResolveDispute={resolveDispute}
            />
          </>
        )} */}
      </section>
    </div>
  );
}
