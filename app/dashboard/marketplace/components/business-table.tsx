"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
interface Business {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Props {
  businesses: Business[];
}

export default function BusinessTable({ businesses }: Props) {
  const router = useRouter();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Business Email</TableHead>
            <TableHead>Business Phone</TableHead>

            <TableHead>Owner Name</TableHead>
            <TableHead>Owner Email</TableHead>
            <TableHead>Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.length ? (
            businesses.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.businessName}</TableCell>
                <TableCell>{b.businessEmail}</TableCell>
                <TableCell>{b.businessPhoneNumber}</TableCell>

                <TableCell>
                  {b.user.firstName} {b.user.lastName}
                </TableCell>
                <TableCell>{b.user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/marketplace/${b.user.id}`)
                      }
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">View content</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No businesses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
