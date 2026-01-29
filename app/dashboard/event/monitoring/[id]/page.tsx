"use client";

import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import { useEffect, useState, use } from "react";
import axios from "@/axios";
import ModerationActionModal from "../../../content/components/ModerationActionModal";

interface EventReview {
  id: string;
  comment: string;
  createdAt: string;
  eventId: string;
  rating: number;
  isDeleted?: boolean;
  organizerId?: string | null;
  petId?: string | null;
  updatedAt?: string;
}

interface PostEventDetail {
  id: string;
  title: string;
  currentRSVP: number;
  ticketsSold: number;
  attendance: number;
  currentAttendees: number;
  averageRating?: number | null;
  EventReview?: EventReview[];
  status: string;
  _count?: {
    eventreport?: number;
  };
  eventreport?: unknown[];
  organizer?: {
    firstName?: string;
    lastName?: string;
  } | null;
}

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

  const [eventData, setEventData] = useState<PostEventDetail | null>(null);
  console.log("🚀 ~ EventMonitoringDetailPage ~ eventData:", eventData);

  const [loading, setLoading] = useState(true);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/events/${id}`);
      console.log("🚀 ~ fetchEventDetails ~ response:", response);

      if (response.status === 200) {
        setEventData(response.data.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(
        err.response?.data?.message ?? "Failed to fetch event details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const openSuspendConfirm = () => setConfirmSuspend(true);
  const closeSuspendConfirm = () => {
    setConfirmSuspend(false);
    setIsSuspending(false);
  };

  const handleSuspend = async () => {
    if (!id) return;
    setIsSuspending(true);
    try {
      const res = await axios.patch(`/admin/events/${id}/cancel`);
      if (res.status === 200) {
        SuccessToast("Event suspended");
        // refresh details
        await fetchEventDetails();
      } else {
        ErrorToast("Failed to suspend event");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to suspend event");
    } finally {
      setIsSuspending(false);
      setConfirmSuspend(false);
    }
  };

  const event = eventData;

  if (!event && !loading) {
    return <div className="p-6">Event not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{event?.title}</h1>

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
                {event?.currentRSVP}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets Sold</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {event?.currentAttendees}
              </CardContent>
            </Card>
          </div>

          {/* Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Reports</CardTitle>

              <Badge
                variant={
                  event.eventreport.length > 0 ? "destructive" : "secondary"
                }
              >
                {event.eventreport.length} Total
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
                <ReportStat label="Safety Issues" count={0} critical />
                <ReportStat label="Fraud / Scams" count={0} />
                <ReportStat label="Misleading Info" count={0} />
                <ReportStat label="Inappropriate Content" count={0} />
                <ReportStat label="Spam / Abuse" count={0} />
                <ReportStat label="Organizer No-Show" count={0} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {event.status !== "CANCELLED" && (
                  <Button size="sm" onClick={openSuspendConfirm}>
                    Suspend Event
                  </Button>
                )}

                {/* <Button size="sm" variant="outline">
                  Contact Organizer
                </Button> */}
                {/* <Button size="sm" variant="destructive">
              Suspend Event
            </Button> */}
              </div>
              {confirmSuspend && (
                <ModerationActionModal
                  isOpen={!!confirmSuspend}
                  onClose={closeSuspendConfirm}
                  title="Suspend Event"
                  description="Suspending this event will stop further activity and notify attendees. Are you sure you want to suspend it?"
                  confirmText="Suspend Event"
                  confirmVariant="destructive"
                  isProcessing={isSuspending}
                  onConfirm={handleSuspend}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
