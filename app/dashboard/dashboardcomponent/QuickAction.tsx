"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Flag, ClipboardClock, Hourglass, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export function QuickAction({ statsData }: { statsData: StatsData | null }) {
  const router = useRouter();
  const [description, setDescription] = useState("");

  const performanceMetrics: QuickAction[] = useMemo(() => {
    if (!statsData) return [];
    return [
      {
        title: "Flagged Content",
        current: statsData.compliance?.reportedContentCount || 0,
        action: "Review Now",
        icon: Flag,
        style: "text-red-400",
        route: "dashboard/content/report/post_2",
      },
      {
        title: "Pending Events",
        current: statsData.event?.pendingEvents || 0,
        action: "Review Now",
        style: "text-blue-400",
        icon: Hourglass,
        route: "dashboard/event",
      },
      {
        title: "Send Announcement",
        current: "Write Description",
        action: "Send Announcement",
        style: "text-green-400",
        icon: NotebookPen,
        route: "",
      },
    ];
  }, [statsData]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {performanceMetrics.map((metric, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <metric.icon className={` size-6 ${metric.style}`} />
              {metric?.growth && (
                <Badge
                  variant="outline"
                  className={cn(
                    metric.growth >= 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  {/* {metric.growth >= 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {metric.growth >= 0 ? "+" : ""}
                      {metric.growth}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {metric.growth}%
                    </>
                  )} */}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {metric.title}
              </p>
              {metric.current === "Write Description" ? (
                <Input
                  placeholder="Write Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <div className="text-2xl font-bold">{metric.current}</div>
              )}
              {metric?.action && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <button
                    onClick={() => router.push(metric.route)}
                    className="cursor-pointer p-2 border-[1px] border-green-200 bg-green-50 text-green-700 rounded-3xl"
                  >
                    {metric.action}
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
