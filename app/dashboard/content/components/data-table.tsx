"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

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

interface ContentData {
  id: number;
  creatorName: string;
  creatorEmail: string;
  avatar: string;
  contentType: string;
  postedOn: string;
  engagement: string;
  reports: number;
}

interface UserFormValues {
  name: string;
  email: string;
  role: string;
  plan: string;
  billing: string;
  status: string;
}

interface DataTableProps {
  contentData: ContentData[];
  onDeleteUser: (id: number) => void;
  onEditUser: (contentData: ContentData) => void;
  onAddUser: (userData: UserFormValues) => void;
}

export function DataTable({
  contentData,
  onDeleteUser,
  onEditUser,
  onAddUser,
}: DataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(contentData?.length / 10),
  );

  useEffect(() => {
    setTotalPages(Math.ceil(contentData?.length / pageSize));
  }, [contentData?.length, pageSize]);

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`${filterType}: ${value}`);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    const newTotalPages = Math.ceil(contentData?.length / newPageSize);
    setPageSize(newPageSize);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      console.log(`Page changed to ${newPage}`);
      // API Call
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-orange-600 bg-orange-50";
      case "Error":
        return "text-red-600 bg-red-50";
      case "Inactive":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "text-red-600 bg-red-50";
      case "Editor":
        return "text-blue-600 bg-blue-50";
      case "Author":
        return "text-yellow-600 bg-yellow-50";
      case "Maintainer":
        return "text-green-600 bg-green-50";
      case "Subscriber":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span></span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <UserFormDialog onAddUser={onAddUser} />
        </div>
      </div> */}
      {/* <h1 className="text-muted-foreground text-[22px] font-bold">
        Reported Content
      </h1> */}

      {/* <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
        <div className="space-y-2 sm:col-span-2">
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
        <div className="space-y-2">
          <Label htmlFor="role-filter" className="text-sm font-medium">
            Status
          </Label>
          <Select
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="cursor-pointer w-full" id="role-filter">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="reported">Most Reported</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Posted On</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {contentData?.length ? (
              contentData?.map((content) => (
                <TableRow key={content.id}>
                  {/* Creator */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-medium">
                          {content.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {content.creatorName}
                        </span>
                        {/* <span className="text-sm text-muted-foreground">
                          {content.creatorEmail}
                        </span> */}
                      </div>
                    </div>
                  </TableCell>

                  {/* Content Type */}
                  <TableCell>
                    <Badge variant="secondary">{content.type}</Badge>
                  </TableCell>

                  {/* Posted On */}
                  <TableCell>
                    <span className="text-sm">{content.postedOn}</span>
                  </TableCell>

                  {/* Engagement */}
                  <TableCell>
                    <span className="text-sm">{content.engagement}</span>
                  </TableCell>

                  {/* Reports */}
                  <TableCell>
                    <Badge
                      variant={
                        content.reports > 0 ? "destructive" : "secondary"
                      }
                      onClick={() =>
                        router.push(
                          `/dashboard/content/report/${content.postId}`,
                        )
                      }
                    >
                      {content.reports}
                    </Badge>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/content/report/${content.postId}`,
                        )
                      }
                      className=" ml-2 cursor-pointer underline "
                    >
                      View
                    </button>
                  </TableCell>

                  {/* Actions (UNCHANGED) */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/content/${content.id}`)
                        }
                      >
                        <Eye className="size-4" />
                        <span className="sr-only">View content</span>
                      </Button>

                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => onEditUser(content)}
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit content</span>
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      {/* <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
}
