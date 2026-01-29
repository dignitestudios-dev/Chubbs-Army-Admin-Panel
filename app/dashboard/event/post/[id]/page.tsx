"use client";
import { useState, useEffect, use } from "react";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  averageRating?: number | null;
  EventReview?: EventReview[];
  _count?: {
    eventreport?: number;
  };
  organizer?: {
    firstName?: string;
    lastName?: string;
  } | null;
}

export default function PostEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [eventData, setEventData] = useState<PostEventDetail | null>(null);
  console.log("🚀 ~ PostEventDetailPage ~ eventData:", eventData);
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
          err.response?.data?.message ?? "Failed to fetch event details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const event: PostEventDetail = eventData; // use fetched data when available

  return (
    <div className="space-y-6 p-6">
      {loading ? (
        <div>Loading event details...</div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">{event.title}</h1>

          {/* Ratings Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <span className="text-4xl font-bold">
                {event.averageRating ? event.averageRating.toFixed(1) : "—"}
              </span>
              <Badge variant="secondary">
                {event.EventReview?.length ?? 0} Reviews
              </Badge>
              {(event._count?.eventreport ?? 0) > 0 && (
                <Badge variant="destructive">
                  {event._count?.eventreport} Reports
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Feedback Review */}
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(event.EventReview?.length ?? 0) > 0 ? (
                event.EventReview!.map((f) => (
                  <div key={f.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {f.petId ?? "Anonymous"}
                      </span>
                      <Badge
                        variant={f.isDeleted ? "destructive" : "secondary"}
                      >
                        {f.rating}★
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{f.comment}</p>

                    {/* <div className="flex gap-2">
                  {!f.isDeleted && (
                    <Button size="sm" variant="destructive">
                      Remove Feedback
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                </div> */}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No feedback yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Moderation */}
          {/* <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="destructive">Remove Event Content</Button>
          <Button variant="outline">Contact Organizer</Button>
        </CardContent>
      </Card> */}
        </>
      )}
    </div>
  );
}
