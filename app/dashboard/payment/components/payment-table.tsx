"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Section = "transactions" | "revenue" | "refunds";

interface Transaction {
  id: number;
  date: string;
  buyer: string;
  vendor: string;
  serviceType: string;
  serviceName: string;
  amount: number;
  commission: number;
  status: "completed" | "refunded" | "disputed";
  type?: "sale" | "refund";
}

interface Props {
  section: Section;
  transactions?: Transaction[];
  onRefund?: (id: number) => void;
  onResolveDispute?: (id: number) => void;
}

export default function PaymentTable({
  section,
  transactions = [],
  onRefund,
  onResolveDispute,
}: Props) {
  if (section === "transactions") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Txn ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead>Amount</TableHead>
              {/* <TableHead>Commission</TableHead> */}
              {/* <TableHead>Status</TableHead> */}
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length ? (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>#{t.id}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.serviceType}</TableCell>
                  <TableCell>{t.serviceName}</TableCell>
                  <TableCell>${t.amount.toFixed(2)}</TableCell>
                  {/* <TableCell>${t.commission.toFixed(2)}</TableCell> */}

                  {/* <TableCell>
                    <Badge
                      variant={
                        t.status === "completed"
                          ? "secondary"
                          : t.status === "disputed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell> */}
                  {/* <TableCell>
                    <div className="flex items-center gap-2">
                      {t.status === "completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRefund?.(t.id)}
                        >
                          Refund
                        </Button>
                      )}
                      {t.status === "disputed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onResolveDispute?.(t.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (section === "revenue") {
    const total = transactions.reduce(
      (s, t) => s + (t.status === "completed" ? t.amount : 0),
      0
    );
    const refunds = transactions.reduce(
      (s, t) => s + (t.status === "refunded" ? t.amount : 0),
      0
    );
    const disputes = transactions.filter((t) => t.status === "disputed").length;

    return (
      <div className="space-y-4">
        {/* <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-md border">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold">${total.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-md border">
            <p className="text-sm text-muted-foreground">Refunds</p>
            <p className="text-xl font-semibold">${refunds.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-md border">
            <p className="text-sm text-muted-foreground">Open Disputes</p>
            <p className="text-xl font-semibold">{disputes}</p>
          </div>
        </div> */}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Revenue Type</TableHead>
                {/* <TableHead>Service Name</TableHead> */}
                <TableHead>Amount</TableHead>
                <TableHead>Commission Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length ? (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.serviceType}</TableCell>
                    {/* <TableCell>{t.serviceName}</TableCell> */}
                    <TableCell>${t.amount.toFixed(2)}</TableCell>
                    <TableCell>${t.commission.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // refunds / disputes
  const disputes = transactions.filter((t) => t.status === "disputed");
  const refunded = transactions.filter((t) => t.status === "refunded");
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Txn ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...disputes, ...refunded].length ? (
              [...disputes, ...refunded].map((t) => (
                <TableRow key={t.id}>
                  <TableCell>#{t.id}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.buyer}</TableCell>
                  <TableCell>{t.vendor}</TableCell>
                  <TableCell>${t.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === "disputed" ? "destructive" : "secondary"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {t.status === "disputed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onResolveDispute?.(t.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No refunds or disputes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
