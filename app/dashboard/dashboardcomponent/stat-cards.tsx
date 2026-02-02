import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  UserCheck,
  Clock5,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Toolbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function StatCards({ statsData }: { statsData: any }) {
  const performanceMetrics: StatMetric[] = useMemo(() => {
    if (!statsData) return [];
    return [
      {
        title: "Total Posts & Videos",
        current: statsData?.content?.totalPosts,
        icon: CreditCard,
      },
      {
        title: "Active Vendors",
        current: statsData?.ecosystem?.activeVendors,
        // growth: 32.8,
        icon: UserCheck,
      },
      {
        title: "Active Events Organizer",
        current: statsData?.ecosystem?.activeOrganizers,
        // growth: 15.8,
        icon: Toolbox,
      },
      {
        title: "Total Users",
        current: `${statsData?.users?.total}`,
        icon: UserCheck,
      },
    ];
  }, [statsData]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {performanceMetrics?.map((metric, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <metric.icon className="text-muted-foreground size-6" />
              {metric?.growth && (
                <Badge
                  variant="outline"
                  className={cn(
                    metric.growth >= 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  {metric?.growth >= 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {metric.growth >= 0 ? "+" : ""}
                      {metric.growth}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {metric?.growth}%
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {metric?.title}
              </p>
              <div className="text-2xl font-bold">{metric?.current}</div>
              {metric?.previous && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {metric?.previous}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
