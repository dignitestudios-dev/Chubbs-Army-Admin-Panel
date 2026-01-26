"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    BusinessProfile: Array<{
      businessName: string;
      businessEmail: string;
      businessPhoneNumber: string;
    }>;
  };
}

interface ServiceData {
  id: string;
  name: string;
  category: string;
  petType: string;
  pricePerHour: string;
  images: string[];
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    BusinessProfile: Array<{
      businessName: string;
      businessEmail: string;
      businessPhoneNumber: string;
    }>;
  };
}

type Item = ProductData | ServiceData;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  type: "product" | "service";
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  item,
  type,
}: Props) {
  if (!item) return null;

  const isProduct = type === "product";
  const isService = type === "service";

  const title = isProduct
    ? (item as ProductData).name
    : (item as ServiceData).name;
  const image = isProduct
    ? (item as ProductData).images[0]
    : (item as ServiceData).images[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="h-48 overflow-hidden rounded">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {isProduct && (
            <>
              <p className="text-sm text-muted-foreground">
                Business:{" "}
                {(item as ProductData).owner.BusinessProfile[0]?.businessName ||
                  "N/A"}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail
                  label="Category"
                  value={(item as ProductData).category}
                />
                <Detail
                  label="Price"
                  value={`$${(item as ProductData).price.toFixed(2)}`}
                />
                <Detail label="Stock" value={(item as ProductData).stock} />
                <Detail
                  label="Rating"
                  value={`${(item as ProductData).averageRating} (${(item as ProductData).reviewCount} reviews)`}
                />
              </div>
            </>
          )}

          {isService && (
            <>
              <p className="text-sm text-muted-foreground">
                Business:{" "}
                {(item as ServiceData).owner.BusinessProfile[0]?.businessName ||
                  "N/A"}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail
                  label="Category"
                  value={(item as ServiceData).category}
                />
                <Detail
                  label="Pet Type"
                  value={(item as ServiceData).petType}
                />
                <Detail
                  label="Price per Hour"
                  value={`$${(item as ServiceData).pricePerHour}`}
                />
                <Detail
                  label="Rating"
                  value={`${(item as ServiceData).averageRating} (${(item as ServiceData).reviewCount} reviews)`}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
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
