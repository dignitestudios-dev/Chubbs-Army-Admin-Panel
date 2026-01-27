import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

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

// Props for table
interface DataTableProps {
  contentData: ContentData[];
}

const ReportsTable = ({ contentData }: DataTableProps) => {
  console.log("🚀 ~ ReportsTable ~ contentData:", contentData);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(contentData?.length / 10),
  );

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
  return (
    <div>
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
                <TableRow key={content?.post?.id}>
                  {/* Creator */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-medium">
                          {content?.post?.pet?.profileUrl}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {content?.post?.pet?.petName}
                        </span>
                        {/* <span className="text-sm text-muted-foreground">
                          {content.creatorEmail}
                        </span> */}
                      </div>
                    </div>
                  </TableCell>

                  {/* Content Type */}
                  <TableCell>
                    <Badge variant="secondary">
                      {content?.post?.mediaType}
                    </Badge>
                  </TableCell>

                  {/* Posted On */}
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(content?.post?.createdAt)}
                    </span>
                  </TableCell>

                  {/* Engagement */}
                  <TableCell>
                    <span className="text-sm">
                      {content?.post?.totalComments} Comments{" "}
                      {content?.post?.totalLikes} Likes
                    </span>
                  </TableCell>

                  {/* Reports */}
                  <TableCell>
                    <Badge
                      variant={
                        content?.post?._count?.postreport > 0
                          ? "destructive"
                          : "secondary"
                      }
                      onClick={() =>
                        router.push(
                          `/dashboard/content/report/${content?.postId}`,
                        )
                      }
                    >
                      {content?.post?._count?.postreport || 0}
                    </Badge>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/content/report/${content?.postId}`,
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
                          router.push(`/dashboard/content/${content?.post?.id}`)
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
    </div>
  );
};

export default ReportsTable;
