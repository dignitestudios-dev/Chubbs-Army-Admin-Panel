"use client";

import { Eye } from "lucide-react";

import { formatDate } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileUrl: string | null;
  accountStatus: string;
  role: string;
  status: string;
  joinedAt: string;
  name?: string;
  plan?: { duration: string }[];
  numberOfPetProfiles?: number;
  username?: string;
  businessName?: string;
  products?: string; // Add other fields as needed
  services?: string; // Add other fields as needed
  approvedEvents?: number; // Add other fields as needed
  unapprovedEvents?: number;
  // Add other fields as needed
}

interface DataTableProps {
  users: User[];
  loading?: boolean;
  onFilterChange: (type: string, value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DataTable({
  users,
  loading = false,
  activeTab,
  setActiveTab,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-orange-600 bg-orange-50";
      case "SUSPENDED":
        return "text-red-600 bg-red-50";
      case "BANNED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600 bg-red-50";
      case "SERVICE_PROVIDER":
        return "text-blue-600 bg-blue-50";
      case "EVENT_ORGANIZER":
        return "text-yellow-600 bg-yellow-50";
      case "MAINTAINER":
        return "text-green-600 bg-green-50";
      case "USER":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const generateAvatar = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
      <h1 className="text-muted-foreground text-[22px] font-bold">
        User Management
      </h1>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="USER">Users</TabsTrigger>
          <TabsTrigger value="SERVICE_PROVIDER">Vendors</TabsTrigger>
          <TabsTrigger value="EVENT_ORGANIZER">Event Organizers</TabsTrigger>
        </TabsList>
        <TabsContent value="USER" className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
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
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                  <SelectItem value="BLOCKED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            {loading ? (
              <TableSkeleton rows={pageSize} columns={4} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date of Joining</TableHead>
                    <TableHead>Pet Profiles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-medium">
                                {user.name?.[0] || "" || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.name || "User"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {user?.plan[0]?.duration || "—"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(user.joinedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {user.numberOfPetProfiles || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={() =>
                                router.push(`/dashboard/users/${user.id}`)
                              }
                            >
                              <Eye className="size-4" />
                              <span className="sr-only">View user</span>
                            </Button>
                          </div>
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
        <TabsContent value="SERVICE_PROVIDER" className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
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
            {/* <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Status
              </Label>
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
          <div className="rounded-md border">
            {loading ? (
              <TableSkeleton rows={pageSize} columns={5} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Services</TableHead>

                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-medium">
                                {user.username?.[0] || "" || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {user.username || ""} {user.lastName || ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.businessName || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {user.products || "0"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {user.services || "0"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={() =>
                                router.push(`/dashboard/users/${user.id}`)
                              }
                            >
                              <Eye className="size-4" />
                              <span className="sr-only">View vendor</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        <TabsContent value="EVENT_ORGANIZER" className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-4 sm:gap-4">
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
            {/* <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Status
              </Label>
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger
                  className="cursor-pointer w-full"
                  id="role-filter"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
          <div className="rounded-md border">
            {loading ? (
              <TableSkeleton rows={pageSize} columns={6} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved Events</TableHead>
                    <TableHead>Unapproved Events</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-medium">
                                {user.username?.[0] || "" || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {user.username ?? "Organizer"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.businessName || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {user.approvedEvents || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {user.unapprovedEvents || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={() =>
                                router.push(`/dashboard/users/${user.id}`)
                              }
                            >
                              <Eye className="size-4" />
                              <span className="sr-only">View organizer</span>
                            </Button>
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
            )}
          </div>
        </TabsContent>
      </Tabs>

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
