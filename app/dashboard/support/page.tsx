"use client";

import React, { useState } from "react";
import TicketTable, { Ticket } from "./components/ticket-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(() => [
    {
      id: 9001,
      user: "alice@example.com",
      category: "Payments",
      status: "Open",
      priority: "High",
      createdAt: "2026-01-10",
      assignedTo: "Admin A",
      subject: "Charge error",
    },
    {
      id: 9002,
      user: "bob@example.com",
      category: "Bugs",
      status: "In Progress",
      priority: "Medium",
      createdAt: "2026-01-09",
      assignedTo: "Admin B",
      subject: "UI glitch on checkout",
    },
    {
      id: 9003,
      user: "mallory@example.com",
      category: "Abuse",
      status: "Resolved",
      priority: "High",
      createdAt: "2026-01-05",
      assignedTo: undefined,
      subject: "Harassment report",
    },
  ]);

  // handlers stubbed — would call APIs in real app
  const assignAdmin = (id: number, admin: string) =>
    setTickets((s) =>
      s.map((t) => (t.id === id ? { ...t, assignedTo: admin } : t))
    );
  const changeStatus = (id: number, status: Ticket["status"]) =>
    setTickets((s) => s.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Support Ticket System</h1>
        <div className="flex items-center gap-4">
          <Badge>Support</Badge>
          <Button
            onClick={() => alert("Export tickets CSV - implement backend")}
          >
            Export
          </Button>
        </div>
      </div>

      <section>
        <TicketTable tickets={tickets} />
      </section>
    </div>
  );
}
