"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import axios from "../../../axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import { useDebounce } from "@/hooks/use-debounce";

interface UserData {
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
export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("USER");

  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status && status !== "all") params.status = status;
      if (activeTab && activeTab !== "USER") {
        params.role = activeTab;
      } else {
        params.role = "USER";
      }

      const response = await axios.get("/admin/users", { params });

      if (response.status === 200) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.meta.totalPages);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, status, page, limit, activeTab]);

  const handleFilterChange = (type: string, value: string) => {
    if (type === "search") setSearch(value);
    else if (type === "status") setStatus(value);
    setPage(1); // reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-4">
        <DataTable
          users={users}
          loading={loading}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalPages={totalPages}
          currentPage={page}
          pageSize={limit}
        />
      </div>
    </div>
  );
}
