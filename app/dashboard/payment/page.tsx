"use client";

import React, { useState, useEffect } from "react";
import PaymentTable from "./components/payment-table";
import axios from "../../../axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

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

export default function PaymentPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/transactions");
      if (response.status === 200) {
        setTransactions(response.data.data);
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
  }, []);

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + parseFloat(t.totalAmount),
    0,
  );

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
          <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
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
    </div>
  );
}
