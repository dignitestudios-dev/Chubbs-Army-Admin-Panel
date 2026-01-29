"use client";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import axios from "../../../axios";
import ReportsTable from "./components/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

// Shared Pet type
// Pet / creator info
interface Pet {
  id: string;
  petName: string;
  profileUrl: string;
}

// Media attached to the post
interface PostMedia {
  uuid: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  captionUrl: string | null;
  thumbnailUrl: string | null;
}

// Prisma-style count object
interface PostCount {
  postreport: number;
}

// Full Post object
interface Post {
  id: string;
  title: string;
  description: string | null;
  media: PostMedia[];
  mediaType: "Image" | "Video";
  type: "Post" | "Reel";
  createdAt: string;
  totalComments: number;
  totalLikes: number;
  pet: Pet;
  _count: PostCount;
}

// Root row object (used in table / list)
interface ContentData {
  postId: string;
  creator: string;
  contentType: "Post" | "Reel";
  postedOn: string;
  engagement: number;
  reports: number;
  post: Post;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentData[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const params: unknown = { page, limit };
    try {
      const response = await axios.get("/admin/reports", { params });
      console.log("🚀 ~ fetchUsers ~ response:", response.data.data);

      if (response.status === 200) {
        setContent(response?.data?.data?.posts);
        setTotalPages(response?.data?.data?.meta?.totalPages ?? 1);
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-muted-foreground text-[22px] font-bold">
        Reported Content
      </h1>
      {loading ? (
        <TableSkeleton rows={limit} columns={4} />
      ) : (
        <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-4">
          <ReportsTable
            contentData={content}
            totalPages={totalPages}
            currentPage={page}
            pageSize={limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
