"use client";

import { ErrorToast } from "@/components/Toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import { use, useEffect, useState } from "react";
import axios from "@/axios";

interface EventMetrics {
  id: number;
  title: string;
  rsvps: number;
  ticketsSold: number;
  attendance: number;
  reports: number;
}

const mockEvents: EventMetrics[] = [
  {
    id: 1,
    title: "Tech Conference 2025",
    rsvps: 340,
    ticketsSold: 280,
    attendance: 260,
    reports: 1,
  },
];

function ReportStat({
  label,
  count,
  critical,
}: {
  label: string;
  count: number;
  critical?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm">{label}</span>
      <Badge variant={critical && count > 0 ? "destructive" : "secondary"}>
        {count}
      </Badge>
    </div>
  );
}

export default function EventMonitoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  console.log("🚀 ~ EventMonitoringDetailPage ~ id:", id);
  const [eventData, setEventData] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/admin/events/${id}`);

        if (response.status === 200) {
          setEventData(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to fetch user details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const event = eventData ?? mockEvents.find((e) => e.id === Number(id));

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{event.title}</h1>

      {loading ? (
        <div className="p-4">Loading event details...</div>
      ) : (
        <>
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>RSVPs</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {event.rsvps}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets Sold</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {event.ticketsSold}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {event.attendance}
              </CardContent>
            </Card>
          </div>

          {/* Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Reports</CardTitle>

              <Badge variant={event.reports > 0 ? "destructive" : "secondary"}>
                {event.reports} Total
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="text-sm text-muted-foreground">
                Reports submitted by attendees regarding safety, accuracy, or
                policy concerns.
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <ReportStat label="Safety Issues" count={2} critical />
                <ReportStat label="Fraud / Scams" count={1} />
                <ReportStat label="Misleading Info" count={3} />
                <ReportStat label="Inappropriate Content" count={0} />
                <ReportStat label="Spam / Abuse" count={4} />
                <ReportStat label="Organizer No-Show" count={1} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm">Suspend Event</Button>
                <Button size="sm" variant="outline">
                  Contact Organizer
                </Button>
                {/* <Button size="sm" variant="destructive">
              Suspend Event
            </Button> */}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
