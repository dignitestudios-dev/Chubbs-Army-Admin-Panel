"use client";

import React from "react";
import { Eye, Pencil, Trash, Flag } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

type SectionType = "vendors" | "listings" | "orders";

interface Vendor {
  id: number;
  name: string;
  businessName: string;
  email: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
}

interface Listing {
  id: number;
  email: string;
  phone: string;
  title: string;
  vendor: string;
  category: string;
  status: "review" | "live" | "removed";
}

interface Order {
  id: number;
  buyer: string;
  vendor: string;
  item: string;
  status: "pending" | "fulfilled" | "disputed" | "cancelled";
  bookingDate: string;
  location: string;
  providerName: string;
  businessName: string;
  serviceName: string;
  category: string;
}

interface Props {
  section: SectionType;
  vendors?: Vendor[];
  listings?: Listing[];
  orders?: Order[];
  email: string;
  phone: string;
  onApproveVendor?: (id: number) => void;
  onRejectVendor?: (id: number) => void;
  onVerifyDocs?: (id: number) => void;
  onSuspendVendor?: (id: number) => void;
  onEditListing?: (id: number) => void;
  onRemoveListing?: (id: number) => void;
  onFlagListing?: (id: number) => void;
  onViewOrder?: (id: number) => void;
  onEscalateOrder?: (id: number) => void;
}

export default function MarketplaceTable(props: Props) {
  const { section } = props;
  const router = useRouter();

  if (section === "vendors") {
    const vendors = props.vendors || [];
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length ? (
              vendors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {v.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{v.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ID {v.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{v.businessName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{v.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.verified ? "secondary" : "destructive"}>
                      {v.verified ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{v.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {v.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => props.onApproveVendor?.(v.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => props.onRejectVendor?.(v.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => props.onVerifyDocs?.(v.id)}
                      >
                        Verify Docs
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => props.onSuspendVendor?.(v.id)}
                      >
                        Suspend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No vendors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (section === "listings") {
    const listings = props.listings || [];
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length ? (
              listings.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{l.title}</span>
                      {/* <span className="text-sm text-muted-foreground">
                        ID {l.id}
                      </span> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{l.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{l.phone}</span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/dashboard/content/${l.id}`)}
                      className="cursor-pointer"
                    >
                      <span className="text-sm">{l.vendor}</span>
                    </button>
                  </TableCell>

                  <TableCell>
                    {/* <Badge
                      variant={
                        l.status === "live" ? "secondary" : "destructive"
                      }
                    >
                      {l.status}
                    </Badge> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/marketplace/${l.id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View products</span>
                    </Button>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => props.onEditListing?.(l.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => props.onRemoveListing?.(l.id)}
                      >
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => props.onFlagListing?.(l.id)}
                      >
                        Flag
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No listings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  // orders
  const orders = props.orders || [];
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service ID</TableHead>
            <TableHead>Service Provider</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Booking Date</TableHead>
            {/* <TableHead>Status</TableHead> */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length ? (
            orders.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <span className="font-medium">#{s.id}</span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {s.providerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {s.location}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{s.businessName}</span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{s.serviceName}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.category}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{s.bookingDate}</span>
                </TableCell>

                {/* <TableCell>
                  <Badge
                    variant={
                      s.status === "fulfilled"
                        ? "secondary"
                        : s.status === "disputed"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {s.status}
                  </Badge>
                </TableCell> */}

                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      router.push(`/dashboard/marketplace/service/${s.id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                    <span className="sr-only">View Service</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No services found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
