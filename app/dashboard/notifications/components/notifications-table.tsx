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
  description: string;
  audience: "USER" | "SERVICE_PROVIDER" | "EVENT_ORGANIZER";
  sentAt?: string;
  status: "Draft" | "Sent" | "Failed";
};

interface Props {
  notifications?: Notification[];
  audience?: string;
  status?: string;
  search?: string;
  onAudienceChange?: (v: string) => void;
  onStatusChange?: (v: string) => void;
  onSearchChange?: (v: string) => void;
  onResend?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function NotificationsTable({
  notifications = [],
  audience = "all",
  status = "all",
  search = "",
  onAudienceChange,
  onStatusChange,
  onSearchChange,
  onResend,
  onDelete,
}: Props) {
  console.log("🚀 ~ NotificationsTable ~ notifications:", notifications);
  const router = useRouter();

  const normalizeAudience = (a: string) => {
    if (a === "USERS") return "USER";
    return a;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <Input
          placeholder="Search by id or title"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />

        <Select value={audience} onValueChange={(v) => onAudienceChange?.(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="USERS">All Users</SelectItem>
            <SelectItem value="PET">Pets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              {/* <TableHead>Sent At</TableHead>
              <TableHead>Status</TableHead> */}
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length ? (
              notifications?.map((n) => (
                <TableRow
                  key={n?.id}
                  className="hover:bg-surface cursor-pointer"
                >
                  <TableCell>#{n?.id}</TableCell>
                  <TableCell>{n?.title}</TableCell>
                  <TableCell>{n?.description}</TableCell>
                  {/* <TableCell>{n.sentAt ?? "—"}</TableCell>
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
                  </TableCell> */}
                  {/* <TableCell>
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
                  </TableCell> */}
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
