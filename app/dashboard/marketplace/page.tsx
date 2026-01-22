"use client";

import React, { useState, useEffect } from "react";
import MarketplaceTable from "./components/marketplace-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";

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

export default function MarketplacePage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedSection, setSelectedSection] = useState<
    "listings" | "service"
  >("listings");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await axios.get("/admin/products", { params });

      if (response.status === 200) {
        setProducts(response.data.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await axios.get("/admin/services", { params });

      if (response.status === 200) {
        setServices(response.data.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection === "listings") {
      fetchProducts();
    } else if (selectedSection === "service") {
      fetchServices();
    }
  }, [selectedSection, search]);

  // vendor actions
  const approveVendor = (id: number) => alert(`Approve vendor ${id}`);

  const rejectVendor = (id: number) => alert(`Reject vendor ${id}`);

  const verifyDocs = (id: number) => alert(`Verify docs ${id}`);

  const suspendVendor = (id: number) => alert(`Suspend vendor ${id}`);

  // listing actions
  const editListing = (id: number) => alert(`Edit listing ${id}`);
  const removeListing = (id: number) =>
    setProducts((s) => s.filter((p) => p.id !== id.toString()));

  const flagListing = (id: number) => alert(`Flag listing ${id}`);

  // order actions
  const viewOrder = (id: number) => alert(`View order ${id}`);

  const escalateOrder = (id: number) => alert(`Escalate order ${id}`);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Marketplace Management</h1>
        {/* <div className="flex items-center gap-4">
          
          <Button
            onClick={() => {
              alert("Export CSV - implement backend");
            }}
          >
            Export
          </Button>
        </div> */}
      </div>

      <div>
        <Tabs
          value={selectedSection}
          onValueChange={(v) => setSelectedSection(v as any)}
        >
          <TabsList>
            {/* <TabsTrigger value="vendors">Vendors</TabsTrigger> */}
            <TabsTrigger value="listings">Products</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-[300px]">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <input
          id="search"
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <section className="space-y-3">
        {selectedSection === "listings" && (
          <>
            <h2 className="text-lg font-semibold">Stores</h2>
            <MarketplaceTable
              section="listings"
              listings={products.map((p) => ({
                id: parseInt(p.id) || 0, // since id is string, but table expects number
                email: p.owner.BusinessProfile[0]?.businessEmail || "",
                phone: p.owner.BusinessProfile[0]?.businessPhoneNumber || "",
                title: p.name,
                vendor: `${p.owner.firstName} ${p.owner.lastName}`,
                category: p.category,
                status: "live" as const,
              }))}
              onEditListing={editListing}
              onRemoveListing={removeListing}
              onFlagListing={flagListing}
            />
          </>
        )}

        {selectedSection === "service" && (
          <>
            <h2 className="text-lg font-semibold">Service Listing</h2>
            <MarketplaceTable
              section="orders"
              orders={services.map((s) => ({
                id: parseInt(s.id) || 0,
                providerName: `${s.owner.firstName} ${s.owner.lastName}`,
                businessName: s.owner.BusinessProfile[0]?.businessName || "",
                serviceName: s.name,
                category: s.category,
                location: "", // not in data
                bookingDate: new Date(s.createdAt).toISOString().split("T")[0],
                status: "pending" as const,
              }))}
              onViewOrder={viewOrder}
              onEscalateOrder={escalateOrder}
            />
          </>
        )}
      </section>
    </div>
  );
}
