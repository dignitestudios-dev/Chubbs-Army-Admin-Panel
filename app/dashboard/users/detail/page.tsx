"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserDetailModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (userId: number) => void; // Activate / Deactivate
  onVerifyIdentity: (userId: number) => void;
  onUpdateDetails: (userId: number) => void;
}

export const UserDetailModal = ({
  user,
  isOpen,
  onClose,
  onToggleStatus,
  onVerifyIdentity,
  onUpdateDetails,
}: UserDetailModalProps) => {
  if (!user) return null;

  const statusColor =
    user.status === "Active"
      ? "bg-green-50 text-green-600"
      : "bg-gray-50 text-gray-600";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Basic Info */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge className={statusColor}>{user.status}</Badge>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-sm mb-1">Contact Info</h4>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
          </div>

          {/* Account Info */}
          <div>
            <h4 className="font-medium text-sm mb-1">Account Info</h4>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Plan:</strong> {user.plan}
            </p>
            <p>
              <strong>Billing:</strong> {user.billing}
            </p>
            <p>
              <strong>Joined:</strong> {user.joinedDate}
            </p>
            <p>
              <strong>Last Login:</strong> {user.lastLogin}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col  sm:space-x-2 space-y-2 sm:space-y-0 mt-4">
            <Button
              variant={user.status === "Active" ? "destructive" : "default"}
              onClick={() => onToggleStatus(user.id)}
              className="w-full"
            >
              {user.status === "Active" ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onVerifyIdentity(user.id)}
              className="w-full"
            >
              Verify Identity
            </Button>
            <Button
              variant="secondary"
              onClick={() => onUpdateDetails(user.id)}
              className="w-full"
            >
              Update Details
            </Button>
          </div>
        </div>

        <DialogClose className="mt-4 w-full btn btn-primary">Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
};
