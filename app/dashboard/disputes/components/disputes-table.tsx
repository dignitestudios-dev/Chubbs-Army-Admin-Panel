"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export type Dispute = {
  id: number;
  disputeType: "Marketplace" | "Event Refund" | "Content Ownership";
  parties: string[];
  amount?: number;
  status: "Under Review" | "Awaiting Info" | "Resolved" | "Escalated";
  createdAt: string;
  assignedTo?: string;
  summary: string;
};

interface Props {
  disputes?: Dispute[];
}

export default function DisputesTable({ disputes = [] }: Props) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const admins = useMemo(() => {
    const s = new Set<string>();
    disputes.forEach((d) => d.assignedTo && s.add(d.assignedTo));
    return Array.from(s);
  }, [disputes]);

  const filtered = disputes.filter((d) => {
    if (typeFilter !== "all" && d.disputeType !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (
      assignedFilter !== "all" &&
      (d.assignedTo || "unassigned") !== assignedFilter
    )
      return false;
    if (
      search &&
      !`${d.id} ${d.summary} ${d.parties.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <Input
          placeholder="Search by id, summary or party"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Dispute Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Marketplace">Marketplace</SelectItem>
            <SelectItem value="Event Refund">Event Refund</SelectItem>
            <SelectItem value="Content Ownership">Content Ownership</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Awaiting Info">Awaiting Info</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={assignedFilter}
          onValueChange={(v) => setAssignedFilter(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assigned" />
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
              <TableHead>Dispute ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Parties</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assigned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((d) => (
                <TableRow
                  key={d.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/disputes/${d.id}`)}
                >
                  <TableCell>#{d.id}</TableCell>
                  <TableCell>{d.disputeType}</TableCell>
                  <TableCell>
                    {d.parties.slice(0, 2).join(", ")}
                    {d.parties.length > 2 ? ` +${d.parties.length - 2}` : ""}
                  </TableCell>
                  <TableCell>
                    {d.amount ? `$${d.amount.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.status === "Resolved"
                          ? "secondary"
                          : d.status === "Escalated"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(d.createdAt)}</TableCell>
                  <TableCell>{d.assignedTo || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No disputes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
