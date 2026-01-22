"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  description: string;
  pickupLocation: string;
  quantity: number;
  availableDays: string;
  pickupTime: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: Props) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="h-48 overflow-hidden rounded">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Pickup Location" value={product.pickupLocation} />
            <Detail label="Quantity" value={product.quantity} />
            <Detail label="Available Days" value={product.availableDays} />
            <Detail label="Pickup & Drop-off" value={product.pickupTime} />
          </div>
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
