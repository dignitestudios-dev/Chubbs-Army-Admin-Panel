"use client";

import React, { useState, useEffect } from "react";

import BusinessTable from "./components/business-table";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [businessData, setBusinessData] = useState<any[]>([]);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const handleFilterChange = (type: string, value: string) => {
    if (type === "search") setSearch(value);
    // else if (type === "status") setStatus(value);
    setPage(1); // reset to first page on filter change
  };

  useEffect(() => {
    const businessProfiles = async () => {
      try {
        const params: any = { page, limit };
        if (debouncedSearch) params.search = debouncedSearch;
        const response = await axios.get("/admin/businesses", { params });
        if (response.status === 200) {
          console.log("Business Profiles:", response.data.data);
          setBusinessData(response?.data?.data?.businesses || []);
          setTotalPages(response?.data?.data?.meta?.totalPages ?? 1);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to fetch business profiles",
        );
      }
    };
    businessProfiles();
  }, [page, limit, debouncedSearch]);

  // const fetchProducts = async () => {
  //   setLoading(true);
  //   try {
  //     const params: any = {};
  //     if (search) params.search = search;
  //     const response = await axios.get("/admin/products", { params });

  //     if (response.status === 200) {
  //       setProducts(response.data.data);
  //     }
  //   } catch (error) {
  //     const err = error as AxiosError<{ message: string }>;
  //     ErrorToast(err.response?.data?.message ?? "Failed to fetch products");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchServices = async () => {
  //   setLoading(true);
  //   try {
  //     const params: any = {};
  //     if (search) params.search = search;
  //     const response = await axios.get("/admin/services", { params });

  //     if (response.status === 200) {
  //       setServices(response.data.data);
  //     }
  //   } catch (error) {
  //     const err = error as AxiosError<{ message: string }>;
  //     ErrorToast(err.response?.data?.message ?? "Failed to fetch services");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (selectedSection === "listings") {
  //     fetchProducts();
  //   } else if (selectedSection === "service") {
  //     fetchServices();
  //   }
  // }, [selectedSection, search]);

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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Marketplace Management</h1>
      </div>

      <div className="space-y-2 sm:col-span-2 w-[400px]">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <input
          id="search"
          type="text"
          placeholder="Search by name or email"
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <section className="space-y-3">
        <BusinessTable businesses={businessData} />
      </section>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select value={limit.toString()} onValueChange={handlePageSizeChange}>
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
  );
}
