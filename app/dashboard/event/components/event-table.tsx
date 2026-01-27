"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SectionType = "approval" | "monitoring" | "post";

interface EventItem {
  id: string;
  title: string;
  organizer: string;
  date?: string; // ✅ optional now
  location?: string;
  status: "submitted" | "approved" | "rejected" | "removed";
  rsvps?: number;
  ticketsSold?: number;
  attendance?: number;
  reports?: number;
  ratingAvg?: number;
  feedbackCount?: number;
}

interface Props {
  section: SectionType;
  events?: EventItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onViewMetrics?: (id: string) => void;
  onRemoveContent?: (id: string) => void;
}

export default function EventTable(props: Props) {
  const { section } = props;
  const events = props.events || [];

  if (section === "approval") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length ? (
              events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex flex-col w-[150px]">
                      <span
                        className="font-medium line-clamp-1 cursor-help"
                        title={e.title}
                      >
                        {e.title}
                      </span>
                      {/* <span className="text-sm text-muted-foreground">
                        ID {e.id}
                      </span> */}
                    </div>
                  </TableCell>
                  <TableCell>{e.organizer}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.location || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.status === "approved"
                          ? "secondary"
                          : e.status === "submitted"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {e.status === "submitted" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => props.onViewMetrics?.(e.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => props.onApprove?.(e.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => props.onReject?.(e.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No submitted events.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (section === "monitoring") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>RSVPs</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length ? (
              events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex flex-col w-[150px]">
                      <span
                        className="font-medium line-clamp-1 cursor-help"
                        title={e.title}
                      >
                        {e.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {e.organizer}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{e.rsvps ?? 0}</TableCell>
                  <TableCell>{e.ticketsSold ?? 0}</TableCell>
                  <TableCell>{e.attendance ?? 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.reports && e.reports > 0 ? "destructive" : "secondary"
                      }
                    >
                      {e.reports ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => props.onViewMetrics?.(e.id)}
                      >
                        View Metrics
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No events to monitor.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  // post-event
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Avg Rating</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length ? (
            events.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{e.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {e.organizer}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {e.ratingAvg ? e.ratingAvg.toFixed(1) : "—"}
                </TableCell>
                <TableCell>{e.feedbackCount ?? 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      e.reports && e.reports > 0 ? "destructive" : "secondary"
                    }
                  >
                    {e.reports ?? 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => props.onRemoveContent?.(e.id)}
                    >
                      Remove Content
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => props.onViewMetrics?.(e.id)}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No post-event items.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
