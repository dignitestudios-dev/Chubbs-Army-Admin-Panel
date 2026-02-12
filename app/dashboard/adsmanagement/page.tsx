"use client";

import React, { useEffect, useState } from "react";
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
import { ViewAdModal } from "./components/ViewAdModal";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalConfirm } from "@/components/GlobalConfirm";
import { formatDate } from "@/lib/utils";
interface AdMedia {
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  thumbnailUrl?: string | null;
}

type Ad = {
  id: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired";
  createdAt: string;
  title: string;
  description: string;
  media: AdMedia[];
  isEnded: boolean;
};

export default function AdsManagement() {
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const [ads, setAds] = useState<Ad[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(false);

  const handleCreateSuccess = () => {
    // Refresh ads list after creating new ad
    // In real app, fetch from API
    console.log("Ad created successfully");
    setUpdate((prev) => !prev);
  };

  const handleViewAd = (ad: Ad) => {
    setSelectedAd(ad);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (isEnded: boolean) => {
    return (
      <Badge variant={isEnded ? "secondary" : "default"} className="capitalize">
        {isEnded ? "Ended" : "Active"}
      </Badge>
    );
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit };
        const response = await axios.get("reels/getAllAdvertise?type=ADMIN", {
          params,
        });

        if (response.status === 200) {
          setAds(response?.data?.data?.data);
          setTotalPages(response?.data?.data?.pagination?.totalPages ?? 1);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to fetch ads data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [update, page, limit]);

  const confirm = useGlobalConfirm();

  const handleEndCampaign = async (ad) => {
    const ok = await confirm({
      title: "End Campaign",
      description: `Are you sure you want to end this campaign?`,
      confirmLabel: "End Campaign",
      cancelLabel: "Cancel",
      destructive: true,
    });

    if (ok) {
      onEndCampaign(ad);
    }
  };

  const handleCampaign = async (ad: Ad) => {
    handleEndCampaign(ad.id);
  };

  const onEndCampaign = async (adId?: string) => {
    if (!adId) return;
    setLoading(true);
    try {
      const response = await axios.delete(`admin/advertises/${adId}/end`);
      if (response.status === 200) {
        SuccessToast("Campaign ended successfully");
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to end the campaign");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const handlePageSizeChange = (newLimit: string) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Ads Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your advertising campaigns
            </p>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Ad
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ads?.length ? (
                  ads?.map((ad) => (
                    <TableRow key={ad.id}>
                      {/* Ad Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {ad?.media?.[0]?.fileUrl ? (
                              <img
                                src={ad?.media[0]?.fileUrl}
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
                            <span className="text-sm text-muted-foreground">
                              {ad?.media?.length} image(s)
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ad?.title || "--"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {ad?.description || "--"}
                      </TableCell>

                      {/* Start Date */}
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(ad?.startDate)}
                        </span>
                      </TableCell>

                      {/* End Date */}
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(ad?.endDate)}
                        </span>
                      </TableCell>
                      {/* Status */}
                      <TableCell>{getStatusBadge(ad?.isEnded)}</TableCell>

                      {/* Actions */}
                      <TableCell className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAd(ad)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {!ad?.isEnded && (
                          <Button
                            onClick={() => handleCampaign(ad)}
                            disabled={ad?.isEnded}
                            variant="destructive"
                            size="sm"
                            className=" ml-2"
                          >
                            End Campaign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No ads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Show
            </Label>
            <Select
              value={limit.toString()}
              onValueChange={handlePageSizeChange}
            >
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
                onClick={handlePreviousPage}
                disabled={page <= 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ad Modal */}
      <CreateAdModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* View Ad Modal */}
      <ViewAdModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        ad={selectedAd}
      />
    </div>
  );
}
