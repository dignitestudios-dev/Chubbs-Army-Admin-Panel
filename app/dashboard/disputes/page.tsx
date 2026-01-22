"use client";

import React, { useState } from "react";
import DisputesTable, { Dispute } from "./components/disputes-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>(() => [
    {
      id: 5001,
      disputeType: "Event Refund",
      parties: ["userA@example.com", "OrganizerX"],
      amount: 50.0,
      status: "Under Review",
      createdAt: "2026-01-08",
      assignedTo: "Mod A",
      summary: "Requested refund after event cancelled",
    },
    {
      id: 5002,
      disputeType: "Content Ownership",
      parties: ["creatorA", "creatorB"],
      status: "Awaiting Info",
      createdAt: "2026-01-09",
      assignedTo: undefined,
      summary: "Ownership claim for image",
    },
    {
      id: 5003,
      disputeType: "Marketplace",
      parties: ["buyer1", "seller1"],
      amount: 19.99,
      status: "Escalated",
      createdAt: "2026-01-05",
      assignedTo: "Mod B",
      summary: "Item not received",
    },
  ]);

  // handlers — stubs to be replaced with API calls
  const assign = (id: number, admin: string) =>
    setDisputes((s) =>
      s.map((d) => (d.id === id ? { ...d, assignedTo: admin } : d))
    );
  const changeStatus = (id: number, status: Dispute["status"]) =>
    setDisputes((s) => s.map((d) => (d.id === id ? { ...d, status } : d)));

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Dispute Handling</h1>
        <div className="flex items-center gap-4">
          <Badge>Moderation</Badge>
          <Button
            onClick={() => alert("Export disputes CSV - implement backend")}
          >
            Export
          </Button>
        </div>
      </div>

      <section>
        <DisputesTable disputes={disputes} />
      </section>
    </div>
  );
}
