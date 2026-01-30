"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from "lucide-react";
import { CreateAdModal } from "./components/CreateModal";

type Ad = {
  id: string;
  images: string[];
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired";
  createdAt: string;
};

export default function AdsManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ads, setAds] = useState<Ad[]>([
    {
      id: "1",
      images: ["/placeholder-ad1.jpg"],
      startDate: "2026-01-15",
      endDate: "2026-02-15",
      status: "active",
      createdAt: "2026-01-10",
    },
    {
      id: "2",
      images: ["/placeholder-ad2.jpg", "/placeholder-ad3.jpg"],
      startDate: "2026-02-01",
      endDate: "2026-03-01",
      status: "scheduled",
      createdAt: "2026-01-20",
    },
    {
      id: "3",
      images: ["/placeholder-ad4.jpg"],
      startDate: "2025-12-01",
      endDate: "2026-01-01",
      status: "expired",
      createdAt: "2025-11-25",
    },
  ]);

  const handleCreateSuccess = () => {
    // Refresh ads list after creating new ad
    // In real app, fetch from API
    console.log("Ad created successfully");
  };

  const getStatusBadge = (status: Ad["status"]) => {
    const variants = {
      active: "default",
      scheduled: "secondary",
      expired: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold ">Ads Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your advertising campaigns
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Ad
          </Button>
        </div>

        {/* Ads Table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ads.length ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    {/* Ad Image / Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {ad.images?.[0] ? (
                            <img
                              src={ad.images[0]}
                              alt="Ad image"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Ad
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium">
                            Ad #{ad.id.slice(-4)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {ad.images.length} image(s)
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Start Date */}
                    <TableCell>
                      <span className="text-sm">
                        {formatDate(ad.startDate)}
                      </span>
                    </TableCell>

                    {/* End Date */}
                    <TableCell>
                      <span className="text-sm">{formatDate(ad.endDate)}</span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={
                          ad.status === "active" ? "default" : "secondary"
                        }
                      >
                        {ad.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No ads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateAdModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
