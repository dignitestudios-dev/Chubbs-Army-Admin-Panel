"use client";

import axios from "@/axios";
import { ErrorToast } from "@/components/Toaster";
import { AxiosError } from "axios";
import { use, useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [content, setContent] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/admin/posts/${id}`);
        if (response.status === 200) {
          setContent(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to fetch user details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-bold">Content Detail</h1>

            <div className="flex gap-2">
              <Button onClick={() => router.back()}>Back</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-md overflow-hidden border bg-muted relative">
                {content?.media && content?.media?.length > 0 ? (
                  <>
                    {content?.media[currentMediaIndex]?.fileType?.startsWith(
                      "image/",
                    ) ? (
                      <img
                        src={content.media[currentMediaIndex].fileUrl}
                        alt={content.media[currentMediaIndex].fileName}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <video controls className="w-full max-h-[480px] bg-black">
                        <source
                          src={content.media[currentMediaIndex].fileUrl}
                          type={content.media[currentMediaIndex].fileType}
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {content.media.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentMediaIndex((prev) =>
                              prev > 0 ? prev - 1 : content.media.length - 1,
                            )
                          }
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentMediaIndex((prev) =>
                              prev < content.media.length - 1 ? prev + 1 : 0,
                            )
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {content.media.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentMediaIndex(index)}
                              className={`w-2 h-2 rounded-full ${index === currentMediaIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">
                    No media available
                  </p>
                )}
              </div>

              <div className="mt-3">
                <div className="text-sm text-muted-foreground">
                  {formatDate(content?.createdAt)}
                </div>
                <h2 className="text-lg font-semibold ">{content?.title}</h2>

                <p className="text-sm text-muted-foreground mt-1">
                  {content?.description ?? "--"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span className="text-sm">{content?.totalLikes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span className="text-sm">
                      {content?.totalComments || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium">Content Owner</h3>
                <div className="flex items-center gap-3 mt-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={content?.pet?.profileUrl}
                      alt={content?.pet?.petName}
                    />
                    <AvatarFallback>
                      {(content?.pet?.petName || "--")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {content?.pet?.petName ?? "--"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      @{content?.pet?.petName}
                    </span>
                  </div>
                </div>
              </div>
              {(content?._count?.postreport > 0 ||
                content?.reportCount > 0) && (
                <div className="rounded-md border p-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Reports</h3>
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        router.push(
                          `/dashboard/content/report/${content?.id}?creator=${encodeURIComponent(
                            content?.pet?.petName,
                          )} `,
                        )
                      }
                    >
                      View Reports
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Report count:{" "}
                    {content?._count?.postreport || content?.reportCount}
                  </p>
                </div>
              )}
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium">Content Type</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {content?.type}
                </p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
