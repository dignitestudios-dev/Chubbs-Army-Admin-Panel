"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
};

interface Props {
  open: boolean;
  onClose: () => void;
  ad: Ad | null;
}

export function ViewAdModal({ open, onClose, ad }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!ad) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === ad.media.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? ad.media.length - 1 : prev - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Ad Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Slider */}
          {ad.media && ad.media.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={ad.media[currentImageIndex].fileUrl}
                  alt={`Ad image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Buttons */}
              {ad.media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {ad.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex
                            ? "bg-indigo-600"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Ad Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Title</Label>
              <p className="mt-1 text-gray-700">{ad.title}</p>
            </div>

            <div>
              <Label className="text-base font-semibold">Description</Label>
              <p className="mt-1 text-gray-700">{ad.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Start Date</Label>
                <p className="mt-1 text-gray-700">{formatDate(ad.startDate)}</p>
              </div>

              <div>
                <Label className="text-base font-semibold">End Date</Label>
                <p className="mt-1 text-gray-700">{formatDate(ad.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
