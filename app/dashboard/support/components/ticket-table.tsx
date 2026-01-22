"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export type Ticket = {
  id: number;
  user: string;
  category: "Payments" | "Abuse" | "Bugs";
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  assignedTo?: string;
  subject: string;
};

interface Props {
  tickets?: Ticket[];
}

export default function TicketTable({ tickets = [] }: Props) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [adminFilter, setAdminFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const admins = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => t.assignedTo && set.add(t.assignedTo));
    return Array.from(set);
  }, [tickets]);

  const filtered = tickets.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (adminFilter !== "all" && (t.assignedTo || "unassigned") !== adminFilter)
      return false;
    if (
      search &&
      !`${t.id} ${t.user} ${t.subject}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
        <Input
          placeholder="Search by id, user or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Payments">Payments</SelectItem>
            <SelectItem value="Abuse">Abuse</SelectItem>
            <SelectItem value="Bugs">Bugs</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={adminFilter} onValueChange={(v) => setAdminFilter(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assigned Admin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {admins.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assigned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((t) => (
                <TableRow
                  key={t.id}
                  onClick={() => router.push(`/dashboard/support/${t.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>#{t.id}</TableCell>
                  <TableCell>{t.user}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === "Open"
                          ? "destructive"
                          : t.status === "Resolved"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.priority === "High"
                          ? "destructive"
                          : t.priority === "Medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(t.createdAt)}</TableCell>
                  <TableCell>{t.assignedTo || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
