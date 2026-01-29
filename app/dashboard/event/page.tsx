"use client";

import React, { useState, useEffect } from "react";
import EventTable from "./components/event-table";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import { formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EventData {
  id: string;
  title: string;
  eventDate: string;
  placeName: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  organizer: {
    firstName: string;
    lastName: string;
  };
  date?: string; // ✅ optional now
  location?: string;
  rsvps?: number;
  currentRSVP?: number;
  ticketsSold?: number;
  attendance?: unknown[];
  reports?: number | null;
  participant?: unknown[];
  ratingAvg?: number;
  feedbackCount?: number;
  _count?: {
    eventreport?: number;
  };
}

export default function EventPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  console.log("🚀 ~ EventPage ~ events:", events);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);

  const [selectedSection, setSelectedSection] = useState<
    "approval" | "monitoring" | "post"
  >("approval");

  const getStatusForSection = (section: typeof selectedSection) => {
    switch (section) {
      case "approval":
        return "DRAFT";
      case "monitoring":
        return "ACTIVE";
      case "post":
        return "COMPLETED";
      default:
        return "DRAFT";
    }
  };

  const fetchEvents = async (status: string) => {
    setLoading(true);
    try {
      const params: unknown = { status, page, limit };
      const response = await axios.get("/admin/events", { params });

      if (response.status === 200) {
        setEvents(response?.data?.data?.events);
        setTotalPages(response?.data?.data?.meta?.totalPages ?? 1);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = getStatusForSection(selectedSection);

    fetchEvents(status);
  }, [selectedSection, update, page, limit]);

  const approve = () => setUpdate((prev) => !prev);

  const reject = () => setUpdate((prev) => !prev);

  const edit = (id: string) => alert(`Edit event ${id} — open editor`);
  const remove = (id: string) =>
    setEvents((s) => s.filter((e) => e.id !== id.toString()));
  const viewPostEvent = (id: string) => {
    router.push(`/dashboard/event/post/${id}`);
  };
  const viewMetrics = (id: string) => {
    router.push(`/dashboard/event/monitoring/${id}`);
  };
  const removeContent = (id: string) =>
    alert(`Remove inappropriate content for ${id}`);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: string) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Event Management</h1>
        <div className="flex items-center gap-4">
          {/* <Badge>Admin</Badge>
           */}
          {/* <Button
            onClick={() => alert("Export events CSV - implement backend")}
          >
            Export
          </Button> */}
        </div>
      </div>

      <div>
        <Tabs
          value={selectedSection}
          onValueChange={(v) => {
            if (v === "approval" || v === "monitoring" || v === "post") {
              setSelectedSection(v);
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="approval">Event Approval</TabsTrigger>
            <TabsTrigger value="monitoring">Event Monitoring</TabsTrigger>
            <TabsTrigger value="post">Post-Event Management</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <section className="space-y-3">
        {selectedSection === "approval" && (
          <>
            <h2 className="text-lg font-semibold">Event Approval Workflow</h2>
            <EventTable
              section="approval"
              events={events.map((e) => ({
                id: e.id,
                title: e.title,
                organizer: `${e?.organizer?.firstName} ${e?.organizer?.lastName}`,
                date: formatDate(e?.eventDate),
                location: e?.placeName,
                status:
                  e?.status === "DRAFT"
                    ? "submitted"
                    : e?.status === "ACTIVE"
                      ? "approved"
                      : "rejected",
                rsvps: 0, // not in data
                ticketsSold: 0,
                attendance: 0,
                reports: 0,
                ratingAvg: 0,
                feedbackCount: 0,
              }))}
              onApprove={approve}
              onReject={reject}
              onEdit={edit}
              onRemove={remove}
            />
          </>
        )}

        {selectedSection === "monitoring" && (
          <>
            <h2 className="text-lg font-semibold">Event Monitoring</h2>
            <EventTable
              section="monitoring"
              events={events.map((e) => ({
                id: e?.id,
                title: e?.title,
                organizer: `${e?.organizer?.firstName} ${e?.organizer?.lastName}`,
                status: "approved",
                rsvps: e?.currentRSVP,
                ticketsSold: 0,
                attendance: e?.participant?.length ?? 0,
                reports: e?._count?.eventreport ?? 0,
                ratingAvg: 0,
                feedbackCount: 0,
              }))}
              onViewMetrics={viewMetrics}
            />
          </>
        )}

        {selectedSection === "post" && (
          <>
            <h2 className="text-lg font-semibold">Post-Event Management</h2>
            <EventTable
              section="post"
              events={events.map((e) => ({
                id: e?.id,
                title: e?.title,
                organizer: `${e?.organizer?.firstName} ${e?.organizer?.lastName}`,
                date: formatDate(e?.eventDate),
                location: e?.placeName,
                status:
                  e?.status === "DRAFT"
                    ? "submitted"
                    : e?.status === "ACTIVE"
                      ? "approved"
                      : "rejected",
                rsvps: 0,
                ticketsSold: 0,
                attendance: e?.participant?.length ?? 0,
                reports: e?._count?.eventreport ?? 0,
                ratingAvg: 0,
                feedbackCount: 0,
              }))}
              onEdit={edit}
              onRemoveContent={removeContent}
              onRemove={remove}
              onViewMetrics={viewPostEvent}
            />
          </>
        )}
      </section>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select value={limit.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="hidden sm:flex items-center space-x-2">
            <p className="text-sm font-medium">Page</p>
            <strong className="text-sm">
              {page} of {totalPages}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
