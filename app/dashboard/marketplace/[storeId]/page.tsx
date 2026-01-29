"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";

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

export default function StoreProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = use(params);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);

  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedType, setSelectedType] = useState<"product" | "service">(
    "product",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedSection, setSelectedSection] = useState<
    "listings" | "service" | "businesses"
  >("listings");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await axios.get(`/admin/products/${storeId}`, {
        params,
      });

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
      const response = await axios.get(`/admin/services/${storeId}`, {
        params,
      });

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

  const openModal = (item: Item, type: "product" | "service") => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="mb-2">
        <div>
          <Tabs
            value={selectedSection}
            onValueChange={(v) => {
              if (v === "listings" || v === "service") {
                setSelectedSection(v);
              }
            }}
          >
            <TabsList>
              {/* <TabsTrigger value="vendors">Vendors</TabsTrigger> */}
              <TabsTrigger value="listings">Products</TabsTrigger>
              <TabsTrigger value="service">Services</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* <div className="w-[300px]">
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
        </div> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {selectedSection === "listings" && (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="h-44 mb-3 overflow-hidden rounded">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="font-medium text-lg">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {p.owner.BusinessProfile[0]?.businessName || "Business"}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Category
                          </div>
                          <div>{p.category}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Price
                          </div>
                          <div>${p.price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Stock
                          </div>
                          <div>{p.stock}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Rating
                          </div>
                          <div>
                            {p.averageRating} ({p.reviewCount} reviews)
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4"
                        onClick={() => openModal(p, "product")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">
                  No products available
                </p>
              )}
            </>
          )}

          {selectedSection === "service" && (
            <>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="h-44 mb-3 overflow-hidden rounded">
                        <img
                          src={s.images[0]}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="font-medium text-lg">{s.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {s.owner.BusinessProfile[0]?.businessName || "Business"}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Category
                          </div>
                          <div>{s.category}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Pet Type
                          </div>
                          <div>{s.petType}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Price per Hour
                          </div>
                          <div>${s.pricePerHour}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Rating
                          </div>
                          <div>
                            {s.averageRating} ({s.reviewCount} reviews)
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4"
                        onClick={() => openModal(s, "service")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">
                  No services available
                </p>
              )}
            </>
          )}
        </>
      )}

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

      <ProductDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        item={selectedItem}
        type={selectedType}
      />
    </div>
  );
}
