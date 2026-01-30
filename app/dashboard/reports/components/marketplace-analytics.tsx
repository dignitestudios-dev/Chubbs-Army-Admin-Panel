import { ErrorToast } from "@/components/Toaster";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import axios from "@/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const exportMarketplaceAnalyticsCSV = (data: any) => {
  if (!data) return;

  const rows: string[][] = [];

  // Header
  rows.push(["Marketplace Analytics Report"]);
  rows.push(["Generated on", new Date().toLocaleDateString()]);
  rows.push([]); // Empty row

  // Summary Section
  rows.push(["SUMMARY"]);
  rows.push(["Total Vendors", data?.vendors?.total?.toString() || "0"]);
  rows.push([]); // Empty row

  // Revenue Section
  rows.push(["REVENUE"]);
  rows.push(["Marketplace Revenue", `$${data?.revenue?.marketplace || 0}`]);
  rows.push(["Subscriptions Revenue", `$${data?.revenue?.subscriptions || 0}`]);
  rows.push(["Total Revenue", `$${data?.revenue?.total || 0}`]);
  rows.push([]); // Empty row

  // Products Section
  if (data?.offerings?.products?.length) {
    rows.push(["PRODUCTS BY CATEGORY"]);
    rows.push(["Category", "Count"]);
    data.offerings.products.forEach((item: any) => {
      rows.push([item.category || "N/A", item.count?.toString() || "0"]);
    });
    rows.push([]); // Empty row
  }

  // Services Section
  if (data?.offerings?.services?.length) {
    rows.push(["SERVICES BY CATEGORY"]);
    rows.push(["Category", "Count"]);
    data.offerings.services.forEach((item: any) => {
      rows.push([item.category || "N/A", item.count?.toString() || "0"]);
    });
    rows.push([]); // Empty row
  }

  // Orders Section
  if (data?.orders?.length) {
    rows.push(["ORDERS BY STATUS"]);
    rows.push(["Status", "Count"]);
    data.orders.forEach((item: any) => {
      rows.push([item.status || "N/A", item.count?.toString() || "0"]);
    });
  }

  // Create CSV content
  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `marketplace-analytics-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const MarketplaceAnalytics = ({ marketplaceAnalytics }) => {
  const [marketAnalytics, setMarketAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [range, setRange] = useState<string>("");
  const [vendorStatus, setVendorStatus] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");

  const toISOStart = (date: string) =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

  const toISOEnd = (date: string) =>
    new Date(`${date}T23:59:59.999Z`).toISOString();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let params: any = {};

        if (fromDate && toDate) {
          params.fromDate = toISOStart(fromDate);
          params.toDate = toISOEnd(toDate);
        }

        if (range) {
          params.range = range;
        }

        if (vendorStatus && vendorStatus !== "all") {
          params.vendorStatus = vendorStatus;
        }
        if (orderStatus && orderStatus !== "all") {
          params.orderStatus = orderStatus;
        }

        const response = await axios.get("/admin/analytics/marketplace", {
          params,
        });

        if (response.status === 200) {
          setMarketAnalytics(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(err.response?.data?.message ?? "Failed to fetch stats data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fromDate, toDate, range, vendorStatus, orderStatus]);
  console.log(marketAnalytics, "marketAnalytics==>Test");
  const handleFilterChange = (filterType: string, value: string) => {
    // onFilterChange(filterType, value);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    // onPageSizeChange(newPageSize);
  };

  const handlePreviousPage = () => {
    // if (currentPage > 1) {
    //   onPageChange(currentPage - 1);
    // }
  };

  const handleNextPage = () => {
    // if (currentPage < totalPages) {
    //   onPageChange(currentPage + 1);
    // }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Marketplace Analytics Overview</CardTitle>
          <CardDescription>
            Track vendors, products, and marketplace performance
          </CardDescription>
        </div>
        <Button
          onClick={() => exportMarketplaceAnalyticsCSV(marketAnalytics)}
          className="cursor-pointer w-[300px]"
        >
          Export CSV
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
          <Input
            type="date"
            value={fromDate}
            max={today}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);

              // reset toDate if it becomes invalid
              if (toDate && value && toDate < value) {
                setToDate("");
              }

              if (value) setRange("");
            }}
          />

          <Input
            type="date"
            min={fromDate || undefined}
            max={today}
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              if (e.target.value) setRange("");
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="text-sm text-gray-600 mb-1">
              Total Vendors Count
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {marketAnalytics?.vendors?.total}
            </div>
          </div>

          {/* <div className="p-4 rounded-lg border bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-sm text-gray-600 mb-1">
              Total Products/Services Count
            </div>
            <div className="text-3xl font-bold text-rose-600">
              {marketplaceAnalytics.totalProducts}
            </div>
          </div> */}
        </div>{" "}
        <div>
          <h4 className="font-semibold mb-3 text-lg">Revenue</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Marketplace</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketAnalytics?.revenue?.marketplace}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Subscriptions</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketAnalytics?.revenue?.subscriptions}
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketAnalytics?.revenue.total}
              </div>
            </div>
            {/* <div className="p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Subscriptions</div>
              <div className="text-xl font-bold text-emerald-600">
                ${marketplaceAnalytics.revenue.subscriptions.toFixed(2)}
              </div>
            </div> */}
          </div>
        </div>
        <Tabs defaultValue="Product" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Product"> Product</TabsTrigger>
            <TabsTrigger value="Services">Services</TabsTrigger>
            <TabsTrigger value="Orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="Product" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Vendor Status
              </Label>
              <Select onValueChange={(value) => setVendorStatus(value)}>
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="InActive">InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              {loading ? (
                <TableSkeleton rows={2} columns={4} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketAnalytics?.offerings?.products?.length ? (
                      marketAnalytics?.offerings?.products?.map(
                        (category, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {category.category || "User"}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {category?.count || "—"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="Services" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Vendor Status
              </Label>
              <Select onValueChange={(value) => setVendorStatus(value)}>
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="InActive">InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              {loading ? (
                <TableSkeleton rows={2} columns={4} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketAnalytics?.offerings?.services?.length ? (
                      marketAnalytics?.offerings?.services?.map(
                        (category, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {category.category || "User"}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {category?.count || "—"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          <TabsContent value="Orders" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Order Status
              </Label>
              <Select onValueChange={(value) => setOrderStatus(value)}>
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="IDLE">IDLE</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                  <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              {loading ? (
                <TableSkeleton rows={2} columns={4} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketAnalytics?.orders?.length ? (
                      marketAnalytics?.orders?.map((category, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {category?.status || "User"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {category?.count || "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Service PRoduct Table End */}
        {/* <div>
          <h4 className="font-semibold mb-3 text-lg">Vendor Ratings</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Average Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketplaceAnalytics.vendorRatings.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell>{vendor.vendorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default MarketplaceAnalytics;
