"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventItem {
  id: string;
  title: string;
  organizer: string;
  date?: string;
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
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
}

export default function EventDetailsModal({ isOpen, onClose, event }: Props) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Organizer" value={event.organizer} />
            <Detail label="Status" value={event.status} />
            {event.date && <Detail label="Date" value={event.date} />}
            {event.location && (
              <Detail label="Location" value={event.location} />
            )}
          </div>

          {/* <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="RSVPs" value={event.rsvps ?? 0} />
              <Detail label="Tickets Sold" value={event.ticketsSold ?? 0} />
              <Detail label="Attendance" value={event.attendance ?? 0} />
              <Detail label="Reports" value={event.reports ?? 0} />
              {event.ratingAvg && (
                <Detail label="Avg Rating" value={event.ratingAvg.toFixed(1)} />
              )}
              {event.feedbackCount !== undefined && (
                <Detail label="Feedback Count" value={event.feedbackCount} />
              )}
            </div>
          </div> */}
        </div>

        {/* <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
