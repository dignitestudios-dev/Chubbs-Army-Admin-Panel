"use client";

import React, { useState, useEffect } from "react";
import EventTable from "./components/event-table";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import { formatDate } from "@/lib/utils";

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
  attendance?: number;
  reports?: number;
  ratingAvg?: number;
  feedbackCount?: number;
}

export default function EventPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);

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
      const params: unknown = { status };
      const response = await axios.get("/admin/events", { params });

      if (response.status === 200) {
        setEvents(response.data.data);
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
  }, [selectedSection]);

  const approve = (id: string) =>
    setEvents((s) =>
      s.map((e) =>
        e.id === id.toString() ? { ...e, status: "ACTIVE" as const } : e,
      ),
    );
  const reject = (id: string) =>
    setEvents((s) =>
      s.map((e) =>
        e.id === id.toString() ? { ...e, status: "COMPLETED" as const } : e,
      ),
    );
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
                attendance: 0,
                reports: 0,
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
                attendance: 0,
                reports: 0,
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
    </div>
  );
}
