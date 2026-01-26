"use client";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import axios from "../../../axios";
import ReportsTable from "./components/data-table";

interface Pet {
  id: string;
  petName: string;
  profileUrl: string;
}
interface PostCount {
  postreport: number;
}
interface PostMedia {
  uuid: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  captionUrl: string | null;
  thumbnailUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  description: string | null;
  media: PostMedia[];
  mediaType: "Image" | "Video";
  totalComments: number;
  totalLikes: number;
  createdAt: string;
  type: "Post" | "Reel";
  _count: PostCount;
  pet: Pet;
}

interface ContentData {
  id: string;
  petId: string;
  postId: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  pet: Pet;
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
        <ReportsTable contentData={content} />
      </div>
    </div>
  );
}
