"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDetailsModal from "../components/ProductDetailsModal";
import ServicesDetailsModal from "../../components/ServicesDetailsModal";

interface Service {
  id: number;
  title: string;
  description: string;
  pickupLocation: string;
  quantity: number | string;
  availableDays: string;
  pickupTime: string;
  image: string;
}

export default function ServicesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { storeId } = params;

  const services: Service[] = [
    {
      id: 1,
      title: "Test",
      description:
        "test test test test test test test test test test test test test test",
      pickupLocation: "Orlando,Florida, USA",
      quantity: 100,
      availableDays: "Monday-Sunday",
      pickupTime: "07:00 AM-07:00 PM",
      image: "/images/shape/placeholder.png",
    },
    {
      id: 2,
      title: "Sample Item",
      description: "Short description for sample item.",
      pickupLocation: "Orlando,Florida, USA",
      quantity: 10,
      availableDays: "Monday-Friday",
      pickupTime: "09:00 AM-05:00 PM",
      image: "/images/shape/placeholder.png",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (service: Service) => {
    setSelectedProduct(service);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="h-44 mb-3 overflow-hidden rounded">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {p.description}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">
                  Pickup Location
                </div>
                <div>{p.pickupLocation}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Quantity</div>
                <div>{p.quantity}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Available Days
                </div>
                <div>{p.availableDays}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Pickup And DropOff
                </div>
                <div>{p.pickupTime}</div>
              </div>
            </div>
            <div className="flex justify-between w-full mt-1">
              <Button className="w-full mt-4" onClick={() => openModal(p)}>
                View Details
              </Button>
            </div>
            {/* <Link
              href={`/dashboard/marketplace/${storeId}/product/${p.id}`}
              className="mt-4 block"
            >
              <button className="w-full mt-3 bg-orange-600 text-white rounded-md py-2">
                View Details
              </button>
            </Link> */}
          </div>
        ))}
      </div>
      <ServicesDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        services={selectedProduct}
      />
    </div>
  );
}
