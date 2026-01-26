"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGlobalConfirm } from "@/components/GlobalConfirm";
import { Trash2, Plus, Check, X, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/axios";
import { AxiosError } from "axios";
import { ErrorToast } from "@/components/Toaster";
import { calculateAge } from "@/lib/utils";
type PostType = "reels" | "challenges" | "lost-found";

interface Post {
  id: string;
  title: string;
  views: number;
  likes: number;
  type: PostType;
  totalLikes: number;
  totalComments: number;
  createdAt: string;
}

export default function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const confirm = useGlobalConfirm();

  const [activeTab, setActiveTab] = useState<PostType>("reels");

  async function handleRemovePost(postId: string) {
    console.log("🚀 ~ handleRemovePost ~ postId:", postId);
    const ok = await confirm({
      title: "Remove post",
      description: "This will permanently remove the post for this pet.",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      destructive: true,
    });
    console.log("🚀 ~ handleRemovePost ~ ok:", ok);
    // if (ok) setPosts((p) => p.filter((x) => x.id !== postId));
  }

  const [petData, setPetData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/admin/pets/${id}`);

        if (response.status === 200) {
          setPetData(response.data.data);
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
      fetchPetDetails();
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={petData.profileUrl || "/default-pet-avatar.png"}
                  alt={`${petData.petName} profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = "/default-pet-avatar.png";
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{petData.petName}</h1>
                <p className="text-sm text-muted-foreground">
                  {petData.breed} • {calculateAge(petData.dob)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.back()}>Back</Button>
            </div>
          </div>
          <div>
            <p className="text-sm mt-2">
              Owner: {petData.user.firstName} {petData.user.lastName} (@
              {petData.user.email})
            </p>
          </div>

          {/* Rank & Badge Control */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Rank & Badges </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border rounded p-2">
                    <div>
                      <div className="font-medium">{petData?.rank}</div>
                      <div className="text-sm text-muted-foreground">
                        Total Points: {petData?.points} points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Section */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Posts</h2>
                <p className="text-sm text-muted-foreground">
                  {petData?.posts?.length} posts
                </p>
              </div>

              {/* <Card>
            <CardContent className="space-y-4"> */}
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                {/* <h2 className="text-lg font-semibold">Posts</h2> */}
                <Tabs
                  defaultValue="reels"
                  // onValueChange={(v) => setActiveTab(v as any)}
                  onValueChange={(v) => {
                    if (v === "reels" || v === "lost-found") {
                      setActiveTab(v);
                    }
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="reels">Reels</TabsTrigger>
                    {/* <TabsTrigger value="challenges">Challenges</TabsTrigger> */}
                    <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tab Content */}
              <Tabs value={activeTab}>
                <TabsContent value="reels">
                  <PostList
                    posts={petData?.posts?.reels}
                    onRemove={handleRemovePost}
                  />
                </TabsContent>

                <TabsContent value="lost-found">
                  <PostList
                    posts={petData?.posts?.lostAndFound}
                    onRemove={handleRemovePost}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Challenges</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <PostList
                    posts={petData?.posts?.challenges}
                    onRemove={handleRemovePost}
                  />
                  {/* {challenges.map((c) => (
                    <div key={c.id} className="border rounded p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {c.title}{" "}
                            <span className="text-muted-foreground">
                              - ID: {c.id}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {c.rules} • {c.reward} • {c.duration}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/content/post_1`)
                            }
                          >
                            <Eye className="size-4" />
                            <span className="sr-only">View content</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))} */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function PostList({
  posts,
  onRemove,
}: {
  posts: Post[];
  onRemove: (id: string) => void;
}) {
  const router = useRouter();
  if (!posts?.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6">
        No posts available.
      </div>
    );
  }

  return (
    <div className="space-y-3 h-64 overflow-y-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center justify-between border rounded p-3"
        >
          <div>
            <div className="font-medium">{post.title}</div>
            <div className="text-sm text-muted-foreground">
              {post.totalLikes} likes • {post.totalComments} comments
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => router.push(`/dashboard/content/${post.id}`)}
            >
              <Eye className="size-4" />
              <span className="sr-only">View content</span>
            </Button>
            <Button variant="ghost" onClick={() => onRemove(post.id)}>
              <Trash2 className="size-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
