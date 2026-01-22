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
import { Button } from "@/components/ui/button";

export type Notification = {
  id: number;
  title: string;
  message: string;
  audience: "Global" | "All Users" | "Vendors" | "Admins";
  sentAt?: string;
  status: "Draft" | "Sent" | "Failed";
};

interface Props {
  notifications?: Notification[];
  onResend?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function NotificationsTable({
  notifications = [],
  onResend,
  onDelete,
}: Props) {
  const router = useRouter();
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = notifications.filter((n) => {
    if (audienceFilter !== "all" && n.audience !== audienceFilter) return false;
    if (statusFilter !== "all" && n.status !== statusFilter) return false;
    if (
      search &&
      !`${n.id} ${n.title} ${n.message}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <Input
          placeholder="Search by id or title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={audienceFilter}
          onValueChange={(v) => setAudienceFilter(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Global">Global</SelectItem>
            <SelectItem value="All Users">All Users</SelectItem>
            <SelectItem value="Vendors">Vendors</SelectItem>
            <SelectItem value="Admins">Admins</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <div />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((n) => (
                <TableRow
                  key={n.id}
                  className="hover:bg-surface cursor-pointer"
                >
                  <TableCell
                    onClick={() =>
                      router.push(`/dashboard/notifications/${n.id}`)
                    }
                  >
                    #{n.id}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(`/dashboard/notifications/${n.id}`)
                    }
                  >
                    {n.title}
                  </TableCell>
                  <TableCell>{n.audience}</TableCell>
                  <TableCell>{n.sentAt ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        n.status === "Sent"
                          ? "secondary"
                          : n.status === "Failed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {n.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {n.status === "Sent" && (
                        <Button size="sm" onClick={() => onResend?.(n.id)}>
                          Resend
                        </Button>
                      )}
                      {n.status !== "Sent" && (
                        <Button size="sm" onClick={() => onResend?.(n.id)}>
                          Send
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete?.(n.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No notifications.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
