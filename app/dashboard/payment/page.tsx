"use client";

import React, { useState, useEffect } from "react";
import PaymentTable from "./components/payment-table";
import axios from "../../../axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionData {
  id: string;
  type: string;
  description: string;
  subTotal: string;
  paymentFee: string;
  platformFee: string;
  totalAmount: string;
  createdAt: string;
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RevenueData {
  _sum: {
    platformFee: number;
  };
}

export default function PaymentPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<RevenueData | null>(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      const response = await axios.get("/admin/transactions", { params });
      if (response.status === 200) {
        setTransactions(response?.data?.data?.transactions);
        setTotalRevenue(response?.data?.data?.totalRevenue || 0);
        setTotalPages(response?.data?.data?.meta?.totalPages ?? 1);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, limit]);

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
        <h1 className="text-[22px] font-bold">Payment Overview</h1>
        {/* <div className="flex items-center gap-4">
          <Badge>Finance</Badge>
          <Button
            onClick={() => alert("Export transactions CSV - implement backend")}
          >
            Export
          </Button>
        </div> */}
        {/* <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">Last Year</SelectItem>
            </SelectContent>
          </Select> */}
      </div>

      <div>
        <div className="p-4 rounded-md border mb-2">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-semibold">
            ${totalRevenue?._sum?.platformFee}
          </p>
        </div>
        {/* <Tabs value={selected} onValueChange={(v) => setSelected(v as any)}>
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="refunds">Refunds & Disputes</TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      <section className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <PaymentTable
              section="transactions"
              transactions={transactions.map((t) => ({
                id: t.id,
                date: new Date(t.createdAt).toLocaleDateString(),
                buyer: `${t.buyer.firstName} ${t.buyer.lastName}`,
                seller: `${t.seller.firstName} ${t.seller.lastName}`,
                sellerId: t.seller.id,
                buyerId: t.buyer.id,
                serviceType: t.type,
                serviceName: t.description,
                amount: parseFloat(t.totalAmount),
                commission: parseFloat(t.platformFee),
                status: "completed" as const,
              }))}
            />
          </>
        )}

        {/* {selected === "revenue" && (
          <>
            <h2 className="text-lg font-semibold">Marketplace Revenue</h2>
            <PaymentTable section="revenue" transactions={transactions} />
          </>
        )} */}
        {/*
        {selected === "refunds" && (
          <>
            <h2 className="text-lg font-semibold">Refunds & Disputes</h2>
            <PaymentTable
              section="refunds"
              transactions={transactions}
              onResolveDispute={resolveDispute}
            />
          </>
        )} */}
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
