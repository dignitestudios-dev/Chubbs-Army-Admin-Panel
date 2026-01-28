"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { calculateAge } from "@/lib/utils";

interface PetData {
  id: string;
  petName: string;
  breed: string;
  dob: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    reportedPets: number;
  };
}

interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  age: string;
  ownerName: string;
  ownerEmail: string;
}

interface DataTableProps {
  pets: PetData[];
  loading?: boolean;
  onDeletePet: (id: string) => void;
  onEditPet: (pet: PetData) => void;
  onAddPet: (petData: PetFormValues) => void;
  onFilterChange: (type: string, value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function DataTable({
  pets,
  loading = false,
  onDeletePet,
  onEditPet,
  onAddPet,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  totalPages,
  currentPage,
  pageSize,
}: DataTableProps) {
  const router = useRouter();

  const handleFilterChange = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    onPageSizeChange(newPageSize);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-muted-foreground text-[22px] font-bold">
        Pet Management
      </h1>

      <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <input
            id="search"
            type="text"
            placeholder="Search by pet name or owner"
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Filter
          </Label>
          <Select onValueChange={(v) => handleFilterChange("filter", v)}>
            <SelectTrigger className="cursor-pointer w-full" id="status-filter">
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="young">Young</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className="rounded-md border">
        {loading ? (
          <TableSkeleton rows={pageSize} columns={7} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                {/* <TableHead>Species</TableHead> */}
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pets?.length ? (
                pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-medium">
                            {(pet.petName?.[0] || "") +
                              (pet.user?.firstName?.[0] || "") || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{pet.petName}</span>
                          {/* <span className="text-sm text-muted-foreground">
                            {pet.id}
                          </span> */}
                        </div>
                      </div>
                    </TableCell>

                    {/* <TableCell>
                      <span className="text-sm">Unknown</span>
                    </TableCell> */}
                    <TableCell>
                      <span className="text-sm">{pet.breed}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{calculateAge(pet.dob)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {pet.user.firstName} {pet.user.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground w-[240px] truncate">
                          {pet.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pet._count.reportedPets > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {pet._count.reportedPets}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/pet/${pet.id}`)
                          }
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">View pet</span>
                        </Button>

                        {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => onEditPet(pet)}
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit pet</span>
                      </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={pageSize.toString()} />
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
              {currentPage} of {totalPages}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
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
