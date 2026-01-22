"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../content/components/data-table";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import axios from "../../../axios";

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

export default function ContentPage() {
  const [content, setContent] = useState<ContentData[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/reports");

      if (response.status === 200) {
        setContent(response.data.data);
        // setTotalPages(response.data.data.meta.totalPages);
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
  }, [page, limit]);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-muted-foreground text-[22px] font-bold">
        Reported Content
      </h1>
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-4">
        <DataTable
          contentData={content}
          // onDeleteUser={handleDeleteUser}
          // onEditUser={handleEditUser}
          // onAddUser={handleAddUser}
        />
      </div>
    </div>
  );
}
