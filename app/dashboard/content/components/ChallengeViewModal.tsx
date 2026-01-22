"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ChallengeViewModal({
  open,
  onClose,
  challenge,
}: {
  open: boolean;
  onClose: () => void;
  challenge?: Challenge;
}) {
  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{challenge.title}</DialogTitle>
        </DialogHeader>

        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-48 object-cover rounded-md"
        />

        <div className="space-y-2 mt-3 text-sm">
          <p>
            <span className="font-medium">Duration:</span> {challenge.duration}
          </p>
          <p>
            <span className="font-medium">Pets Involved:</span>{" "}
            {challenge.petsCount}
          </p>
          <p className="text-muted-foreground">{challenge.description}</p>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
