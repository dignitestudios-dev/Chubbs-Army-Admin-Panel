"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGlobalConfirm } from "@/components/GlobalConfirm";
import { Trash2 } from "lucide-react";

export default function UserPosts({ posts: initialPosts, onDeletePost }) {
  const [posts, setPosts] = useState(initialPosts || []);

  const confirm = useGlobalConfirm();

  const handleRemoveWithConfirm = async (postId) => {
    const ok = await confirm({
      title: "Remove post",
      description: "This will permanently remove the post.",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      destructive: true,
    });

    if (ok) {
      await onDeletePost(postId);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Posts & Engagement</h2>
          <p className="text-gray-500">No posts available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center w-full mb-1">
          <h2 className="text-lg font-semibold mb-2">Posts & Engagement</h2>
          {/* <Button onClick={handleRemoveAllWithConfirm}>Remove All</Button> */}
        </div>
        <div className="h-64 overflow-y-auto border rounded-md">
          <ul className="divide-y divide-gray-200 px-2">
            {posts.map((post, i) => (
              <li
                key={post.id ?? i}
                className="py-2 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-[18px]">{post.title}</span>
                  <span className="text-sm text-gray-500">
                    {post.totalLikes} Likes
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.totalComments} Comments
                  </span>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleRemoveWithConfirm(post.id)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
